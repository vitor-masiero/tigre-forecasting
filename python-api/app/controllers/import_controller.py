from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
import os
from sqlalchemy.orm import Session

from app.config.db_config import DatabaseConfig
from app.deps import get_db
from app.services.import_service import ImportService

router = APIRouter()

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}

def validate_file_extension(filename: str):
    if not filename:
        raise HTTPException(
            status_code=400,
            detail="Nome do arquivo não fornecido"
        )
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Formato não suportado. Use: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    return ext

class ImportController:

    @router.post("/upload/features-data")
    async def import_features(
        file: UploadFile = File(...),
        feature_name: str = Form(...),
        db: Session = Depends(get_db)
    ):
        ext = validate_file_extension(file.filename)

        manager = ImportService(db)

        try:
            result = await manager.processar_features(
                file=file,
                feature_name=feature_name,
                file_extension=ext,
            )
            return result

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @router.get("/list/features")
    async def list_external_features(db: Session = Depends(get_db)):
        manager = ImportService(db)
        return manager.list_features()