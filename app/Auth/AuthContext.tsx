import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
    token: string | null;
    username: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, token: string) => Promise<void>;
    logout: () => Promise<void>;
    restoreToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'auth';

async function storeToken(username: string, token: string) {
    try {
        const value = JSON.stringify({ username, token });
        await SecureStore.setItemAsync(AUTH_KEY, value, {
            keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
        });
    } catch (error) {
        console.error("Error storing token:", error);
    }
}

async function retrieveToken(): Promise<{ username: string; token: string; } | null> {
    try {
        const stored = await SecureStore.getItemAsync(AUTH_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error("Error retrieving token:", error);
        return null;
    }
}

async function removeToken() {
    try {
        await SecureStore.deleteItemAsync(AUTH_KEY);
    } catch (error) {
        console.error("Error removing token:", error);
    }
}

export const AuthProvider = ({ children }: { children: ReactNode; }) => {
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const login = async (username: string, token: string) => {
        await storeToken(username, token);
        setUsername(username);
        setToken(token);
    };

    const logout = async () => {
        await removeToken();
        setUsername(null);
        setToken(null);
    };

    const restoreToken = async () => {
        const stored = await retrieveToken();
        if (stored) {
            setUsername(stored.username);
            setToken(stored.token);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        restoreToken();
    }, []);

    const isAuthenticated = !!token;

    const contextValue = useMemo(
        () => ({ token, username, isAuthenticated, isLoading, login, logout, restoreToken }),
        [token, username, isAuthenticated, isLoading]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

