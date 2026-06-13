from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
import uuid

from app.database.session import Base


class UploadedDocument(Base):
    __tablename__ = "uploaded_documents"

    id = Column(Integer, primary_key=True, index=True)

    document_id = Column(
        String,
        unique=True,
        nullable=False,
        default=lambda: str(uuid.uuid4())
    )

    filename = Column(String, nullable=False)

    document_type = Column(String, nullable=False)

    upload_time = Column(
        DateTime,
        default=datetime.utcnow
    )

    status = Column(
        String,
        default="uploaded"
    )


class ReconciliationResult(Base):
    __tablename__ = "reconciliation_results"

    id = Column(Integer, primary_key=True, index=True)

    run_id = Column(
        String,
        unique=True,
        nullable=False,
        default=lambda: str(uuid.uuid4())
    )

    status = Column(String, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


class ProcessingException(Base):
    __tablename__ = "processing_exceptions"

    id = Column(Integer, primary_key=True, index=True)

    run_id = Column(String, nullable=False)

    exception_type = Column(String, nullable=False)

    message = Column(String, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    audit_id = Column(
        String,
        unique=True,
        nullable=False,
        default=lambda: str(uuid.uuid4())
    )

    event_type = Column(String, nullable=False)

    source = Column(String, nullable=False)

    description = Column(String, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )



# from sqlalchemy import (
# Column,
# Integer,
# String,
# DateTime
# )

# from datetime import datetime

# from app.database.session import Base


# class AuditLog(Base):
#     __tablename__ = "audit_logs"

#     id = Column(
#         Integer,
#         primary_key=True,
#         index=True
#     )

#     event_type = Column(
#         String,
#         nullable=False
#     )

#     file_name = Column(
#         String,
#         nullable=True
#     )

#     status = Column(
#         String,
#         nullable=False
#     )

#     details = Column(
#         String,
#         nullable=True
#     )

#     created_at = Column(
#         DateTime,
#         default=datetime.utcnow
#     )