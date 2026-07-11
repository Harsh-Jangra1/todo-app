"use strict";

function generateId() {
    return Date.now().toString();
}

function getCurrentDate() {
    return new Date().toISOString().split("T")[0];
}

function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function isEmpty(value) {
    return value.trim() === "";
}