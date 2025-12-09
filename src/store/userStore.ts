import { User } from "@/types/Firestore_Type";
import { create } from "zustand"

interface UserStore {
    users: User[],
    addUser: (user: User) => void
    removeUser: (id: string) => void
    setUsers: (users: User[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    users: [],
    addUser: (user) => set((state) => ({ users: [...state.users, user] })),
    removeUser: (id) => set((state) => ({ users: state.users.filter((u) => (u.id !== id)) })),
    setUsers: (users) => set({ users })
}))