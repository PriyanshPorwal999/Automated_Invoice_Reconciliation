from pydantic import BaseModel

class ReconcileRequest(BaseModel):
    invoice_pdf_path: str
    po_pdf_path: str
    grn_pdf_path: str


# from pydantic import BaseModel

# class ReconcileRequest(BaseModel):
#     invoice_id: str
#     po_id: str
#     grn_id: str