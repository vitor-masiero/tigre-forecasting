from numpy import float64
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import uuid
import datetime
from typing import Optional, Dict
from app.models.ponto_previsao import PontosPrevisao
from app.models.previsao import Previsao
from app.models.metricas import MetricasPrevisao

import pandas as pd

class ProphetRepository:
    def __init__(self, db_session: Session):
        self.db = db_session

    def save_forecast_run(self, model: str, total_skus: int, wmape: Optional[str] = 
        None) -> str:
        try:
            new_run = Previsao(
                id_previsao=str(uuid.uuid4()),
                dt_processamento=datetime.datetime.now(),
                ds_modelo=model,
                qtd_total_skus=total_skus,
                num_wmape=wmape
            )
            self.db.add(new_run)
            self.db.commit()
            self.db.refresh(new_run)
            return new_run.id_previsao
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"Erro ao salvar a execução da previsão: {e}")
            raise e
        
        
    def save_forecast_points(self, forecast_df: pd.DataFrame, run_id: str, sku: str) -> Dict[str, int]:
        try:
            saved_count = 0
            error_count = 0
            
            for _, row in forecast_df.iterrows():
                try:
                    ponto_previsao = PontosPrevisao(
                        id_previsao=run_id,
                        cd_sku=sku,
                        dt_previsao=row['ds'],
                        data_gerado=datetime.now(),
                        num_horizonte=forecast_df.groupby(sku).cumcount() + 1,
                        num_valor_estimado=float(row['yhat']),
                        num_valor_inferior=float(row.get('yhat_lower', 0)) if pd.notna(row.get('yhat_lower')) else None,
                        num_valor_superior=float(row.get('yhat_upper', 0)) if pd.notna(row.get('yhat_upper')) else None,
                        dt_inicio_treino=None,
                        dt_fim_treino=None,
                        qtd_meses_treino=None,
                        ds_modelo="Prophet"
                    )
                    
                    self.db.add(ponto_previsao)
                    saved_count += 1
                    
                except Exception as row_error:
                    print(f"❌ Erro ao salvar ponto de previsão para SKU {row.get('cd_sku')}: {str(row_error)}")
                    error_count += 1
                    continue
            
            # Commit em batch para melhor performance
            self.db.commit()
            print(f"✅ {saved_count} pontos de previsão salvos, {error_count} erros")
            
            return {
                'saved': saved_count,
                'errors': error_count
            }
            
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"❌ Erro ao salvar pontos de previsão: {str(e)}")
            raise e

    def salvar_metricas_sku(
        self, 
        sku: str, 
        wmape: float, 
        media: float,
        coeficiente_variacao: float, 
        tendencia: float,
        forca_sazonalidade: float, 
        proporcao_zeros: float,
        changepoint_prior_scale: float, 
        seasonality_prior_scale: float,
        seasonality_mode: str,
        ds_modelo: str
    ):
        try:
            print(f"Salvando métricas para SKU {sku}: WMAPE = {wmape}")
            
            nova_metrica = MetricasPrevisao(
                ds_sku=sku,
                ds_modelo=ds_modelo,
                num_wmape=float(wmape),
                num_media=media,
                num_coeficiente_variacao=coeficiente_variacao,
                num_tendencia=tendencia,
                num_forca_sazonalidade=forca_sazonalidade,
                num_proporcao_zeros=proporcao_zeros,
                num_changepoint_prior_scale=changepoint_prior_scale,
                num_seasonality_prior_scale=seasonality_prior_scale,
                ds_seasonality_mode=seasonality_mode
            )

            self.db.add(nova_metrica)
            self.db.commit()
            
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"❌ Erro ao salvar métricas para SKU {sku}: {str(e)}")
            raise e