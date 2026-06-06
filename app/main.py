from fastapi import FastAPI

from app.api.routes.health import router as health_router

app = FastAPI(
    title="Automated Invoice Reconciliation API",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "message": "Backend is running"
    }


# Route Registration
app.include_router(health_router)