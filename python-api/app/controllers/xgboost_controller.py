from app.deps import get_db
from app.repository.xgboost_repository import XGBoostRepository
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Float
from app.models.metricas import MetricasPrevisao

router = APIRouter()


class XGBoostController:
    @router.get("/xgboost/metrics/general")
    def get_general_metrics(db: Session = Depends(get_db)):
        try:
            metrics = db.query(
                func.avg(cast(MetricasPrevisao.num_wmape, Float)).label('avg_wmape'),
                func.min(cast(MetricasPrevisao.num_wmape, Float)).label('min_wmape'),
                func.max(cast(MetricasPrevisao.num_wmape, Float)).label('max_wmape'),
                func.avg(MetricasPrevisao.num_bias).label('avg_bias'),
                func.min(MetricasPrevisao.num_bias).label('min_bias'),
                func.max(MetricasPrevisao.num_bias).label('max_bias'),
                func.avg(MetricasPrevisao.num_bias_pct).label('avg_bias_pct'),
                func.count(MetricasPrevisao.id_metrica).label('total_predictions')
            ).filter(
                MetricasPrevisao.ds_modelo == 'XGBoost'
            ).first()

            if not metrics or metrics.total_predictions == 0:
                raise HTTPException(
                    status_code=404,
                    detail="Nenhuma métrica encontrada para o modelo XGBoost"
                )

            return {
                "model": "XGBoost",
                "total_predictions": metrics.total_predictions,
                "wmape": {
                    "average": round(float(metrics.avg_wmape), 2) if metrics.avg_wmape else None,
                    "min": round(float(metrics.min_wmape), 2) if metrics.min_wmape else None,
                    "max": round(float(metrics.max_wmape), 2) if metrics.max_wmape else None
                },
                "bias": {
                    "average": round(float(metrics.avg_bias), 2) if metrics.avg_bias else None,
                    "min": round(float(metrics.min_bias), 2) if metrics.min_bias else None,
                    "max": round(float(metrics.max_bias), 2) if metrics.max_bias else None
                },
                "bias_percentage": {
                    "average": round(float(metrics.avg_bias_pct), 2) if metrics.avg_bias_pct else None
                }
            }

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar métricas: {str(e)}"
            )

    @router.get("/xgboost/metrics/by-sku")
    def get_metrics_by_sku(sku: str = None, db: Session = Depends(get_db)):
        try:
            query = db.query(MetricasPrevisao).filter(
                MetricasPrevisao.ds_modelo == 'XGBoost'
            )

            if sku:
                query = query.filter(MetricasPrevisao.ds_sku == sku)

            results = query.all()

            if not results:
                raise HTTPException(
                    status_code=404,
                    detail=f"Nenhuma métrica encontrada para o SKU: {sku}" if sku else "Nenhuma métrica encontrada"
                )

            metrics_list = []
            for metric in results:
                metrics_list.append({
                    "sku": metric.ds_sku,
                    "model": metric.ds_modelo,
                    "wmape": float(metric.num_wmape) if metric.num_wmape else None,
                    "bias": round(float(metric.num_bias), 2) if metric.num_bias else None,
                    "bias_pct": round(float(metric.num_bias_pct), 2) if metric.num_bias_pct else None,
                    "fva": round(float(metric.num_fva), 2) if metric.num_fva else None,
                    "mae": round(float(metric.num_mae), 2) if metric.num_mae else None,
                    "rmse": round(float(metric.num_rmse), 2) if metric.num_rmse else None,
                    "mape": round(float(metric.num_mape), 2) if metric.num_mape else None,
                    "n_estimators": metric.num_n_estimators,
                    "learning_rate": metric.num_learning_rate
                })

            return {
                "total_records": len(metrics_list),
                "metrics": metrics_list
            }

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar métricas: {str(e)}"
            )

    @router.get("/xgboost/metrics/top-worst")
    def get_top_worst_predictions(limit: int = 10, db: Session = Depends(get_db)):
        try:
            worst_wmape = db.query(MetricasPrevisao).filter(
                MetricasPrevisao.ds_modelo == 'XGBoost',
                MetricasPrevisao.num_wmape.isnot(None)
            ).order_by(
                cast(MetricasPrevisao.num_wmape, Float).desc()
            ).limit(limit).all()

            best_wmape = db.query(MetricasPrevisao).filter(
                MetricasPrevisao.ds_modelo == 'XGBoost',
                MetricasPrevisao.num_wmape.isnot(None)
            ).order_by(
                cast(MetricasPrevisao.num_wmape, Float).asc()
            ).limit(limit).all()

            def format_metric(metric):
                return {
                    "sku": metric.ds_sku,
                    "wmape": float(metric.num_wmape) if metric.num_wmape else None,
                    "bias": round(float(metric.num_bias), 2) if metric.num_bias else None,
                    "bias_pct": round(float(metric.num_bias_pct), 2) if metric.num_bias_pct else None
                }

            return {
                "worst_predictions": [format_metric(m) for m in worst_wmape],
                "best_predictions": [format_metric(m) for m in best_wmape]
            }

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao buscar métricas: {str(e)}"
            )