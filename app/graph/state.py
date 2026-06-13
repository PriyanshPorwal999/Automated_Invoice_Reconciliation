# app/graph/state.py

from typing import TypedDict, Optional


class GraphState(TypedDict):

    invoice_pdf_path: str
    po_pdf_path: str
    grn_pdf_path: str

    invoice_json: dict

    po_json: dict

    grn_json: dict

    match_result: dict

    summary: str

    error: Optional[str]