import os
import random
import threading
import sys
from engine import generate_crime  # ton générateur d'enquête
from PyQt6.QtWidgets import QApplication
from graphs import AsyncGraphWindow

# --- ETAT DU DOSSIER ---
global dossier
dossier = None

# --- COMMANDES ---
COMMANDS = {
    'gen': 'Créer une enquête avec seed aléatoire et l\'afficher',
    'end': 'Terminer la partie (succès ou échec aléatoire)',
    'inspect': 'Examiner un element',
    'ask': 'Interroger une personne',
    'autopsy': 'Resultat de l\'autopsie',
}

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def show_wall():
    print("=== WALL / DOSSIER ===\n")
    
    # Affichage dossier
    if dossier:
        for k,v in dossier.items():
            print(f"- {k.capitalize()} : {v}")
    else:
        print("- Aucun crime généré")
    
    # Commandes
    print("\n>> COMMANDES DISPONIBLES :")
    for cmd, desc in COMMANDS.items():
        print(f"{cmd} : {desc}")
    print("=====================\n")

def command_handler():
    global dossier
    while True:
        clear_screen()
        show_wall()
        cmd = input("> ").strip().lower()

        if cmd == 'gen':
            dossier = generate_crime()
            print(f"\nEnquête générée ! Seed : {dossier['seed']}\n")
            input("Appuyez sur Entrée pour continuer...")

        elif cmd == 'end':
            result = random.choice(['SUCCESS', 'FAIL'])
            print(f"\nRésultat final : {result}\n")
            input("Appuyez sur Entrée pour quitter...")
            break

        else:
            input("Commande inconnue ! Appuyez sur Entrée...")

def start_terminal():
    """
    Lance le terminal dans un thread séparé.
    """
    command_handler()

def main():
    global dossier
    dossier = generate_crime()  # Génération initiale

    # --- Lancer l'application GUI ---
    app = QApplication(sys.argv)
    window = AsyncGraphWindow()
    window.show()

    # --- Lancer le terminal dans un thread séparé ---
    terminal_thread = threading.Thread(target=start_terminal, daemon=True)
    terminal_thread.start()

    # --- Lancer la GUI (thread principal) ---
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
