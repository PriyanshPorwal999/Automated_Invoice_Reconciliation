from app.graph.workflow import graph

initial_state = {
    "invoice_json": {},
    "po_json": {},
    "grn_json": {},
    "match_result": {},
    "summary": "",
    "error": None
}

result = graph.invoke(
    initial_state
)

print(result)