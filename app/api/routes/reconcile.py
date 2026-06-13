from fastapi import APIRouter

from app.graph.workflow import graph

router = APIRouter(
    prefix="/reconcile",
    tags=["Reconciliation"]
)


@router.post("/")
def reconcile():

    initial_state = {
        "invoice_pdf_path": "",
        "po_pdf_path": "",
        "grn_pdf_path": "",

        "invoice_json": {},
        "po_json": {},
        "grn_json": {},

        "match_result": {},

        "summary": "",

        "error": None
    }

    result = graph.invoke(
        initial_state
    )

    return result