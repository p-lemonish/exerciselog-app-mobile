import React from 'react';
import { AuthProvider } from './Auth/AuthContext';
import AppNavigator from './Navigator';

export default function App() {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}

