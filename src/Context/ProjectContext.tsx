import axios from "axios";
import React, {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
  useCallback
} from "react";
import { AuthContext } from "./AuthContext";

// Définition du type pour les projets
export interface Project {
  title: string;
  description: string;
}

// Définition du type du contexte
export interface ProjectContextType {
  getAllProjectsList: () => void;
  projects: Project[];
  isLoading: boolean;
}

// Create the AuthContext and set the initial value to null
export const ProjectContext = createContext<ProjectContextType>({
  getAllProjectsList: () => {},
  projects: [],
  isLoading: false,
});

// Définition des props pour le provider
interface ProjectContextProviderProps {
  children: ReactNode;
}

// Composant `ProjectContextProvider
export const ProjectContextProvider: React.FC<ProjectContextProviderProps> = ({
  children,
}) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(
      "ProjectContextProvider must be used within an AuthContextProvider"
    );
  }

  const { baseUrl, requestHeaders } = useContext(AuthContext);
  const [projects, setProjects] = useState<Project[]>([]);
  // console.log(projects, "from projectContext");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAllProjectsList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<Project[]>(
        `${baseUrl}/Project/manager`,
        {
          headers: requestHeaders,
        }
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des projets :", error);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, requestHeaders]);

  useEffect(() => {
    getAllProjectsList();
  }, [getAllProjectsList]);

  // Value to be provided by the context
  const contextValue: ProjectContextType = {
    getAllProjectsList,
    projects,
    isLoading,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
