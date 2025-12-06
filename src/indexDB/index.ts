"use client"
import { openDB } from "idb";

export const dbPromise = openDB("server-less", 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains("trips")) {
            const store = db.createObjectStore("trips", { keyPath: "id" })
            store.createIndex("routeId", "routeId", { unique: false })
        }
        if (!db.objectStoreNames.contains("companies")) {
            db.createObjectStore("companies", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("popRoutes")) {
            db.createObjectStore("popRoutes", { keyPath: "routeId" })
        }
        if (!db.objectStoreNames.contains("tickets")) {
            db.createObjectStore("tickets", { keyPath: "id" })
        }
    },
});


