function bluecode_compiler(rawfile, memSize) {
    // console.log('rawfile:', rawfile);
    parsed = parseBluecode(rawfile, memSize);
    if (!parsed) {
        return null;
    }
    parsed = resolveLabels(parsed);

    // check all errors here, if error return null
    return parsed;
}

function stripComments(lines) {
    // Supprimer tout ce qui suit ';' et enlever les lignes vides
    return lines
        .map(line => line.split(';')[0].trim()) // garde seulement avant //
        .filter(line => line.length > 0);       // enlève les lignes vides
}

function parseBluecode(full, memSize) {
    // console.log('full:', full);
    let lines = full.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    // console.log('lines:', lines);
    lines = stripComments(lines);
    // console.log('lines without comments:', lines);

    // TODO TEST FOR EMPTY FILE HERE

    const instructions = new Set(["JUMP", "FORK", "COPY", "WAIT", "MSET", "BEAM", "FLIP", "SPIN"]);
    const specials = new Set(["ORIGIN"]);
    let reladdr = 0;

    const parsed = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toUpperCase(); // UPPERCASE ALL
        // Instructions et arguments
        const tokens = line.split(/\s+/);

        let label = null;
        let tokenPos = 0;
        if (tokens[0].endsWith(":")) {
            label = tokens[0].toUpperCase().slice(0, -1);
            if (instructions.has(label) || specials.has(label)) {
                console.warn(tokens[0], ": invalid label name");
                return ;
            }
            for (let k = 0; k < parsed.length; k++) {
                if (parsed[k].label == label) {
                    console.warn(tokens[0], ": label duplication error");
                    return;
                }
            }
            tokenPos++;
        }

        if (tokens[tokenPos] == null) {
            console.warn("Line without instruction:", i+":", "'"+line+"'");
            return ;
        }

        // DEPRECATED RAW DATA
        // if (tokens[tokenPos][0] === "#") {
        //     const args = tokens[tokenPos].substring(1);
        //     parsed.push({ type: 'rawdata', args, label: label, reladdr: 0});
        //     continue ;
        // }
        if (isIntegerStrict(tokens[tokenPos][0])) {
            const args = tokens[tokenPos];
            parsed.push({ type: 'rawdata', args, label: label, reladdr: 0});
            continue ;
        }

        if (isIntegerStrict(tokens[tokenPos][1]) && tokens[tokenPos][0] == '-') {
            const args = tokens[tokenPos];
            parsed.push({ type: 'rawdata', args, label: label, reladdr: 0});
            continue ;
        }

        const instr = tokens[tokenPos];
        if (instructions.has(instr) == false && specials.has(instr) == false) {
            console.log(instr);
            // detecter mset
            console.warn(instr, ": invalid instruction");
            return ;
        }
        if (specials.has(instr)) {
            if (instr == 'ORIGIN') {
                reladdr = Number(tokens[tokenPos + 1]);
                console.log("reladdr: ", reladdr);
                if (reladdr >= memSize) {
                    console.warn("ORIGIN: invalid adress", reladdr, ">=", memSize);
                    return;
                }
            }
            continue ;
        }

        let args = tokens.slice(tokenPos);
        if (args[0] === "FLIP") {
            if (typeof args[1] === "undefined") {
                args[1] = 0;
            }
        }
        if (args[0] === "WAIT") {
            if (typeof args[1] === "undefined") {
                args[1] = 1;
            }
        }

        parsed.push({ type: 'instr', args, label: label, reladdr: 0 });
    }

    if (reladdr != 0) {
        // met a jour la relative addresse if ORIGIN
        for (let i = 0; i < parsed.length; i++) {
            parsed[i].reladdr = reladdr + i;
        }
    }
    // console.log('parsed:', parsed);
    return parsed;
}

