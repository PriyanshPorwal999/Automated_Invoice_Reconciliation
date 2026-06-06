from fastapi import FastAPI

app = FastAPI(
    title="Automated Invoice Reconciliation API"
)

@app.get("/")
def root():
    return {"message": "Backend is running"}