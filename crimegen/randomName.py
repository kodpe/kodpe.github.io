import random
import json

# --- Chargement des prénoms depuis JSON ---
with open('names.json', 'r', encoding='utf-8') as f:
    NAME_DATA = json.load(f)

# Stocker les prénoms déjà utilisés
used_names = set()

def random_name(sexe='x'):
    """
    Retourne un prénom aléatoire basé sur names.json
    - sexe='m' pour masculin
    - sexe='f' pour féminin
    - sexe='x' pour choisir au hasard
    Ne renvoie jamais deux fois le même prénom.
    """
    global used_names

    # Choisir sexe aléatoire si 'x'
    if sexe.lower() == 'x':
        sexe = random.choice(['m', 'f'])
    
    # Filtrer prénoms disponibles
    pool = [n for n in NAME_DATA[sexe.lower()] if n not in used_names]
    
    if not pool:
        raise ValueError(f"Tous les prénoms de sexe {sexe} ont déjà été utilisés.")

    name = random.choice(pool)
    used_names.add(name)
    return name

# --- TEST ---
if __name__ == "__main__":
    random.seed(42)
    print(random_name('m'))  # masculin
    print(random_name('f'))  # féminin
    print(random_name('x'))  # aléatoire
    print(random_name())     # aléatoire par défaut
