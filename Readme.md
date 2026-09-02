# Automated Invoice Reconciliation System

AI-powered invoice reconciliation platform built using FastAPI, Gemini, LangGraph, and SQLite.

## Project Overview

This project automates the reconciliation of :

- Invoices
- Purchase Orders (PO)
- Goods Receipt Notes (GRN)

The system extracts structured information from uploaded documents, performs deterministic 3-way matching, identifies variances, and generates audit-ready results.

---

## Current Architecture

```text
PDF Documents
      │
      ▼
OCR / Text Extraction
(PyMuPDF)
      │
      ▼
Gemini Extraction
      │
      ▼
Structured JSON
      │
      ▼
3-Way Matching Engine
      │
      ▼
Variance Report
      │
      ▼
LangGraph Workflow
(Upcoming)
```

---

## Tech Stack

### Backend

- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite

### AI

- Google Gemini

### Document Processing

- PyMuPDF

### Workflow Orchestration

- LangGraph (In Progress)

### Storage

- SQLite

---

## Project Structure

```text
backend/
│
├── app/
│   ├── api/
│   │   └── routes/
│   │
│   ├── database/
│   │
│   ├── services/
│   │   ├── extraction/
│   │   └── matching/
│   │
│   ├── graph/
│   │
│   ├── prompts/
│   │
│   ├── utils/
│   │
│   ├── config.py
│   └── main.py
│
├── tests/
│
├── uploads/
│
├── logs/
│
├── requirements.txt
├── .env.example
└── README.md
```

---

## Features Completed

### Person 1 – Backend Foundation

- FastAPI Setup
- SQLite Integration
- SQLAlchemy Models
- Database Initialization
- Logging Utility
- Audit Service
- Health Endpoint
- Upload Endpoint

### Person 2 – Extraction Pipeline

- PDF Text Extraction (PyMuPDF)
- Gemini Integration
- Prompt Engineering
- Structured JSON Extraction

### Person 3 – Matching Engine

Implemented:

- Total Amount Matching
- Tax Matching
- Quantity Matching
- Unit Price Matching
- Complete 3-Way Reconciliation

Validated:

- Match Scenario
- Single Mismatch Scenario
- Multiple Mismatch Scenario
- Missing Item Scenario

---

## Environment Setup

### Create Virtual Environment

```bash
py -3.12 -m venv venv
```

### Activate Environment

Windows:

```bash
.\venv\Scripts\Activate.ps1
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=sqlite:///./audit_trail.db
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
GEMINI_API_KEY=YOUR_API_KEY
```

---

## Running The Application

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

Application:

```text
http://127.0.0.1:8000
```

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

---

## Running Tests

### Database

```bash
python -m tests.test_init_db
```

### OCR

```bash
python -m tests.test_ocr
```

### Gemini

```bash
python -m tests.test_gemini
```

### Extraction Pipeline

```bash
python -m tests.test_extraction_pipeline
```

### Matching Engine

```bash
python -m tests.test_matching
```

### Multiple Mismatch Test

```bash
python -m tests.test_matching_multiple
```

---

## Matching Rules

### Amount Check

```text
Invoice Total Amount == PO Total Amount
```

### Tax Check

```text
Invoice Tax == PO Tax
```

### Quantity Check

```text
Invoice Quantity == GRN Quantity
```

### Unit Price Check

```text
Invoice Unit Price == PO Unit Price
```

---

## Roadmap

### Person 4

- LangGraph Integration
- GraphState
- Extraction Node
- Matching Node
- Arbitration Node

### Person 5

- React Dashboard
- API Integration
- Audit View

### Final Phase

- End-to-End Integration
- Docker Setup
- Deployment
- Demo Preparation

---

## Team Development Workflow

### Main Branch

Production-ready code only.

### Dev Branch

All team members contribute here.

Workflow:

```text
Feature Development
        │
        ▼
Dev Branch
        │
        ▼
Code Review
        │
        ▼
Main Branch
```

---

