import { db } from "@/firebase/fireConfig";
import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    collection,
} from "firebase/firestore";

import { userInfo } from "@/typeOf/Firestore_Type";

const USER_COLLECTION = "users";

export async function addUser(id: string, data: userInfo) {
    const userId = id;
    const ref = doc(db, USER_COLLECTION, userId);
    await setDoc(ref, data, { merge: true }); // an toàn khi cập nhật
}

export async function getUserById(id: string) {
    const ref = doc(db, USER_COLLECTION, id);
    const snap = await getDoc(ref);
    return snap.exists() ? { id, ...snap.data() } : null;
}

export async function getAllUsers() {
    const ref = collection(db, USER_COLLECTION);
    const snap = await getDocs(ref);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateUser(id: string, data: Partial<userInfo>) {
    const ref = doc(db, USER_COLLECTION, id);
    await updateDoc(ref, data);
}


