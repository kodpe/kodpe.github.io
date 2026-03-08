from datetime import datetime, timedelta
import random

def random_datetime(start_year=2026, end_year=2026):
    """
    Retourne une date+heure aléatoire avec jour de la semaine.
    Format : 'Lundi 2026-01-19 14:32:08'
    """
    # bornes
    start = datetime(start_year, 1, 1, 0, 0, 0)
    end = datetime(end_year, 12, 31, 23, 59, 59)
    
    # delta total en secondes
    delta = end - start
    int_delta = int(delta.total_seconds())
    
    # générer un nombre aléatoire de secondes
    random_second = random.randint(0, int_delta)
    random_dt = start + timedelta(seconds=random_second)
    
    # formater le jour de la semaine en français
    weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
    weekday = weekdays[random_dt.weekday()]  # 0 = Lundi, 6 = Dimanche
    
    return f"{weekday} {random_dt.strftime('%Y-%m-%d %H:%M:%S')}"

# Exemple
# print(random_datetime_with_weekday())
# => Mardi 2026-04-21 16:42:08
