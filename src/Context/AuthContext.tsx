import React, { createContext, ReactNode, useEffect, useState } from "react";
import { jwtDecode , JwtPayload} from "jwt-decode";


interface CustomJwtPayload extends JwtPayload {
  userGroup?: string;
}
// Define the shape of your authentication data//
export interface IAuth {
  userData: CustomJwtPayload | null;
  saveUserData: () => void;
  requestHeaders: Record<string, string>;
  baseUrl: string;
  userRole: string;
  updateUserData: (newUserData: CustomJwtPayload) => void;
}

// Create the AuthContext and set the initial value to null
export const AuthContext = createContext<IAuth>({
  userData: null,
  saveUserData: () => {},
  requestHeaders: {},
  baseUrl: '"https://upskilling-egypt.com:3003/api/v1',
  userRole: '',
  updateUserData: () => {},
});


// Define the props for AuthContextProvider component
interface AuthContextProviderProps {
  children: ReactNode;
}

// AuthContextProvider component that provides the AuthContext to its children
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<CustomJwtPayload | null>(null);
  const [userRole, setUserRole] = useState<string>('');

  const updateUserData =(newUserData:CustomJwtPayload)=>{
    setUserData(newUserData);
    setUserRole(newUserData?.userGroup || "");
  }
  // Save user data function
  const saveUserData = () => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const decodedToken: CustomJwtPayload = jwtDecode(token);
        setUserData(decodedToken);
        setUserRole(decodedToken.userGroup || "");
      } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
      }
    }
  };

  // Compute request headers
  const requestHeaders: Record<string, string> = {
    Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
  };

  // On component mount, check for userToken and save data
  useEffect(() => {   
      saveUserData();
  }, []);

  // Value to be provided by the context
  const contextValue: IAuth = {
    userData,
    saveUserData,
    requestHeaders,
    baseUrl: "https://upskilling-egypt.com:3003/api/v1",
    userRole,
    updateUserData
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
