import { createContext, useContext } from "react";
import type { UserContextType } from "../../lib/interfaces";

export const UserContext = createContext<UserContextType | undefined>(undefined);


export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
