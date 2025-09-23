from torch import ne
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import uuid
import datetime
from typing import Optional, Dict
from app.models.ponto_previsao import PontosPrevisao
from app.models.previsao import Previsao

import pandas as pd

class ProphetRepository:
    def __init__(self, db_session: Session):
        self.db = db_session

    def save_forecast_run(self, model: str, total_skus: int, wmape: Optional[str] = 
        None) -> str:
        try:
            new_run = Previsao(
                id_previsao=str(uuid.uuid4()),
                dt_processamento=datetime.now(),
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
        
        
    def save_forecast_points(self, forecast_df: pd.DataFrame, run_id: str) -> Dict[str, int]:
        try:
            saved_count = 0
            error_count = 0
            
            for _, row in forecast_df.iterrows():
                try:
                    ponto_previsao = PontosPrevisao(
                        id_previsao=run_id,
                        cd_sku=row['cd_sku'],
                        dt_previsao=row['ds'],
                        data_gerado=datetime.now(),
                        num_horizonte=row.get('horizon', 0),
                        num_valor_estimado=float(row['yhat']),
                        num_valor_inferior=float(row.get('yhat_lower', 0)) if pd.notna(row.get('yhat_lower')) else None,
                        num_valor_superior=float(row.get('yhat_upper', 0)) if pd.notna(row.get('yhat_upper')) else None,
                        dt_inicio_treino=row.get('train_start'),
                        dt_fim_treino=row.get('train_end'),
                        qtd_meses_treino=row.get('train_rows'),
                        ds_modelo=row.get('model_version')
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