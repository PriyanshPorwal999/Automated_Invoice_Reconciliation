from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from typing import List

import uuid
import os

from app.database.session import get_db
from app.services.audit_service import (
    log_upload,
    log_event
)
from app.utils.constants import UPLOAD_API
from app.config import (
    UPLOAD_DIR,
    MAX_FILE_SIZE_MB
)

router = APIRouter()


@router.post("/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
    document_type: str = Form(...),
    db: Session = Depends(get_db)
):
    uploaded_count = 0

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    for file in files:

        # MIME validation
        if file.content_type != "application/pdf":
            raise HTTPException(
                status_code=400,
                detail=f"{file.filename} is not a PDF file"
            )

        # Read file bytes
        content = await file.read()

        # File size validation
        file_size_mb = len(content) / (1024 * 1024)

        if file_size_mb > MAX_FILE_SIZE_MB:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"{file.filename} exceeds "
                    f"{MAX_FILE_SIZE_MB} MB limit"
                )
            )

        # Generate secure filename
        unique_filename = f"{uuid.uuid4()}.pdf"

        file_path = os.path.join(
            UPLOAD_DIR,
            unique_filename
        )

        # Save file
        with open(file_path, "wb") as buffer:
            buffer.write(content)

        # Database record
        log_upload(
            db=db,
            filename=unique_filename,
            document_type=document_type
        )

        uploaded_count += 1

    # Audit trail
    log_event(
        db=db,
        event_type="FILE_UPLOAD",
        source=UPLOAD_API,
        description=(
            f"{uploaded_count} file(s) uploaded "
            f"as {document_type}"
        )
    )

    return {
        "message": "Files uploaded successfully",
        "uploaded_count": uploaded_count
    }