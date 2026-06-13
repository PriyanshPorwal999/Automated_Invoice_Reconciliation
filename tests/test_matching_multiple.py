from app.services.matching.matching_service import (
    perform_three_way_match
)

# Invoice Data
invoice = {
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

# PO Data (Multiple Mismatches)
po = {
    "total_amount": 1200,   # Total mismatch
    "tax": 200,             # Tax mismatch
    "line_items": [
        {
            "item_code": "ITEM001",
            "quantity": 10,
            "unit_price": 120    # Unit price mismatch
        }
    ]
}

# GRN Data (Quantity Mismatch)
grn = {
    "line_items": [
        {
            "item_code": "ITEM001",
            "quantity": 8        # Quantity mismatch
        }
    ]
}

result = perform_three_way_match(
    invoice,
    po,
    grn
)

print("\n===== MULTIPLE MISMATCH TEST =====")
print(result)

print("\n===== VARIANCES =====")

for variance in result["variances"]:
    print(variance)