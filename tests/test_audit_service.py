from app.database.session import SessionLocal

from app.services.audit_service import (
    log_event,
    log_upload,
    log_exception
)

from app.utils.constants import SYSTEM


db = SessionLocal()

log_event(
    db=db,
    event_type="SYSTEM_STARTUP",
    source=SYSTEM,
    description="Application started"
)

log_upload(
    db=db,
    filename="sample_invoice.pdf",
    document_type="invoice"
)

log_exception(
    db=db,
    run_id="TEST_RUN_001",
    exception_type="TEST_ERROR",
    message="Audit service verification"
)

db.close()

print("Audit service test completed successfully")