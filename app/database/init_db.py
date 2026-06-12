from app.database.session import engine, Base

# Import all models so SQLAlchemy can discover them
from app.database.models import (
    UploadedDocument,
    ReconciliationResult,
    ProcessingException,
    AuditLog
)


def init_db():
    """
    Create all database tables.
    """
    Base.metadata.create_all(bind=engine)