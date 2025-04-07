import React from 'react';
import { AuthProvider } from './Auth/AuthContext';
import AppNavigator from './Navigator';
import { Provider as PaperProvider } from 'react-native-paper';
import { MyLightTheme, MyDarkTheme } from './theme';
import { useColorScheme } from 'react-native';

export default function App() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? MyDarkTheme : MyLightTheme;
    return (
        <AuthProvider>
            <PaperProvider theme={theme}>
                <AppNavigator />
            </PaperProvider>
        </AuthProvider>
    );
}