function resolveLabels(parsed) {
    for (let i = 0; i < parsed.length; i++) {

        let label = parsed[i].label;

        if (label && label.length > 0) {

            // console.warn("find source label", label);
            // console.warn("find source label position", i);
            let sourceLabelPosition = i;

            for (let k = 0; k < parsed.length; k++) {

                let args = parsed[k].args;
                for (let a = 0; a < args.length; a++) {
                    // console.log(args[a])

                    if (args[a] == label) {
                        // console.warn("find used label", label);
                        // console.warn("find used label position", k);
                        let callLabelPosition = k;
                        let dist = Math.abs(sourceLabelPosition - callLabelPosition);
                        if (callLabelPosition > sourceLabelPosition) {
                            args[a] = "-"+dist.toString()
                        }
                        else if (callLabelPosition < sourceLabelPosition) {
                            args[a] = "+"+dist.toString()
                        }
                        else {
                            args[a] = "0"
                        }
                    }

                    if (isIncOrDec(args[a])) {
                        const argsliced = args[a].slice(0, -2);
                        const op = args[a].slice(-2);
                        // console.log("COUCUCOCUOU", label, "op", op)
                        if (argsliced == label) {
                            let callLabelPosition = k;
                            let dist = Math.abs(sourceLabelPosition - callLabelPosition);
                            if (callLabelPosition > sourceLabelPosition) {
                                args[a] = "-" + dist.toString() + op;
                            }
                            else if (callLabelPosition < sourceLabelPosition) {
                                args[a] = "+" + dist.toString() + op;
                            }
                            else {
                                args[a] = "0" + op;
                            }
                        }
                    }

                    if (args[a][0] == '*') {
                        let labstar = args[a].slice(1);
                        labstar.toUpperCase();
                        if (labstar.toUpperCase() === label) {
                            // console.warn("find *", parsed[k]);
                            // console.warn("find", labstar);

                            let callLabelPosition = k;
                            let dist = Math.abs(sourceLabelPosition - callLabelPosition);
                            if (callLabelPosition > sourceLabelPosition) {
                                args[a] = "*-" + dist.toString()
                            }
                            else if (callLabelPosition < sourceLabelPosition) {
                                args[a] = "*+" + dist.toString()
                            }
                            else {
                                args[a] = "*0"
                            }
                        }
                    }

                }
            }
        }
    }
    // console.log('parsed with labels resolved:', parsed);
    return parsed;
}

// todo check noexist labels && variables names

// les labels sont en fait des variables car
// les noms de variables disparraissent aussi a la compilation
// OPER et SETV vont disparaitre ducoup
// todo detecter les lignes de calcul (computation)

// a++
// a--
// a += b
// a -= b
// a *= b
// a /= b
// a = b

/*
function validEVAL(tokens) {
    if (tokens == null) {
        console.error("EVAL: no tokens");
        return false;
    }

    if (tokens[0] != "EVAL") {
        console.error("EVAL: invalid instruction name:", tokens[0]);
        return false;
    }

    if (tokens.length != 4) {
        const str = JSON.stringify(tokens, null, 2);
        console.warn("EVAL: invalid number of tokens:", str);
        return false;
    }

    let strA = tokens[1];
    let tcmp = tokens[2];
    let strB = tokens[3];

    const valid_cmp = new Set(["==", "!=", ">", "<", ">=", "<="]);
    if (valid_cmp.has(tcmp) == false) {
        console.warn("EVAL: invalid comparaison token:", tcmp);
        return false;
    }

    const instructions = new Set(["KILL", "OPER", "EVAL", "JUMP", "FORK", "COPY", "WAIT", "BEAM"]);
    if (instructions.has(strA) && instructions.has(strB)) {
        console.warn("EVAL: invalid double instructions comparaison:", strA, tcmp, strB);
        return false;
    }

    if (instructions.has(strA) || instructions.has(strB)) {
        if (tcmp != "==" && tcmp != "!=") {
            console.warn("EVAL: invalid comparaison token with a instruction:", strA, tcmp, strB);
            return false;
        }
        // if (strA[0])
    }
    return true;
}
*/