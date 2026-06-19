from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.upload import router as upload_router

from app.database.init_db import init_db

from app.api.routes.reconcile import router as reconcile_router

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Automated Invoice Reconciliation API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Backend is running"
    }

@app.on_event("startup")
def startup_event():
    init_db()


# Route Registration
app.include_router(health_router)
app.include_router(upload_router)
app.include_router(reconcile_router)