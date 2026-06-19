from fastapi import APIRouter

from app.graph.workflow import graph

from app.models.reconcile_request import ReconcileRequest

router = APIRouter(
    prefix="/reconcile",
    tags=["Reconciliation"]
)


# @router.post("/")
# def reconcile():
@router.post("/")
def reconcile(request: ReconcileRequest):


    initial_state = {
        "invoice_pdf_path": request.invoice_pdf_path,

        "po_pdf_path": request.po_pdf_path,

        "grn_pdf_path": request.grn_pdf_path,

        "invoice_json": {},

        "po_json": {},

        "grn_json": {},

        "match_result": {},

        "summary": "",

        "error": None
    }

    # initial_state = {
    #     "invoice_pdf_path": "",
    #     "po_pdf_path": "",
    #     "grn_pdf_path": "",

    #     "invoice_json": {},
    #     "po_json": {},
    #     "grn_json": {},

    #     "match_result": {},

    #     "summary": "",

    #     "error": None
    # }

    result = graph.invoke(
        initial_state
    )

    return result