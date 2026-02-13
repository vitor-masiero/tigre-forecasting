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

class XGBoostRepository:
    def __init__(self, db_session: Session):
        self.db = db_session

    def save_forecast_run(self, model: str, total_skus: int, wmape: Optional[str] = None) -> str:
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
            
            for idx, row in forecast_df.iterrows():
                try:
                    ponto_previsao = PontosPrevisao(
                        id_previsao=run_id,
                        cd_sku=sku,
                        dt_previsao=row['ds'],
                        data_gerado=datetime.datetime.now(),
                        num_horizonte=idx + 1,
                        num_valor_estimado=float(row['yhat']),
                        num_valor_inferior=None,
                        num_valor_superior=None,
                        dt_inicio_treino=None,
                        dt_fim_treino=None,
                        qtd_meses_treino=None,
                        ds_modelo="XGBoost"
                    )
                    
                    self.db.add(ponto_previsao)
                    saved_count += 1
                    
                except Exception as row_error:
                    print(f"❌ Erro ao salvar ponto de previsão para SKU {sku}: {str(row_error)}")
                    error_count += 1
                    continue
            
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
        bias: float,
        bias_pct: float,
        fva: float,
        mae: float,
        rmse: float,
        mape: float,
        n_estimators: int,
        learning_rate: float,
        ds_modelo: str
    ):
        try:
            print(f"Salvando métricas para SKU {sku}: WMAPE = {wmape}")
            
            nova_metrica = MetricasPrevisao(
                ds_sku=sku,
                ds_modelo=ds_modelo,
                num_wmape=float(wmape),
                num_bias=float(bias),
                num_bias_pct=float(bias_pct),
                num_fva=float(fva),
                num_mae=float(mae),
                num_rmse=float(rmse),
                num_mape=float(mape),
                num_n_estimators=n_estimators,
                num_learning_rate=learning_rate
            )

            self.db.add(nova_metrica)
            self.db.commit()
            
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"❌ Erro ao salvar métricas para SKU {sku}: {str(e)}")
            raise e