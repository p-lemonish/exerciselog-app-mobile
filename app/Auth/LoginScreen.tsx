import React, { useState, useContext } from 'react';
import { View, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigator';
import { MyDarkTheme } from '../theme';

export const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const authContext = useContext(AuthContext);
    const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleLogin = async () => {
        const response = await axios.post(`${baseURL}/login`, { username, password });
        const data = response.data;

        if (response.status === 200 && data.jwt) {
            authContext?.login(username, data.jwt);
            Alert.alert('Login Success!', data.message);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } else {
            Alert.alert('Login Failed', data.message || 'Please check your credentials.');
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center', backgroundColor: MyDarkTheme.colors.background }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
                placeholderTextColor="#AAAAAA"
            />
            <TextInput
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                mode="outlined"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <Button mode="contained" onPress={handleLogin}>
                Login
            </Button>
            <TouchableOpacity onPress={handleRegister} style={{ marginTop: 20 }}>
                <Text style={{ color: MyDarkTheme.colors.primary, textAlign: 'center' }}>
                    Don't have an account? Register here
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
