import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";

type AuthContextType = {
    user: User | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Instantly set to false if auth is not available
        if (!auth) {
            setLoading(false);
            return;
        }

        // Flag to track if component is still mounted
        let isMounted = true;

        // Timeout to force loading to false
        const forceTimeout = setTimeout(() => {
            if (isMounted) {
                setLoading(false);
            }
        }, 1500);

        try {
            const unsubscribe = onAuthStateChanged(
                auth,
                (currentUser) => {
                    if (isMounted) {
                        setUser(currentUser);
                        setLoading(false);
                        clearTimeout(forceTimeout);
                    }
                },
                (error) => {
                    if (isMounted) {
                        setLoading(false);
                        clearTimeout(forceTimeout);
                    }
                }
            );

            return () => {
                isMounted = false;
                clearTimeout(forceTimeout);
                unsubscribe();
            };
        } catch (error) {
            if (isMounted) {
                setLoading(false);
                clearTimeout(forceTimeout);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};