def compare_po_reference(
    invoice: dict,
    po: dict
):
    invoice_po = invoice.get(
        "reference_po_number"
    )

    po_number = po.get(
        "document_number"
    )

    if invoice_po == po_number:
        return None

    return {
        "field": "po_reference",
        "invoice": invoice_po,
        "po": po_number
    }


def compare_invoice_reference(
    grn: dict,
    invoice: dict
):
    grn_invoice = grn.get(
        "reference_invoice_number"
    )

    invoice_number = invoice.get(
        "document_number"
    )

    if grn_invoice == invoice_number:
        return None

    return {
        "field": "invoice_reference",
        "grn": grn_invoice,
        "invoice": invoice_number
    }


def compare_vendor(
    invoice: dict,
    po: dict
):
    invoice_vendor = invoice.get(
        "vendor_name"
    )

    po_vendor = po.get(
        "vendor_name"
    )

    if invoice_vendor == po_vendor:
        return None

    return {
        "field": "vendor_name",
        "invoice": invoice_vendor,
        "po": po_vendor
    }


def compare_total_amount(
    invoice: dict,
    po: dict
):
    invoice_total = invoice.get(
        "total_amount"
    )

    po_total = po.get(
        "total_amount"
    )

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
    invoice_tax = invoice.get(
        "tax"
    )

    po_tax = po.get(
        "tax"
    )

    if invoice_tax == po_tax:
        return None

    return {
        "field": "tax",
        "invoice": invoice_tax,
        "po": po_tax
    }


