import json
from collections import defaultdict

# Fichier JSON généré précédemment
input_file = "items.json"

# Chargement du JSON
with open(input_file, "r", encoding="utf-8") as f:
    items = json.load(f)

# Regrouper les items par UE
ue_items = defaultdict(list)
for item in items:
    ue_items[item["UE"]].append(item["number"])

# Vérifier les items manquants
for ue, numbers in ue_items.items():
    numbers_sorted = sorted(numbers)
    missing = []
    if numbers_sorted:
        start = numbers_sorted[0]
        end = numbers_sorted[-1]
        full_range = set(range(start, end + 1))
        missing = sorted(full_range - set(numbers_sorted))
    if missing:
        print(f"{ue} - Items manquants : {missing}")
    else:
        print(f"{ue} - Aucun item manquant")
