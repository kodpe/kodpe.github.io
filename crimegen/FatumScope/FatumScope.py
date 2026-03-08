import json
import glob
import os
import dash
from dash.dependencies import Input, Output, State
from dash import html, dcc
import plotly.express as px
import plotly.graph_objects as go
import networkx as nx

def load_latest_veritas(path="."):
    files = glob.glob(os.path.join(path, "../CrimeGen/veritas_*.json"))
    if not files:
        raise FileNotFoundError("Aucun fichier veritas_*.json trouvé")

    latest_file = max(files, key=os.path.getmtime)

    with open(latest_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    return data, latest_file

# ------------------------------
# Fonctions pour générer les graphes
# ------------------------------

def generate_timeline_fig(data):
    df_events = {
        "time": [e["time"] for e in data["events"]],
        "event": [e["event"] for e in data["events"]],
        "location": [e["location"] for e in data["events"]]
    }

    fig = px.scatter(
        df_events,
        x="time",
        y="location",
        text="event",
        color="location",
        hover_data=["event"],
        template="plotly_dark"
    )
    fig.update_traces(marker=dict(size=12), textposition="top center")

    # Flèches causales
    annotations = []
    for i, e in enumerate(data["events"]):
        for cause_idx in e.get("causes", []):
            cause = data["events"][cause_idx]
            annotations.append(dict(
                x=e["time"],
                y=e["location"],
                ax=cause["time"],
                ay=cause["location"],
                xref="x",
                yref="y",
                axref="x",
                ayref="y",
                showarrow=True,
                arrowhead=3,
                arrowsize=1,
                arrowwidth=2,
                arrowcolor="yellow",
                opacity=0.8
            ))

    fig.update_layout(
        showlegend=False,
        margin=dict(l=20, r=20, t=20, b=20),
        height=None,
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        annotations=annotations
    )
    fig.update_yaxes(title="Lieu", autorange="reversed")
    fig.update_xaxes(title="Date / Temps", rangeslider_visible=True)
    return fig

def generate_network_fig(data):
    """
    Graphe relationnel avec :
    - 3 types de flèches (0: gris, 1: bleu, 2: rouge)
    - 3 types de points : personnes, objets, autres
    """

    G = nx.DiGraph()
    for node in data["nodes"]:
        # node doit avoir un type : "person", "object", "other"
        G.add_node(node["id"], label=node["label"], type=node.get("type", "other"))

    for edge in data["edges"]:
        # edge type 0/1/2 pour la couleur de la flèche
        G.add_edge(edge["source"], edge["target"], type=edge.get("type", 0))

    pos = nx.spring_layout(G, seed=42)

    # --- Traces pour les arêtes par type ---
    edge_color_map = {0: "#888", 1: "LightSkyBlue", 2: "tomato"}
    edge_traces = []
    for t in [0,1,2]:
        edge_x, edge_y = [], []
        for u, v, attr in G.edges(data=True):
            if attr["type"] != t:
                continue
            x0, y0 = pos[u]
            x1, y1 = pos[v]
            edge_x += [x0, x1, None]
            edge_y += [y0, y1, None]
        if edge_x:
            edge_traces.append(go.Scatter(
                x=edge_x, y=edge_y,
                line=dict(width=2, color=edge_color_map[t]),
                hoverinfo='none',
                mode='lines',
                name=f"Relation type {t}"
            ))

    # --- Traces pour les nœuds par type ---
    node_color_map = {"person": "LightGreen", "object": "orange", "other": "LightGray"}
    node_traces = []
    for ntype in ["person","object","other"]:
        node_x, node_y, node_text = [], [], []
        for node in G.nodes():
            if G.nodes[node]["type"] != ntype:
                continue
            x, y = pos[node]
            node_x.append(x)
            node_y.append(y)
            node_text.append(G.nodes[node]['label'])
        if node_x:
            node_traces.append(go.Scatter(
                x=node_x, y=node_y,
                mode='markers+text',
                text=node_text,
                textposition="top center",
                hoverinfo='text',
                marker=dict(size=20, color=node_color_map[ntype], line=dict(width=2)),
                name=ntype.capitalize()
            ))

    fig = go.Figure(data=edge_traces + node_traces,
                    layout=go.Layout(
                        template="plotly_dark",
                        showlegend=True,
                        margin=dict(l=20, r=20, t=20, b=20),
                        xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                        yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                        height=None
                    ))

    fig.update_layout(plot_bgcolor='rgba(0,0,0,0)',
                      paper_bgcolor='rgba(0,0,0,0)')

    return fig

# ------------------------------
# Dash app
# ------------------------------

app = dash.Dash(__name__)
app.title = "Visualisation Relationnelle & Timeline"

# Lire les données initiales
data, filename = load_latest_veritas()
print(f"Chargé : {filename}")

# ------------------------------
# Layout
# ------------------------------
app.layout = html.Div(
    style={"display": "flex", "height": "95vh"},
    children=[
        html.Div([
            dcc.Graph(
                id="network-graph",
                figure=generate_network_fig(data),
                style={"height": "100%"},
                config={"scrollZoom": True}
            ),
            dcc.Store(id="network-layout-store")
        ], style={"flex": "1", "padding": "0px", "height": "100%"}),

        html.Div([
            dcc.Graph(
                id="timeline-graph",
                figure=generate_timeline_fig(data),
                style={"height": "100%"},
                config={"scrollZoom": True}
            ),
            dcc.Store(id="timeline-layout-store"),
            dcc.Interval(
                id="interval-component",
                interval=5000,  # 5 sec
                n_intervals=0
            )
        ], style={"flex": "1", "padding": "0px", "height": "100%"})
    ]
)

# ------------------------------
# Stocker le zoom/pan de la timeline
# ------------------------------
@app.callback(
    Output("timeline-layout-store", "data"),
    Input("timeline-graph", "relayoutData"),
    prevent_initial_call=True
)
def store_timeline_layout(relayout_data):
    return relayout_data

# ------------------------------
# Stocker le zoom/pan du graphe relationnel
# ------------------------------
@app.callback(
    Output("network-layout-store", "data"),
    Input("network-graph", "relayoutData"),
    prevent_initial_call=True
)
def store_network_layout(relayout_data):
    return relayout_data

# ------------------------------
# Mise à jour timeline sans reset du zoom
# ------------------------------
@app.callback(
    Output("timeline-graph", "figure"),
    Input("interval-component", "n_intervals"),
    State("timeline-layout-store", "data")
)
def update_timeline(n, layout_data):
    data, filename = load_latest_veritas()
    fig = generate_timeline_fig(data)
    if layout_data:
        # conserver les axes
        if 'xaxis.range[0]' in layout_data and 'xaxis.range[1]' in layout_data:
            fig.update_xaxes(range=[layout_data['xaxis.range[0]'], layout_data['xaxis.range[1]']])
        if 'yaxis.range[0]' in layout_data and 'yaxis.range[1]' in layout_data:
            fig.update_yaxes(range=[layout_data['yaxis.range[0]'], layout_data['yaxis.range[1]']])
    return fig

# ------------------------------
# Mise à jour graphe relationnel sans reset du zoom
# ------------------------------
@app.callback(
    Output("network-graph", "figure"),
    Input("interval-component", "n_intervals"),
    State("network-layout-store", "data")
)
def update_network(n, layout_data):
    data, filename = load_latest_veritas()
    fig = generate_network_fig(data)
    if layout_data:
        if 'xaxis.range[0]' in layout_data and 'xaxis.range[1]' in layout_data:
            fig.update_xaxes(range=[layout_data['xaxis.range[0]'], layout_data['xaxis.range[1]']])
        if 'yaxis.range[0]' in layout_data and 'yaxis.range[1]' in layout_data:
            fig.update_yaxes(range=[layout_data['yaxis.range[0]'], layout_data['yaxis.range[1]']])
    return fig

# ------------------------------
# Lancer le serveur
# ------------------------------
if __name__ == "__main__":
    app.run(debug=True)
