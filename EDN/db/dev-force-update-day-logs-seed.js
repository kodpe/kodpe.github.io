const Database = require("better-sqlite3");
const { config, logs } = require("./dev-day-logs-seed");

// =========================
// HELPERS
// =========================

function isValidIsoDate(dateStr) {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

function normalizePracticeType(value) {
    if (typeof value !== "string") {
        throw new Error(`Practice invalide: ${value}`);
    }

    const normalized = value.trim().toUpperCase().replace(/\s+/g, "_");

    if (!normalized) {
        throw new Error(`Practice vide ou invalide: "${value}"`);
    }

    return normalized;
}

function uniqueStrings(values) {
    return [...new Set(values)];
}

function uniqueIntegers(values) {
    return [...new Set(values)];
}

function getPracticesForRow(row, defaultPractices) {
    const useDefaultPractices = row.useDefaultPractices !== false;
    const base = useDefaultPractices ? defaultPractices : [];
    const extra = Array.isArray(row.extraPractices) ? row.extraPractices : [];

    return uniqueStrings(
        [...base, ...extra].map(normalizePracticeType)
    );
}

function validateConfig(input) {
    if (!input || typeof input !== "object") {
        throw new Error("config invalide");
    }

    if (input.enableReplace !== true) {
        throw new Error("Script désactivé. Passe config.enableReplace à true pour exécuter.");
    }

    if (!Number.isInteger(input.userId) || input.userId <= 0) {
        throw new Error("config.userId invalide");
    }

    if (
        input.replaceMode !== "replace-children-only" &&
        input.replaceMode !== "replace-full-range"
    ) {
        throw new Error('config.replaceMode doit valoir "replace-children-only" ou "replace-full-range"');
    }

    if (input.defaultPractices !== undefined) {
        if (!Array.isArray(input.defaultPractices)) {
            throw new Error("config.defaultPractices doit être un tableau");
        }

        for (const practice of input.defaultPractices) {
            normalizePracticeType(practice);
        }
    }
}

function validateLogs(input, defaultPractices) {
    if (!Array.isArray(input)) {
        throw new Error("logs doit être un tableau");
    }

    if (input.length === 0) {
        throw new Error("logs est vide");
    }

    const seenDates = new Set();

    for (const [index, row] of input.entries()) {
        if (!row || typeof row !== "object") {
            throw new Error(`Entrée #${index} invalide`);
        }

        if (!isValidIsoDate(row.date)) {
            throw new Error(`Date invalide à l'index ${index}: ${row.date}`);
        }

        if (seenDates.has(row.date)) {
            throw new Error(`Date dupliquée détectée: ${row.date}`);
        }
        seenDates.add(row.date);

        if (typeof row.hours !== "number" || !Number.isFinite(row.hours) || row.hours < 0) {
            throw new Error(`hours invalide pour ${row.date}: ${row.hours}`);
        }

        if (row.items !== undefined) {
            if (!Array.isArray(row.items)) {
                throw new Error(`items doit être un tableau pour ${row.date}`);
            }

            const seenItemIds = new Set();

            for (const itemId of row.items) {
                if (!Number.isInteger(itemId) || itemId <= 0) {
                    throw new Error(`itemId invalide pour ${row.date}: ${itemId}`);
                }

                if (seenItemIds.has(itemId)) {
                    throw new Error(`itemId dupliqué pour ${row.date}: ${itemId}`);
                }

                seenItemIds.add(itemId);
            }
        }

        if (row.extraPractices !== undefined) {
            if (!Array.isArray(row.extraPractices)) {
                throw new Error(`extraPractices doit être un tableau pour ${row.date}`);
            }

            for (const practice of row.extraPractices) {
                normalizePracticeType(practice);
            }
        }

        if (row.useDefaultPractices !== undefined && typeof row.useDefaultPractices !== "boolean") {
            throw new Error(`useDefaultPractices doit être un booléen pour ${row.date}`);
        }

        // Vérifie que la fusion ne casse rien
        getPracticesForRow(row, defaultPractices);
    }
}

function getDateRange(rows) {
    const dates = rows.map((row) => row.date).sort();
    return {
        minDate: dates[0],
        maxDate: dates[dates.length - 1]
    };
}

// =========================
// MAIN
// =========================

function main() {
    validateConfig(config);

    const USER_ID = config.userId;
    const DB_PATH = config.dbPath || process.env.DB_PATH || "dev\\planning.db";
    const REPLACE_MODE = config.replaceMode;
    const DEFAULT_PRACTICES = Array.isArray(config.defaultPractices)
        ? uniqueStrings(config.defaultPractices.map(normalizePracticeType))
        : [];

    validateLogs(logs, DEFAULT_PRACTICES);

    const db = new Database(DB_PATH);
    db.pragma("foreign_keys = ON");

    const user = db
        .prepare("SELECT id, name FROM users WHERE id = ?")
        .get(USER_ID);

    if (!user) {
        throw new Error(`Utilisateur introuvable pour userId=${USER_ID}`);
    }

    const allRequestedItemIds = uniqueIntegers(
        logs.flatMap((row) => Array.isArray(row.items) ? row.items : [])
    );

    if (allRequestedItemIds.length > 0) {
        const placeholders = allRequestedItemIds.map(() => "?").join(",");
        const existingItems = db.prepare(`
      SELECT id
      FROM edn_items
      WHERE id IN (${placeholders})
    `).all(...allRequestedItemIds);

        const existingItemIds = new Set(existingItems.map((row) => row.id));
        const missingItemIds = allRequestedItemIds.filter((id) => !existingItemIds.has(id));

        if (missingItemIds.length > 0) {
            throw new Error(`Items introuvables dans edn_items: ${missingItemIds.join(", ")}`);
        }
    }

    const insertDayLogStmt = db.prepare(`
    INSERT INTO user_day_logs (user_id, work_date, worked_hours)
    VALUES (?, ?, ?)
  `);

    const upsertDayLogStmt = db.prepare(`
    INSERT INTO user_day_logs (user_id, work_date, worked_hours)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, work_date)
    DO UPDATE SET worked_hours = excluded.worked_hours
  `);

    const getDayLogStmt = db.prepare(`
    SELECT id
    FROM user_day_logs
    WHERE user_id = ? AND work_date = ?
  `);

    const deletePracticesStmt = db.prepare(`
    DELETE FROM user_day_log_practices
    WHERE day_log_id = ?
  `);

    const deleteItemsStmt = db.prepare(`
    DELETE FROM user_day_log_items
    WHERE day_log_id = ?
  `);

    const insertPracticeStmt = db.prepare(`
    INSERT INTO user_day_log_practices (day_log_id, practice_type, matiere_id)
    VALUES (?, ?, NULL)
  `);

    const insertItemStmt = db.prepare(`
    INSERT INTO user_day_log_items (day_log_id, item_id)
    VALUES (?, ?)
  `);

    const deleteFullRangeStmt = db.prepare(`
    DELETE FROM user_day_logs
    WHERE user_id = ?
      AND work_date BETWEEN ? AND ?
  `);

    const tx = db.transaction((rows) => {
        let processedDays = 0;
        let insertedPractices = 0;
        let insertedItems = 0;
        let deletedDayLogs = 0;

        if (REPLACE_MODE === "replace-full-range") {
            const { minDate, maxDate } = getDateRange(rows);
            const deleteResult = deleteFullRangeStmt.run(USER_ID, minDate, maxDate);
            deletedDayLogs = deleteResult.changes;

            for (const row of rows) {
                insertDayLogStmt.run(USER_ID, row.date, row.hours);

                const dayLog = getDayLogStmt.get(USER_ID, row.date);
                if (!dayLog) {
                    throw new Error(`Impossible de retrouver le day_log créé pour ${row.date}`);
                }

                const dayLogId = dayLog.id;
                const practices = getPracticesForRow(row, DEFAULT_PRACTICES);
                const items = Array.isArray(row.items) ? row.items : [];

                for (const practiceType of practices) {
                    insertPracticeStmt.run(dayLogId, practiceType);
                    insertedPractices++;
                }

                for (const itemId of items) {
                    insertItemStmt.run(dayLogId, itemId);
                    insertedItems++;
                }

                processedDays++;
            }
        } else {
            for (const row of rows) {
                upsertDayLogStmt.run(USER_ID, row.date, row.hours);

                const dayLog = getDayLogStmt.get(USER_ID, row.date);
                if (!dayLog) {
                    throw new Error(`Impossible de retrouver le day_log après upsert pour ${row.date}`);
                }

                const dayLogId = dayLog.id;

                deletePracticesStmt.run(dayLogId);
                deleteItemsStmt.run(dayLogId);

                const practices = getPracticesForRow(row, DEFAULT_PRACTICES);
                const items = Array.isArray(row.items) ? row.items : [];

                for (const practiceType of practices) {
                    insertPracticeStmt.run(dayLogId, practiceType);
                    insertedPractices++;
                }

                for (const itemId of items) {
                    insertItemStmt.run(dayLogId, itemId);
                    insertedItems++;
                }

                processedDays++;
            }
        }

        return {
            processedDays,
            insertedPractices,
            insertedItems,
            deletedDayLogs
        };
    });

    const result = tx(logs);

    console.log(`OK: user_id=${USER_ID} (${user.name})`);
    console.log(`Mode: ${REPLACE_MODE}`);
    console.log(`Journées traitées: ${result.processedDays}`);
    console.log(`Practices insérées: ${result.insertedPractices}`);
    console.log(`Items insérés: ${result.insertedItems}`);

    if (REPLACE_MODE === "replace-full-range") {
        console.log(`Day logs supprimés sur la plage: ${result.deletedDayLogs}`);
    }
}

try {
    main();
} catch (error) {
    console.error("ERREUR:", error.message);
    process.exit(1);
}