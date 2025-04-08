import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const MyDarkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        background: '#121212',
        surface: '#1F1F1F',
        onBackground: '#FFFFFF',
        onPrimary: '#FFFFFF',
        primary: '#BB86FC',
        secondary: '#C0C0C0',
    },
};

export const MyLightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        background: '#FFFFFF',
        surface: '#F0F0F0',
        onBackground: '#000000',
        onPrimary: '#000000',
        primary: '#BB86FC',
        secondary: '#C0C0C0',
    },
};
