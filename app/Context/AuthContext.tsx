import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import * as Keychain from 'react-native-keychain';

interface AuthContextType {
    token: string | null;
    username: string | null;
    isAuthenticated: boolean;
    login: (username: string, token: string) => Promise<void>;
    logout: () => Promise<void>;
    restoreToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function storeToken(username: string, token: string) {
    try {
        await Keychain.setGenericPassword(username, token, {
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        });
    } catch (error) {
        console.error("Error storing token:", error);
    }
}

async function retrieveToken(): Promise<{ username: string; token: string; } | null> {
    try {
        const credentials = await Keychain.getGenericPassword();
        return credentials ? { username: credentials.username, token: credentials.password } : null;
    } catch (error) {
        console.error("Error retrieving token:", error);
        return null;
    }
}

async function removeToken() {
    try {
        await Keychain.resetGenericPassword();
    } catch (error) {
        console.error("Error removing token:", error);
    }
}

export const AuthProvider = ({ children }: { children: ReactNode; }) => {
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const isAuthenticated = !!token;

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
    };

    useEffect(() => {
        restoreToken();
    }, []);

    return (
        <AuthContext.Provider value={{ username, token, isAuthenticated, login, logout, restoreToken }}>
            {children}
        </AuthContext.Provider>
    );
};
