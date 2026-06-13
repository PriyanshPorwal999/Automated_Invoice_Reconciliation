# def compare_total_amount(
#     invoice: dict,
#     po: dict
# ):
#     pass


# app/services/matching/matching_service.py

def compare_total_amount(
    invoice: dict,
    po: dict
):
    invoice_total = invoice.get("total_amount")
    po_total = po.get("total_amount")

    if invoice_total == po_total:
        return None

    return {
        "field": "total_amount",
        "invoice": invoice_total,
        "po": po_total
    }



def compare_tax(
    invoice: dict,
    po: dict
):
    invoice_tax = invoice.get("tax")
    po_tax = po.get("tax")

    if invoice_tax == po_tax:
        return None

    return {
        "field": "tax",
        "invoice": invoice_tax,
        "po": po_tax
    }



def compare_quantity(
    invoice: dict,
    grn: dict
):
    invoice_items = invoice.get(
        "line_items", []
    )

    grn_items = grn.get(
        "line_items", []
    )

    variances = []

    grn_lookup = {
        item.get("item_code"): item
        for item in grn_items
    }

    for invoice_item in invoice_items:

        item_code = invoice_item.get(
            "item_code"
        )

        invoice_qty = invoice_item.get(
            "quantity"
        )

        grn_item = grn_lookup.get(
            item_code
        )

        if not grn_item:
            variances.append({
                "field": "quantity",
                "item_code": item_code,
                "invoice": invoice_qty,
                "grn": None
            })
            continue

        grn_qty = grn_item.get(
            "quantity"
        )

        if invoice_qty != grn_qty:

            variances.append({
                "field": "quantity",
                "item_code": item_code,
                "invoice": invoice_qty,
                "grn": grn_qty
            })

    return variances


def compare_unit_price(
    invoice: dict,
    po: dict
):
    invoice_items = invoice.get(
        "line_items", []
    )

    po_items = po.get(
        "line_items", []
    )

    variances = []

    po_lookup = {
        item.get("item_code"): item
        for item in po_items
    }

    for invoice_item in invoice_items:

        item_code = invoice_item.get(
            "item_code"
        )

        invoice_price = invoice_item.get(
            "unit_price"
        )

        po_item = po_lookup.get(
            item_code
        )

        if not po_item:

            variances.append({
                "field": "unit_price",
                "item_code": item_code,
                "invoice": invoice_price,
                "po": None
            })

            continue

        po_price = po_item.get(
            "unit_price"
        )

        if invoice_price != po_price:

            variances.append({
                "field": "unit_price",
                "item_code": item_code,
                "invoice": invoice_price,
                "po": po_price
            })

    return variances


def perform_three_way_match(
    invoice: dict,
    po: dict,
    grn: dict
):
    variances = []

    # Total Amount Check
    amount_variance = compare_total_amount(
        invoice,
        po
    )

    if amount_variance:
        variances.append(
            amount_variance
        )

    # Tax Check
    tax_variance = compare_tax(
        invoice,
        po
    )

    if tax_variance:
        variances.append(
            tax_variance
        )

    # Quantity Check
    quantity_variances = compare_quantity(
        invoice,
        grn
    )

    variances.extend(
        quantity_variances
    )

    # Unit Price Check
    unit_price_variances = compare_unit_price(
        invoice,
        po
    )

    variances.extend(
        unit_price_variances
    )

    if len(variances) == 0:

        return {
            "status": "matched",
            "variances": []
        }

    return {
        "status": "mismatch",
        "variances": variances
    }


# def compare_tax(
#     invoice: dict,
#     po: dict
# ):
#     pass


# def compare_line_items(
#     invoice: dict,
#     po: dict,
#     grn: dict
# ):
#     pass


# def perform_three_way_match(
#     invoice: dict,
#     po: dict,
#     grn: dict
# ):
#     pass