import json
import random
from datetime import datetime, timedelta

DB_PATH = "crime_database.json"

EVENT_SEQUENCE = [
    "context",
    "relation",
    "preparation",  # facultatif
    "crime",
    "post_crime",
    "discovery",
    "enquete"
]

# ======================
# HELPERS
# ======================

def pick(seq):
    return random.choice(seq)


def pick_many(seq, nmin=1, nmax=2):
    return random.sample(seq, random.randint(nmin, min(nmax, len(seq))))


def format_time(dt):
    return dt.strftime("%Y-%m-%d %H:%M")


def random_delta(min_minutes, max_minutes):
    return timedelta(minutes=random.randint(min_minutes, max_minutes))

# ======================
# LOGIC
# ======================

def should_have_preparation(context):
    bias = context.get("prep_bias", 0.5)
    return random.random() < bias

# ======================
# EVENT GENERATION
# ======================

def generate_event(db, etype, index, time, causes):
    template = pick(db["events"][etype])
    event = {
        "id": index,
        "type": etype,
        "time": format_time(time),
        "event": template["text"],
        "location": pick(db["locations"]),
        "elements": pick_many(template.get("elements", []), 1, 2),
        "causes": causes
    }

    # Copier les métadonnées utiles sans logique
    for meta in ("mode", "style", "coherence"):
        if meta in template:
            event[meta] = template[meta]

    return event


def generate_events(db):
    events = []
    idx = 0

    current_time = datetime(
        2026,
        1,
        random.randint(1, 10),
        random.randint(6, 22),
        random.randint(0, 59)
    )

    # CONTEXTE
    context_tpl = pick(db["events"]["context"])
    context = generate_event(db, "context", idx, current_time, [])
    context.update(context_tpl)
    events.append(context)
    idx += 1

    current_time += random_delta(10, 60 * 72)

    # RELATION (lien explicite auteur / victime)
    relation_tpl = pick(db["events"]["relation"])
    relation = generate_event(db, "relation", idx, current_time, [context["id"]])
    relation.update(relation_tpl)
    events.append(relation)
    idx += 1

    last_cause = relation["id"]

    # PREPARATION (facultative)
    if should_have_preparation(context):
        prep_tpl = pick(db["events"]["preparation"])
        if prep_tpl.get("requires_time", False):
            current_time += random_delta(60, 60 * 72)
        else:
            current_time += random_delta(5, 120)

        preparation = generate_event(db, "preparation", idx, current_time, [relation["id"]])
        preparation.update(prep_tpl)
        events.append(preparation)
        last_cause = preparation["id"]
        idx += 1

    # CRIME
    current_time += random_delta(1, 60 * 24)
    crime_tpl = pick(db["events"]["crime"])
    crime = generate_event(db, "crime", idx, current_time, [last_cause])
    crime.update(crime_tpl)
    events.append(crime)
    idx += 1

    # POST-CRIME
    current_time += random_delta(1, 60 * 12)
    post_tpl = pick(db["events"]["post_crime"])
    post = generate_event(db, "post_crime", idx, current_time, [crime["id"]])
    post.update(post_tpl)
    events.append(post)
    idx += 1

    # DISCOVERY (delay from DB)
    disc_tpl = pick(db["events"]["discovery"])
    delay = disc_tpl.get("delay_minutes", [10, 180])
    current_time += random_delta(delay[0], delay[1])

    discovery = generate_event(db, "discovery", idx, current_time, [crime["id"]])
    discovery.update(disc_tpl)
    events.append(discovery)
    idx += 1

    # ENQUETE (présent)
    current_time += random_delta(1, 180)
    enquete = {
        "id": idx,
        "type": "enquete",
        "time": format_time(current_time),
        "event": "Ouverture officielle de l'enquête",
        "location": discovery["location"],
        "elements": [],
        "causes": [discovery["id"]]
    }
    events.append(enquete)

    return events