def perform_three_way_match(
    invoice: dict,
    po: dict,
    grn: dict
):
    variances = []

    # Vendor Check
    vendor_variance = compare_vendor(
        invoice,
        po
    )

    if vendor_variance:
        variances.append(
            vendor_variance
        )

    # PO Reference Check
    po_reference_variance = (
        compare_po_reference(
            invoice,
            po
        )
    )

    if po_reference_variance:
        variances.append(
            po_reference_variance
        )

    # Invoice Reference Check
    invoice_reference_variance = (
        compare_invoice_reference(
            grn,
            invoice
        )
    )

    if invoice_reference_variance:
        variances.append(
            invoice_reference_variance
        )

    # Total Amount Check
    amount_variance = (
        compare_total_amount(
            invoice,
            po
        )
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

    if len(variances) == 0:

        return {
            "status": "matched",
            "variances": []
        }

    return {
        "status": "mismatch",
        "variances": variances
    }





# # def compare_total_amount(
# #     invoice: dict,
# #     po: dict
# # ):
# #     pass


# # app/services/matching/matching_service.py

# def compare_po_reference(
#     invoice,
#     po
# ):
#     invoice_po = invoice.get(
#         "reference_po_number"
#     )

#     po_number = po.get(
#         "document_number"
#     )

#     if invoice_po == po_number:
#         return None

#     return {
#         "field": "po_reference",
#         "invoice": invoice_po,
#         "po": po_number
#     }


# def compare_invoice_reference(
#     grn,
#     invoice
# ):
#     grn_invoice = grn.get(
#         "reference_invoice_number"
#     )

#     invoice_number = invoice.get(
#         "document_number"
#     )

#     if grn_invoice == invoice_number:
#         return None

#     return {
#         "field": "invoice_reference",
#         "grn": grn_invoice,
#         "invoice": invoice_number
#     }



# def compare_total_amount(
#     invoice: dict,
#     po: dict
# ):
#     invoice_total = invoice.get("total_amount")
#     po_total = po.get("total_amount")

#     if invoice_total == po_total:
#         return None

#     return {
#         "field": "total_amount",
#         "invoice": invoice_total,
#         "po": po_total
#     }



# def compare_tax(
#     invoice: dict,
#     po: dict
# ):
#     invoice_tax = invoice.get("tax")
#     po_tax = po.get("tax")

#     if invoice_tax == po_tax:
#         return None

#     return {
#         "field": "tax",
#         "invoice": invoice_tax,
#         "po": po_tax
#     }




# def compare_quantity(
#     invoice: dict,
#     grn: dict
# ):
#     invoice_items = invoice.get(
#         "line_items", []
#     )

#     grn_items = grn.get(
#         "line_items", []
#     )

#     variances = []

#     grn_lookup = {
#         item.get(
#             "description",
#             ""
#         ).strip().lower(): item
#         for item in grn_items
#     }

#     for invoice_item in invoice_items:

#         description = (
#             invoice_item.get(
#                 "description",
#                 ""
#             )
#             .strip()
#             .lower()
#         )

#         invoice_qty = invoice_item.get(
#             "quantity"
#         )

#         grn_item = grn_lookup.get(
#             description
#         )

#         if not grn_item:

#             variances.append({
#                 "field": "quantity",
#                 "description": description,
#                 "invoice": invoice_qty,
#                 "grn": None
#             })

#             continue

#         grn_qty = grn_item.get(
#             "quantity"
#         )

#         if invoice_qty != grn_qty:

#             variances.append({
#                 "field": "quantity",
#                 "description": description,
#                 "invoice": invoice_qty,
#                 "grn": grn_qty
#             })

#     return variances




# # def compare_quantity(
# #     invoice: dict,
# #     grn: dict
# # ):
# #     invoice_items = invoice.get(
# #         "line_items", []
# #     )

# #     grn_items = grn.get(
# #         "line_items", []
# #     )

# #     variances = []

# #     grn_lookup = {
# #         item.get("item_code"): item
# #         for item in grn_items
# #     }

# #     for invoice_item in invoice_items:

# #         item_code = invoice_item.get(
# #             "item_code"
# #         )

# #         invoice_qty = invoice_item.get(
# #             "quantity"
# #         )

# #         grn_item = grn_lookup.get(
# #             item_code
# #         )

# #         if not grn_item:
# #             variances.append({
# #                 "field": "quantity",
# #                 "item_code": item_code,
# #                 "invoice": invoice_qty,
# #                 "grn": None
# #             })
# #             continue

# #         grn_qty = grn_item.get(
# #             "quantity"
# #         )

# #         if invoice_qty != grn_qty:

# #             variances.append({
# #                 "field": "quantity",
# #                 "item_code": item_code,
# #                 "invoice": invoice_qty,
# #                 "grn": grn_qty
# #             })

# #     return variances



# def compare_unit_price(
#     invoice: dict,
#     po: dict
# ):
#     invoice_items = invoice.get(
#         "line_items", []
#     )

#     po_items = po.get(
#         "line_items", []
#     )

#     variances = []

#     po_lookup = {
#         item.get(
#             "description",
#             ""
#         ).strip().lower(): item
#         for item in po_items
#     }

#     for invoice_item in invoice_items:

#         description = (
#             invoice_item.get(
#                 "description",
#                 ""
#             )
#             .strip()
#             .lower()
#         )

#         invoice_price = invoice_item.get(
#             "unit_price"
#         )

#         po_item = po_lookup.get(
#             description
#         )

#         if not po_item:

#             variances.append({
#                 "field": "unit_price",
#                 "description": description,
#                 "invoice": invoice_price,
#                 "po": None
#             })

#             continue

#         po_price = po_item.get(
#             "unit_price"
#         )

#         if invoice_price != po_price:

#             variances.append({
#                 "field": "unit_price",
#                 "description": description,
#                 "invoice": invoice_price,
#                 "po": po_price
#             })

#     return variances




# # def compare_unit_price(
# #     invoice: dict,
# #     po: dict
# # ):
# #     invoice_items = invoice.get(
# #         "line_items", []
# #     )

# #     po_items = po.get(
# #         "line_items", []
# #     )

# #     variances = []

# #     po_lookup = {
# #         item.get("item_code"): item
# #         for item in po_items
# #     }

# #     for invoice_item in invoice_items:

# #         item_code = invoice_item.get(
# #             "item_code"
# #         )

# #         invoice_price = invoice_item.get(
# #             "unit_price"
# #         )

# #         po_item = po_lookup.get(
# #             item_code
# #         )

# #         if not po_item:

# #             variances.append({
# #                 "field": "unit_price",
# #                 "item_code": item_code,
# #                 "invoice": invoice_price,
# #                 "po": None
# #             })

# #             continue

# #         po_price = po_item.get(
# #             "unit_price"
# #         )

# #         if invoice_price != po_price:

# #             variances.append({
# #                 "field": "unit_price",
# #                 "item_code": item_code,
# #                 "invoice": invoice_price,
# #                 "po": po_price
# #             })

# #     return variances


# def compare_vendor(
#     invoice: dict,
#     po: dict
# ):
#     invoice_vendor = invoice.get(
#         "vendor_name"
#     )

#     po_vendor = po.get(
#         "vendor_name"
#     )

#     if invoice_vendor == po_vendor:
#         return None

#     return {
#         "field": "vendor_name",
#         "invoice": invoice_vendor,
#         "po": po_vendor
#     }


# def compare_document_reference(
#     invoice: dict,
#     po: dict
# ):
#     invoice_doc = invoice.get(
#         "document_number"
#     )

#     po_doc = po.get(
#         "document_number"
#     )

#     if invoice_doc and po_doc:
#         return None

#     return {
#         "field": "document_reference"
#     }

# def compare_vendor(
#     invoice,
#     po
# ):
#     if (
#         invoice.get("vendor_name")
#         ==
#         po.get("vendor_name")
#     ):
#         return None

#     return {
#         "field": "vendor_name",
#         "invoice": invoice.get("vendor_name"),
#         "po": po.get("vendor_name")
#     }



# def perform_three_way_match(
#     invoice: dict,
#     po: dict,
#     grn: dict
# ):
#     variances = []

#     vendor_variance = compare_vendor(
#         invoice,
#         po
#     )

#     if vendor_variance:
#         variances.append(
#             vendor_variance
#         )

#     po_reference_variance = (
#         compare_po_reference(
#             invoice,
#             po
#         )
#     )

#     if po_reference_variance:
#         variances.append(
#             po_reference_variance
#         )

#     invoice_reference_variance = (
#         compare_invoice_reference(
#             grn,
#             invoice
#         )
#     )

#     if invoice_reference_variance:
#         variances.append(
#             invoice_reference_variance
#         )

#     # Total Amount Check
#     amount_variance = compare_total_amount(
#         invoice,
#         po
#     )

#     if amount_variance:
#         variances.append(
#             amount_variance
#         )

#     # Tax Check
#     tax_variance = compare_tax(
#         invoice,
#         po
#     )

#     if tax_variance:
#         variances.append(
#             tax_variance
#         )

#     # Quantity Check
#     # quantity_variances = compare_quantity(
#     #     invoice,
#     #     grn
#     # )

#     # variances.extend(
#     #     quantity_variances
#     # )

#     # Unit Price Check
#     # unit_price_variances = compare_unit_price(
#     #     invoice,
#     #     po
#     # )

#     # variances.extend(
#     #     unit_price_variances
#     # )

#     if len(variances) == 0:

#         return {
#             "status": "matched",
#             "variances": []
#         }

#     return {
#         "status": "mismatch",
#         "variances": variances
#     }






# # def compare_tax(
# #     invoice: dict,
# #     po: dict
# # ):
# #     pass


# # def compare_line_items(
# #     invoice: dict,
# #     po: dict,
# #     grn: dict
# # ):
# #     pass


# # def perform_three_way_match(
# #     invoice: dict,
# #     po: dict,
# #     grn: dict
# # ):
# #     pass