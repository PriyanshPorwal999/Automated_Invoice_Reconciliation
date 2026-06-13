from app.services.matching.matching_service import (
    compare_total_amount,
    compare_tax,
    compare_quantity,
    compare_unit_price,
    perform_three_way_match
)

# invoice = {
#     "total_amount": 1180,
#     "tax": 180,
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "quantity": 10,
#             "unit_price": 100
#         }
#     ]
# }

# po = {
#     "total_amount": 1200,
#     "tax": 200,
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "quantity": 10,
#             "unit_price": 100
#         }
#     ]
# }



# invoice = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "quantity": 10
#         }
#     ]
# }

# grn = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "quantity": 10
#         }
#     ]
# }


# invoice = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "unit_price": 100
#         }
#     ]
# }

# po = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "unit_price": 100
#         }
#     ]
# }



# result = compare_total_amount(
#     invoice,
#     po
# )

# print(result)


# tax_result = compare_tax(
#     invoice,
#     po
# )

# print(tax_result)



# print("\n===== TEST 1: MATCH =====")

# invoice = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "quantity": 10
#         }
#     ]
# }

# grn = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "quantity": 10
#         }
#     ]
# }

# result = compare_quantity(
#     invoice,
#     grn
# )

# print(result)


# print("\n===== TEST 2: MISMATCH =====")

# invoice = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "quantity": 10
#         }
#     ]
# }

# grn = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "quantity": 8
#         }
#     ]
# }

# result = compare_quantity(
#     invoice,
#     grn
# )

# print(result)


# print("\n===== TEST 3: MISSING ITEM =====")

# invoice = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "quantity": 10
#         }
#     ]
# }

# grn = {
#     "line_items": []
# }

# result = compare_quantity(
#     invoice,
#     grn
# )

# print(result)





# print("\n===== TEST 1: MATCH =====")

# invoice = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "unit_price": 100
#         }
#     ]
# }

# po = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "unit_price": 100
#         }
#     ]
# }

# result = compare_unit_price(
#     invoice,
#     po
# )

# print(result)


# print("\n===== TEST 2: MISMATCH =====")

# invoice = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "unit_price": 100
#         }
#     ]
# }

# po = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "unit_price": 120
#         }
#     ]
# }

# result = compare_unit_price(
#     invoice,
#     po
# )

# print(result)


# print("\n===== TEST 3: MISSING ITEM =====")

# invoice = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "unit_price": 100
#         }
#     ]
# }

# po = {
#     "line_items": []
# }

# result = compare_unit_price(
#     invoice,
#     po
# )

# print(result)



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

po = {
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

grn = {
    "line_items": [
        {
            "item_code": "ITEM001",
            "quantity": 8
        }
    ]
}

result = perform_three_way_match(
    invoice,
    po,
    grn
)

print(result)




# invoice = {
#     "total_amount": 1180,
#     "tax": 180,
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "quantity": 10,
#             "unit_price": 100
#         }
#     ]
# }

# po = {
#     "total_amount": 1180,
#     "tax": 180,
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "quantity": 10,
#             "unit_price": 100
#         }
#     ]
# }

# grn = {
#     "line_items": [
#         {
#             "item_code": "ITEM001",
#             "quantity": 10
#         }
#     ]
# }