import React, { createContext, useState, type ReactNode } from "react";
import type { User } from "@/types";

interface UserContextValue {
  user: User | null;
  setuser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const Usercontext = createContext<UserContextValue>({
  user: null,
  setuser: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setuser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? (JSON.parse(storedUser) as User) : null;
  });

  return (
    <Usercontext.Provider value={{ user, setuser }}>
      {children}
    </Usercontext.Provider>
  );
}
