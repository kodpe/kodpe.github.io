function adjustImage(imageSrc, contrast, brightness, colorAdjustment, callback) {
    const image = new Image();
    image.src = imageSrc;

    image.onload = function() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        // Récupérer les données de l'image
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Appliquer les ajustements sur les pixels de l'image
        for (let i = 0; i < data.length; i += 4) {
            // Récupérer les valeurs de couleur (R, G, B, A)
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            // Ajustement du contraste
            r = ((r - 128) * contrast + 128);
            g = ((g - 128) * contrast + 128);
            b = ((b - 128) * contrast + 128);

            // Appliquer la luminosité
            r = r * (1 + brightness);
            g = g * (1 + brightness);
            b = b * (1 + brightness);

            // Appliquer un ajustement de couleur
            r = Math.min(255, Math.max(0, r + colorAdjustment.r)); // Ajustement rouge
            g = Math.min(255, Math.max(0, g + colorAdjustment.g)); // Ajustement vert
            b = Math.min(255, Math.max(0, b + colorAdjustment.b)); // Ajustement bleu

            // Mettre à jour les pixels dans l'image
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
        }

        // Redéfinir l'image sur le canvas après les ajustements
        context.putImageData(imageData, 0, 0);

        // Créer une nouvelle texture avec l'image modifiée
        const modifiedImage = canvas.toDataURL();

        // Appeler le callback avec la nouvelle image modifiée
        callback(modifiedImage);
    };
}

// Exemple d'appel de la fonction
adjustImage(
    '../js/.jpg',  // Le chemin vers l'image JPG
    1.5,                       // Contraste (1 = normal, >1 augmente le contraste)
    0.2,                       // Luminosité (0 = normal, >0 augmente la luminosité)
    { r: 20, g: -10, b: 30 },  // Ajustement des couleurs (rouge, vert, bleu)
    function(modifiedImage) {
        console.log('Image modifiée : ', modifiedImage);
        // Vous pouvez maintenant utiliser la nouvelle image modifiée
        // Par exemple, pour l'afficher dans un élément <img>
        const imgElement = document.createElement('img');
        imgElement.src = modifiedImage;
        document.body.appendChild(imgElement);
    }
);
