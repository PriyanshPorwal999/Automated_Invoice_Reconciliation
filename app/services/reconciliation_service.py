from app.graph.workflow import graph


def run_reconciliation(
    invoice_path: str,
    po_path: str,
    grn_path: str
):

    initial_state = {
        "invoice_pdf_path": invoice_path,
        "po_pdf_path": po_path,
        "grn_pdf_path": grn_path,

        "invoice_json": {},
        "po_json": {},
        "grn_json": {},

        "match_result": {},
        "summary": "",
        "error": None
    }

    result = graph.invoke(initial_state)

    return result