import random
from datetime import datetime, timedelta

from randomDate import random_datetime
from randomName import random_name

# --- GENERATION DU CRIME ---
def generate_crime(seed=None):
    """
    Génère un crime complet basé sur une seed.
    Retourne un dictionnaire dossier.
    """
    if seed is not None:
        random.seed(seed)
    else:
        seed = random.randint(1000, 9999)
        random.seed(seed)

    # Valeurs possibles
    # seed
    crimes = ['meurtre']
    # date
    lieux = ['domicile de la victime']
    #
    mobiles = ['argent', 'jalousie', 'vengeance']
    moyens = ['couteau', 'poison', 'brutalité']
    #
    # auteur
    liens = ['ami', 'voisin', 'inconnu']
    # victime
    autopsies = ['blessure mortelle à la poitrine', 'intoxication', 'fractures multiples', 'corps intact']
    #
    # temoin

    dossier = {
        'seed': seed,
        'crime': random.choice(crimes),
        'date': random_datetime(),
        'lieu': random.choice(lieux),
        #
        'mobile': random.choice(mobiles),
        'moyen': random.choice(moyens),
        #
        'auteur': random_name('x') + ", " + random.choice(liens),
        'victime': random_name('x'),
        'autopsie': random.choice(autopsies),
        #
        'temoin': random_name('x') + ", " + random.choice(liens)
    }

    return dossier
