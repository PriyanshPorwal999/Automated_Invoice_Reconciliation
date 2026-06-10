from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# This creates a SQLite database file called audit.db in your project folder
engine = create_engine("sqlite:///audit.db", echo=False)
Base = declarative_base()

# Session is used to talk to the database
SessionLocal = sessionmaker(bind=engine)

# ── TABLE 1: Stores every uploaded document ──
class Document(Base):
    __tablename__ = "documents"

    id            = Column(Integer, primary_key=True, index=True)
    vendor_name   = Column(String,  nullable=True)   # nullable — OCR may fail
    doc_type      = Column(String,  nullable=False)
    doc_id        = Column(String,  nullable=True)
    date          = Column(String,  nullable=True)
    total_amount  = Column(Float,   nullable=True)
    raw_text      = Column(Text,    nullable=True)
    extracted     = Column(Text,    nullable=True)
    uploaded_at   = Column(DateTime, default=datetime.utcnow)

# ── TABLE 2: Stores every defect found ──
class Defect(Base):
    __tablename__ = "defects"

    id            = Column(Integer, primary_key=True, index=True)
    document_id   = Column(Integer, nullable=False)
    vendor_name   = Column(String,  nullable=True)   # nullable — may be unknown
    defect_type   = Column(String,  nullable=False)
    description   = Column(Text,    nullable=True)
    found_at      = Column(DateTime, default=datetime.utcnow)

# ── TABLE 3: Stores every audit result ──
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id            = Column(Integer, primary_key=True, index=True)
    document_id   = Column(Integer, nullable=False)
    vendor_name   = Column(String,  nullable=True)   # nullable — may be unknown
    status        = Column(String,  nullable=False)
    defect_count  = Column(Integer, default=0)
    remarks       = Column(Text,    nullable=True)
    audited_at    = Column(DateTime, default=datetime.utcnow)

# ── TABLE 4: Stores every email sent ──
class EmailLog(Base):
    __tablename__ = "email_logs"

    id            = Column(Integer, primary_key=True, index=True)
    vendor_name   = Column(String,  nullable=True)   # nullable — may be unknown
    email_type    = Column(String,  nullable=False)
    subject       = Column(String,  nullable=True)
    body          = Column(Text,    nullable=True)
    sent_at       = Column(DateTime, default=datetime.utcnow)

# ── Creates all tables in the database ──
def init_db():
    Base.metadata.create_all(bind=engine)

# ── Helper to get a database session ──
def get_db():
    db = SessionLocal()
    try:
        return db
    except Exception as e:
        db.close()
        raise e