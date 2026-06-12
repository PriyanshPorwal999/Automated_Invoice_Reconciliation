from sqlalchemy.orm import Session

from app.database.models import (
    AuditLog,
    UploadedDocument,
    ProcessingException
)

from app.utils.logger import logger


def log_event(
    db: Session,
    event_type: str,
    source: str,
    description: str
):
    """
    General audit logging.
    Writes to database and log file.
    """

    audit_log = AuditLog(
        event_type=event_type,
        source=source,
        description=description
    )

    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)

    logger.info(
        f"[{source}] {event_type} - {description}"
    )

    return audit_log


def log_upload(
    db: Session,
    filename: str,
    document_type: str,
    status: str = "uploaded"
):
    """
    Track uploaded documents.
    """

    uploaded_document = UploadedDocument(
        filename=filename,
        document_type=document_type,
        status=status
    )

    db.add(uploaded_document)
    db.commit()
    db.refresh(uploaded_document)

    logger.info(
        f"[UPLOAD] {document_type} uploaded: {filename}"
    )

    return uploaded_document


def log_exception(
    db: Session,
    run_id: str,
    exception_type: str,
    message: str
):
    """
    Track processing exceptions.
    """

    exception_record = ProcessingException(
        run_id=run_id,
        exception_type=exception_type,
        message=message
    )

    db.add(exception_record)
    db.commit()
    db.refresh(exception_record)

    logger.error(
        f"[{exception_type}] Run ID: {run_id} - {message}"
    )

    return exception_record