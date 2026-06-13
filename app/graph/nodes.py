from app.graph.state import GraphState
# from backend.app.services.matching.matching_service import perform_three_way_match
from app.services.matching.matching_service import (
    perform_three_way_match
)


def extraction_node(
    state: GraphState
):
    print("Extraction Node Executed")

    state["invoice_json"] = {
        "total_amount": 1180,
        "tax": 180,
        "line_items": [
            {
                "item_code": "ITEM001",
                "quantity": 10,
                "unit_price": 100
            }
        ]
    }

    state["po_json"] = {
        "total_amount": 1180,
        "tax": 180,
        "line_items": [
            {
                "item_code": "ITEM001",
                "quantity": 10,
                "unit_price": 100
            }
        ]
    }

    state["grn_json"] = {
        "line_items": [
            {
                "item_code": "ITEM001",
                "quantity": 10
                # "quantity": 8
            }
        ]
    }

    return state


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