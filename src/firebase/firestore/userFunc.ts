import { db } from "@/firebase/fireConfig";
import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    collection,
    Timestamp,
} from "firebase/firestore";

import { CoreData, User } from "@/types/Firestore_Type";

const USER_COLLECTION = "users";

export async function addUser(id: string, data: CoreData) {
    const ref = doc(db, USER_COLLECTION, id);
    await setDoc(ref, data, { merge: true });
}

export async function getUserById(id: string) {
    const ref = doc(db, USER_COLLECTION, id);
    const snap = await getDoc(ref);
    return snap.exists() ? { id, ...snap.data() } : null;
}

export async function getAllUsers() {
    const ref = collection(db, USER_COLLECTION);
    const snap = await getDocs(ref);
    return snap.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<User, "id">),
    }));
}

export async function updateUser(id: string, data: Partial<CoreData>) {
    const ref = doc(db, USER_COLLECTION, id);
    await updateDoc(ref, data);
}
