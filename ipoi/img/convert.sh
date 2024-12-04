#!/bin/bash

# Vérifie si ImageMagick est installé
if ! command -v ~/magick &> /dev/null
then
    echo "ImageMagick not found"
    exit 1
fi

SOURCE_DIR="./sites"
OUTPUT_DIR="./sites_webp"
mkdir -p "$OUTPUT_DIR"

for file in "$SOURCE_DIR"/*.{png,jpg,jpeg}; do
    # Vérifie si le fichier existe (évite les erreurs si aucun fichier trouvé)
    [ -e "$file" ] || continue
    # Génère un nom de fichier de sortie avec l'extension .webp
    output_file="$OUTPUT_DIR/$(basename "${file%.*}.webp")"

	#TMP skip all existent files
	if [[ -e "$output_file" ]]; then
		continue
	fi

    # Convertit le fichier en WebP
    ~/magick "$file" -quality 90 "$output_file"
	ls -la "$output_file"
	~/magick mogrify -resize 700x700 "$output_file"
	ls -la "$output_file"
    echo "done : $file -> [$output_file]"
done
echo "All convert done : $OUTPUT_DIR"

