
// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useNavigate } from 'react-router-dom';

// interface User {
//   _id?: string;
//   username: string;
//   email: string;
//   name: string;
//   emailNotifications: boolean;
//   pushNotifications: boolean;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (userData: User) => void;
//   logout: () => void;
//   updateUser: (userData: Partial<User>) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Check for saved user data on initial load
//   useEffect(() => {
//     const savedUser = localStorage.getItem('user');
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         localStorage.removeItem('user');
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = (userData: User) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   const updateUser = (userData: Partial<User>) => {
//     setUser(prev => {
//       if (!prev) return null;
//       const updated = { ...prev, ...userData };
//       localStorage.setItem('user', JSON.stringify(updated));
//       return updated;
//     });
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Define a basic User type (adjust based on your actual user data structure)
interface User {
    _id: string;
    username: string;
    email: string;
    name?: string;
    // Add other relevant user fields
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    token?: string; // Often you'll store a JWT token
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (updatedData: Partial<User>) => void; // Added for profile updates
    isLoading: boolean; // To handle initial loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start loading
    const navigate = useNavigate(); // Use navigate for logout redirect

    // Check localStorage on initial load
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('user'); // Clear invalid data
        } finally {
            setIsLoading(false); // Finish loading
        }
    }, []);

    const login = (userData: User) => {
        try {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            // Optional: Navigate here if you want login to always redirect
            // navigate('/dashboard'); // Or wherever your main app page is
        } catch (error) {
            console.error("Failed to save user to localStorage", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login'); // Redirect to login after logout
    };

    // Function to update user details (e.g., from AccountSettings)
    const updateUser = (updatedData: Partial<User>) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            const newUser = { ...prevUser, ...updatedData };
            try {
                localStorage.setItem('user', JSON.stringify(newUser));
            } catch (error) {
                console.error("Failed to update user in localStorage", error);
            }
            return newUser;
        });
    };


    const value = {
        user,
        login,
        logout,
        updateUser, // Provide updateUser
        isLoading
    };

    // Don't render children until loading is complete to avoid flicker
    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
