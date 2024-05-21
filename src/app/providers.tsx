"use client";

import { NextUIProvider } from "@nextui-org/react";
import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

interface UserData {
  index: number;
  email: string;
  name: string;
  type: string;
  birthday: string;
  gpa: string;
  school: string;
}

interface UserContextType {
  userData: UserData[];
  setUserData: (data: UserData[]) => void;
  clearUserData: () => void;
  isUserDataEmpty: () => boolean;
}

export const UserContext = createContext<UserContextType>({
  userData: [],
  setUserData: () => [],
  isUserDataEmpty: () => false,
  clearUserData: () => [],
});

interface UserProviderProps {
  children: ReactNode; // Properly typing children here
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Initialize state from localStorage if available and only on the client-side
  const [userData, setUserData] = useState<UserData[]>(() => {
    if (typeof window !== "undefined") {
      const localData = localStorage.getItem("userData");
      return localData ? JSON.parse(localData) : [];
    }
    return []; // Return empty array if not running in the browser
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Use useEffect to update localStorage when userData changes, but only on the client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userData", JSON.stringify(userData));
      setIsInitialized(true);
    }
  }, [userData]);

  const isUserDataEmpty = useCallback(() => userData.length === 0, [userData]);

  const clearUserData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userData");
      setUserData([]);
    }
  };

  return (
    <UserContext.Provider
      value={{ userData, setUserData, isUserDataEmpty, clearUserData }}
    >
      {isInitialized ? children : null}
    </UserContext.Provider>
  );
};

export default UserProvider;

export function Providers({ children }: { children: React.ReactNode }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
