#!/bin/bash

# Vérifier si un argument est fourni
if [ -z "$1" ]; then
    echo "Usage: $0 fichier_de_noms.txt"
    exit 1
fi

fichier="$1"

# Vérifier si le fichier existe
if [ ! -f "$fichier" ]; then
    echo "Le fichier $fichier n'existe pas."
    exit 1
fi

while IFS= read -r domain; do
    # Exécuter whois et chercher si le domaine est disponible
    if whois "$domain.com" | grep -q -i "No match\|NOT FOUND\|Status: free"; then
        echo "$domain.com est disponible !"
    fi
done < "$fichier"

