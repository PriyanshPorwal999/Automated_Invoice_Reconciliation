from langgraph.graph import (
    StateGraph,
    END
)

from app.graph.state import GraphState

from app.graph.nodes import (
    extraction_node,
    matching_node,
    arbitration_node
)

workflow = StateGraph(
    GraphState
)

workflow.add_node(
    "extract",
    extraction_node
)

workflow.add_node(
    "match",
    matching_node
)

workflow.add_node(
    "arbitrate",
    arbitration_node
)

workflow.set_entry_point(
    "extract"
)

workflow.add_edge(
    "extract",
    "match"
)

workflow.add_edge(
    "match",
    "arbitrate"
)

workflow.add_edge(
    "arbitrate",
    END
)

graph = workflow.compile()



# from app.graph.nodes import (
#     extraction_node,
#     matching_node,
#     arbitration_node
# )