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

    console.log('[AuthProvider] RENDERING - auth available:', !!auth);

    useEffect(() => {
        console.log('[AuthProvider useEffect] STARTING');
        console.log('[AuthProvider useEffect] Auth instance:', !!auth, 'Type:', typeof auth);

        // Instantly set to false if auth is not available
        if (!auth) {
            console.error('[AuthProvider useEffect] AUTH IS NULL - setting loading to false immediately');
            setLoading(false);
            return;
        }

        // Flag to track if component is still mounted
        let isMounted = true;

        // CRITICAL: Set immediate timeout to force loading to false
        const forceTimeout = setTimeout(() => {
            if (isMounted) {
                console.log('[AuthProvider useEffect] FORCE TIMEOUT FIRED - setting loading to false');
                setLoading(false);
            }
        }, 1500);

        try {
            console.log('[AuthProvider useEffect] Setting up onAuthStateChanged');
            
            const unsubscribe = onAuthStateChanged(
                auth,
                (currentUser) => {
                    if (isMounted) {
                        console.log('[AuthProvider useEffect] Auth changed - user:', currentUser?.email || 'none');
                        setUser(currentUser);
                        setLoading(false);
                        clearTimeout(forceTimeout);
                    }
                },
                (error) => {
                    console.error('[AuthProvider useEffect] Auth listener error:', error);
                    if (isMounted) {
                        setLoading(false);
                        clearTimeout(forceTimeout);
                    }
                }
            );

            console.log('[AuthProvider useEffect] onAuthStateChanged subscribed');

            return () => {
                isMounted = false;
                clearTimeout(forceTimeout);
                unsubscribe();
                console.log('[AuthProvider useEffect] Cleanup called');
            };
        } catch (error) {
            console.error('[AuthProvider useEffect] Exception:', error);
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