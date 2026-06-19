from app.graph.state import GraphState
# from backend.app.services.matching.matching_service import perform_three_way_match
from app.services.matching.matching_service import (
    perform_three_way_match
)




from app.graph.state import GraphState

from app.services.extraction.extraction_service import (
    extract_document_data
)

from app.services.matching.matching_service import (
    perform_three_way_match
)


def extraction_node(
    state: GraphState
):
    print("Extraction Node Executed")

    invoice_result = extract_document_data(
        state["invoice_pdf_path"]
    )

    po_result = extract_document_data(
        state["po_pdf_path"]
    )

    grn_result = extract_document_data(
        state["grn_pdf_path"]
    )

    print("=" * 50)
    print("INVOICE EXTRACTION")
    print(invoice_result)

    print("=" * 50)
    print("PO EXTRACTION")
    print(po_result)

    print("=" * 50)
    print("GRN EXTRACTION")
    print(grn_result)

    print(
        "Invoice Path:",
        state["invoice_pdf_path"]
    )

    print(
        "PO Path:",
        state["po_pdf_path"]
    )

    print(
        "GRN Path:",
        state["grn_pdf_path"]
    )


    errors = []

    if invoice_result["status"] == "error":
        errors.append(
            invoice_result["message"]
        )

    if po_result["status"] == "error":
        errors.append(
            po_result["message"]
        )

    if grn_result["status"] == "error":
        errors.append(
            grn_result["message"]
        )

    if errors:
        state["error"] = "; ".join(errors)
        return state




    # if invoice_result["status"] == "error":
    #     state["error"] = invoice_result["message"]
    #     return state

    # if po_result["status"] == "error":
    #     state["error"] = po_result["message"]
    #     return state

    # if grn_result["status"] == "error":
    #     state["error"] = grn_result["message"]
    #     return state



    state["invoice_json"] = (
        invoice_result["data"]
    )

    state["po_json"] = (
        po_result["data"]
    )

    state["grn_json"] = (
        grn_result["data"]
    )

    print(
        "Invoice JSON:",
        state["invoice_json"]
    )

    print(
        "PO JSON:",
        state["po_json"]
    )

    print(
        "GRN JSON:",
        state["grn_json"]
    )

    return state





# def extraction_node(
#     state: GraphState
# ):
#     print("Extraction Node Executed")

#     state["invoice_json"] = {
#         "total_amount": 1180,
#         "tax": 180,
#         "line_items": [
#             {
#                 "item_code": "ITEM001",
#                 "quantity": 10,
#                 "unit_price": 100
#             }
#         ]
#     }

#     state["po_json"] = {
#         "total_amount": 1180,
#         "tax": 180,
#         "line_items": [
#             {
#                 "item_code": "ITEM001",
#                 "quantity": 10,
#                 "unit_price": 100
#             }
#         ]
#     }

#     state["grn_json"] = {
#         "line_items": [
#             {
#                 "item_code": "ITEM001",
#                 "quantity": 10
#                 # "quantity": 8
#             }
#         ]
#     }

#     return state


def matching_node(
    state: GraphState
):
    result = perform_three_way_match(
        state["invoice_json"],
        state["po_json"],
        state["grn_json"]
    )

    state["match_result"] = result
    print("Matching Node Executed")

    return state


def arbitration_node(
    state: GraphState
):
    print("Arbitration Node Executed")
    if state["match_result"]["status"] == "matched":
        state["summary"] = (
            "Documents matched successfully."
        )
    else:
        state["summary"] = (
            f"{len(state['match_result']['variances'])} variance(s) detected."
        )

    return state