import sys
import math

# lx, ly eclair
# tx, ty thor
eclairX, eclairY, thorX, thorY = [int(i) for i in input().split()]

def thor_en_dessous_de_eclair():
    if (thorY > eclairY):
        return True
    else:
        return False

def thor_au_dessus_de_eclair():
    if (thorY < eclairY):
        return True
    else:
        return False

def thor_a_gauche_de_eclair():
    if (thorX < eclairX):
        return True
    else:
        return False

def thor_a_droite_de_eclair():
    if (thorX > eclairX):
        return True
    else:
        return False

while True:
    remaining_turns = int(input())  # The remaining amount of turns Thor can move. Do not remove this line.

    if (thor_en_dessous_de_eclair() and thor_a_gauche_de_eclair()):
        print("NE")
        thorY = thorY - 1
        thorX = thorX + 1

    if (thor_en_dessous_de_eclair() and thor_a_droite_de_eclair()):
        print("NW")
        thorY = thorY + 1
        thorX = thorX - 1
    
    if (thor_au_dessus_de_eclair() and thor_a_gauche_de_eclair()):
        print("SE")
        thorY = thorY + 1
        thorX = thorX + 1

    if (thor_au_dessus_de_eclair() and thor_a_droite_de_eclair()):
        print("SW")
        thorY = thorY + 1
        thorX = thorX - 1

    if ((thorX == eclairX) and thor_en_dessous_de_eclair()):
        print("N")
        thorY = thorY - 1

    if ((thorX == eclairX) and thor_au_dessus_de_eclair()):
        print("S")
        thorY = thorY + 1

    if ((thorY == eclairY) and thor_a_gauche_de_eclair()):
        print("E")
        thorX = thorX + 1

    if ((thorY == eclairY) and thor_a_droite_de_eclair()):
        print("W")
        thorX = thorX - 1