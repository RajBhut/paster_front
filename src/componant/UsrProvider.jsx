import React, { createContext, useContext, useState } from "react";
const Usercontext = createContext();
export default function UsrProvider({ children }) {
  const [user, setuser] = useState(null);
  return (
    <Usercontext.Provider value={{ user, setuser }}>
      {children}
    </Usercontext.Provider>
  );
}
export { Usercontext };
