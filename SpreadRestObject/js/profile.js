"use strict";

const LOKI_PROFILE = Object.freeze({
    id: 13,
    name: "Loki",
    title: "God of Mischief",
    realm: "Asgard",
    age: 1050,
    abilities: ["illusion", "shapeshifting"],
    alliedWithAesir: true,
    status: "free",
});

const MISSION_UPDATE = Object.freeze({
    realm: "Midgard",
    age: 1051,
    abilities: ["illusion", "shapeshifting", "magic"],
    alliedWithAesir: false,
    status: "wanted",
});

function updateLokiProfile(profile, update) {
    return { ...profile, ...update };
}

function hideSecrets(profile, ...fieldsToHide) {
    const result = { ...profile };

    for (const field of fieldsToHide) {
        delete result[field];
    }

    return result;
}

function learnAbilities(profile, ...newAbilities) {
    const { abilities, ...restOfProfile } = profile;

    return {
        ...restOfProfile,
        abilities: [...abilities, ...newAbilities],
    };
}

function mergeMissionUpdates(profile, ...updates) {
    let result = { ...profile };

    for (const update of updates) {
        result = { ...result, ...update };
    }

    return result;
}

function formatObject(value, depth) {
    if (depth === undefined) {
        depth = 0;
    }

    const indent = "  ".repeat(depth);
    const braceIndent = "  ".repeat(Math.max(0, depth - 1));

    if (value === null) {
        return "<span class=\"number\">null</span>";
    }

    if (Array.isArray(value)) {
        const items = value.map(function (item) {
            return indent + "  " + formatObject(item, depth + 2);
        });

        return "[\n" + items.join(",\n") + "\n" + braceIndent + "]";
    }

    if (typeof value === "object") {
        const keys = Object.keys(value);
        const items = keys.map(function (key) {
            const formattedKey = "<span class=\"key\">\"" + escapeHtml(key) + "\"</span>";
            const formattedValue = formatObject(value[key], depth + 2);

            return indent + "  " + formattedKey + ": " + formattedValue;
        });

        return "{\n" + items.join(",\n") + "\n" + braceIndent + "}";
    }

    if (typeof value === "string") {
        return "<span class=\"string\">\"" + escapeHtml(value) + "\"</span>";
    }

    if (typeof value === "number") {
        return "<span class=\"number\">" + value + "</span>";
    }

    if (typeof value === "boolean") {
        return "<span class=\"boolean\">" + value + "</span>";
    }

    return escapeHtml(String(value));
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderSourceData() {
    var html = "" +
        "<div class=\"flex-row between\" style=\"margin-bottom: 16px;\">" +
            "<div style=\"flex: 1;\">" +
                "<div class=\"card-title\" style=\"font-size: 14px; margin-bottom: 8px;\">Source: lokiProfile</div>" +
                "<div class=\"object-display\">" + formatObject(LOKI_PROFILE) + "</div>" +
            "</div>" +
            "<div style=\"flex: 1;\">" +
                "<div class=\"card-title\" style=\"font-size: 14px; margin-bottom: 8px;\">Source: missionUpdate</div>" +
                "<div class=\"object-display\">" + formatObject(MISSION_UPDATE) + "</div>" +
            "</div>" +
        "</div>";

    $("#source-data").html(html);
}

function runTask1() {
    var updatedLoki = updateLokiProfile(LOKI_PROFILE, MISSION_UPDATE);
    var isUnchanged = LOKI_PROFILE !== updatedLoki &&
        LOKI_PROFILE.realm === "Asgard" &&
        MISSION_UPDATE.status === "wanted";

    var html = "" +
        "<div class=\"method-result-block\">" +
            "<div class=\"card-title\" style=\"font-size: 14px; margin-bottom: 8px;\">Spread: { ...lokiProfile, ...missionUpdate }</div>" +
            "<div class=\"function-signature\">" +
                "<span class=\"keyword\">const</span> updatedLoki = { " +
                "<span class=\"punctuation\">...</span>lokiProfile, " +
                "<span class=\"punctuation\">...</span>missionUpdate };" +
            "</div>" +
            "<div class=\"arrow\">▼</div>" +
            "<div class=\"object-display\">" + formatObject(updatedLoki) + "</div>" +
        "</div>";

    if (isUnchanged) {
        html += "<div class=\"result-box success\"><span class=\"value\">✓ Originals unchanged — objects were not mutated</span></div>";
    }

    $("#task1-result").html(html);
}

function runTask2() {
    var updatedLoki = updateLokiProfile(LOKI_PROFILE, MISSION_UPDATE);

    var html = "" +
        "<div class=\"method-result-block\">" +
            "<div class=\"card-title\" style=\"font-size: 14px; margin-bottom: 8px;\">Function: updateLokiProfile(profile, update)</div>" +
            "<div class=\"function-signature\">" +
                "<span class=\"keyword\">function</span> <span class=\"key\">updateLokiProfile</span>(<span class=\"param\">profile</span>, <span class=\"param\">update</span>) " +
                "{ <span class=\"keyword\">return</span> { <span class=\"punctuation\">...</span><span class=\"param\">profile</span>, <span class=\"punctuation\">...</span><span class=\"param\">update</span> }; }" +
            "</div>" +
            "<div class=\"arrow\">▼</div>" +
            "<div class=\"object-display\">" + formatObject(updatedLoki) + "</div>" +
        "</div>";

    $("#task2-result").html(html);
}

function runTask3() {
    var updatedLoki = updateLokiProfile(LOKI_PROFILE, MISSION_UPDATE);
    var publicProfile = hideSecrets(updatedLoki, "id", "status", "alliedWithAesir");
    var hasHiddenFields = publicProfile.id === undefined &&
        publicProfile.status === undefined &&
        publicProfile.alliedWithAesir === undefined;

    var html = "" +
        "<div class=\"method-result-block\">" +
            "<div class=\"card-title\" style=\"font-size: 14px; margin-bottom: 8px;\">Before: updatedLoki (with secrets)</div>" +
            "<div class=\"object-display\">" + formatObject(updatedLoki) + "</div>" +
        "</div>" +
        "<div class=\"method-result-block\">" +
            "<div class=\"function-signature\">" +
                "<span class=\"keyword\">function</span> <span class=\"key\">hideSecrets</span>(<span class=\"param\">profile</span>, <span class=\"punctuation\">...</span><span class=\"param\">fieldsToHide</span>) { " +
                "<span class=\"comment\">// delete each field from copy</span> }" +
            "</div>" +
            "<div class=\"arrow\">▼</div>" +
            "<div class=\"object-display\">" + formatObject(publicProfile) + "</div>" +
        "</div>";

    if (hasHiddenFields) {
        html += "<div class=\"result-box success\"><span class=\"value\">✓ id, status, alliedWithAesir removed successfully</span></div>";
    }

    $("#task3-result").html(html);
}

function runTask4() {
    var updatedLoki = updateLokiProfile(LOKI_PROFILE, MISSION_UPDATE);
    var publicProfile = hideSecrets(updatedLoki, "id", "status", "alliedWithAesir");
    var strongerLoki = learnAbilities(publicProfile, "teleportation", "sorcery");
    var hasNewAbilities = strongerLoki.abilities.indexOf("teleportation") !== -1 &&
        strongerLoki.abilities.indexOf("sorcery") !== -1 &&
        strongerLoki.abilities.length === 4;

    var html = "" +
        "<div class=\"method-result-block\">" +
            "<div class=\"card-title\" style=\"font-size: 14px; margin-bottom: 8px;\">Before: abilities = " + JSON.stringify(publicProfile.abilities) + "</div>" +
            "<div class=\"object-display\">" + formatObject(publicProfile) + "</div>" +
        "</div>" +
        "<div class=\"method-result-block\">" +
            "<div class=\"function-signature\">" +
                "<span class=\"keyword\">function</span> <span class=\"key\">learnAbilities</span>(<span class=\"param\">profile</span>, <span class=\"punctuation\">...</span><span class=\"param\">newAbilities</span>) { " +
                "<span class=\"comment\">// destructure abilities, spread new ones</span> }" +
            "</div>" +
            "<div class=\"arrow\">▼</div>" +
            "<div class=\"object-display\">" + formatObject(strongerLoki) + "</div>" +
        "</div>";

    if (hasNewAbilities) {
        html += "<div class=\"result-box success\"><span class=\"value\">✓ teleportation, sorcery added to abilities array</span></div>";
    }

    $("#task4-result").html(html);
}

function runBonus() {
    var finalLoki = mergeMissionUpdates(
        LOKI_PROFILE,
        MISSION_UPDATE,
        { status: "captured" },
        { realm: "Jotunheim" }
    );

    var isCorrect = finalLoki.status === "captured" &&
        finalLoki.realm === "Jotunheim" &&
        finalLoki.age === 1051;

    var html = "" +
        "<div class=\"method-result-block\">" +
            "<div class=\"function-signature\">" +
                "<span class=\"keyword\">function</span> <span class=\"key\">mergeMissionUpdates</span>(<span class=\"param\">profile</span>, <span class=\"punctuation\">...</span><span class=\"param\">updates</span>) { " +
                "<span class=\"comment\">// spread each update over result</span> }" +
            "</div>" +
            "<div class=\"description-text\">" +
                "Call: mergeMissionUpdates(lokiProfile, missionUpdate, { status: \"captured\" }, { realm: \"Jotunheim\" })" +
            "</div>" +
            "<div class=\"arrow\">▼</div>" +
            "<div class=\"object-display\">" + formatObject(finalLoki) + "</div>" +
        "</div>";

    if (isCorrect) {
        html += "<div class=\"result-box success\"><span class=\"value\">✓ All updates merged successfully</span></div>";
    }

    $("#bonus-result").html(html);
}

$(document).ready(function () {
    renderSourceData();
    runTask1();
    runTask2();
    runTask3();
    runTask4();
    runBonus();
});
