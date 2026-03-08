def generate_nodes_from_events(events, db):
    """
    Génère les nodes uniquement à partir de la timeline des événements
    """
    nodes = []
    node_ids = set()

    # Parcours des événements
    for ev in events:
        # On ajoute les personnes
        for person in db["persons"]:
            if person["label"].lower() in ev.get("event", "").lower() and person["id"] not in node_ids:
                nodes.append({"id": person["id"], "label": person["label"], "type": "person"})
                node_ids.add(person["id"])

        # On ajoute les objets mentionnés dans elements
        for obj in db["objects"]:
            for elem in ev.get("elements", []):
                if obj["label"].lower() in elem.lower() and obj["id"] not in node_ids:
                    nodes.append({"id": obj["id"], "label": obj["label"], "type": "object"})
                    node_ids.add(obj["id"])

    return nodes


def generate_edges_from_events(events, nodes):
    """
    Génère les edges en fonction de la timeline des événements.
    type=0 : personne → personne (interaction directe)
    type=1 : personne → personne (interaction indirecte / distance)
    type=2 : personne → objet (utilisation / possession)
    """
    edges = []

    # Mapping id → node
    node_map = {n["id"]: n for n in nodes}

    for ev in events:
        persons = [n for n in nodes if n["type"] == "person" and n["label"].lower() in ev.get("event", "").lower()]
        objects_ = [n for n in nodes if n["type"] == "object" and any(n["label"].lower() in e.lower() for e in ev.get("elements", []))]

        # 1. Personne → personne
        if ev["type"] == "relation":
            # interaction directe ou indirecte selon mode
            mode = ev.get("mode", "direct")
            etype = 0 if mode == "direct" else 1
            for i in range(len(persons)):
                for j in range(i+1, len(persons)):
                    edge = {"source": persons[i]["id"], "target": persons[j]["id"], "type": etype}
                    if edge not in edges:
                        edges.append(edge)

        # 2. Personne → objet
        for p in persons:
            for o in objects_:
                edge = {"source": p["id"], "target": o["id"], "type": 2}
                if edge not in edges:
                    edges.append(edge)

    return edges
