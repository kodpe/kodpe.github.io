CodeMirror.defineMode("bluecode", function () {
    return {
        token: function (stream, state) {
            // Ignorer les espaces
            if (stream.eatSpace()) return null;

            // Détecter les commentaires //
            if (stream.match(';')) {
                stream.skipToEnd(); // saute jusqu'à la fin de la ligne
                return "comment";   // classe CSS pour coloration
            }

            // Détecter les mots-clés inventés
            if (stream.match(/(JUMP|FORK|COPY|BEAM|WAIT|MSET|IFEQ|SPIN|FLIP)/)) {
                return "keyword";
            }

            if (stream.match(/(\*|:)/)) {
                return "access";
            }

            if (stream.match(/(ORIGIN)/)) {
                stream.skipToEnd(); // saute jusqu'à la fin de la ligne
                return "special";
            }

            // Détecter les nombres
            if (stream.match(/^\d+/)) {
                return "number";
            }

            // Détecter les chaînes simples
            if (stream.match(/^"([^"]*)"/)) {
                return "string";
            }

            // Avancer d'un caractère par défaut
            stream.next();
            return null;
        }
    };
});