import json
import random
from datetime import datetime, timedelta
from create_events import generate_events
from relations_nodes import generate_nodes_from_events
from relations_nodes import generate_edges_from_events

global seed

# ======================
# CONFIG
# ======================
DB_PATH = "crime_database.json"

# ======================
# HELPERS
# ======================

def load_db():
    with open(DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def rand_date(start="2026-01-01"):
    base = datetime.fromisoformat(start)
    return (base + timedelta(days=random.randint(0, 10))).date().isoformat()


def pick(seq):
    return random.choice(seq)


def pick_many(seq, nmin=1, nmax=2):
    return random.sample(seq, random.randint(nmin, min(nmax, len(seq))))

# ======================
# MAIN
# ======================

def generate_truth(seed=None):
    if seed is None:
        seed = random.randint(0, 10**9)

    random.seed(seed)

    db = load_db()
    events = generate_events(db)
    nodes = generate_nodes_from_events(events, db)
    edges = generate_edges_from_events(events, nodes)

    return {
        "seed": seed,
        "nodes": nodes,
        "edges": edges,
        "events": events
    }


if __name__ == "__main__":
    truth = generate_truth()
    seed = truth["seed"]

    filename = f"veritas_{seed}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(truth, f, indent=2, ensure_ascii=False)

    print(f"Vérité générée dans {filename}")
