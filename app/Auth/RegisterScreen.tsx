import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigator';

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post(`${baseURL}/register`, {
                username,
                email,
                password,
                confirmPassword,
            });

            if (response.status === 200 || response.status === 201) {
                Alert.alert('Registration Successful', 'Please log in with your new credentials.');
                navigation.navigate('Login');
            } else {
                Alert.alert('Registration Failed', response.data.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Registration Error', 'An error occurred during registration.');
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Register</Text>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                secureTextEntry
                onChangeText={setConfirmPassword}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <Button title="Register" onPress={handleRegister} />
            <View style={{ marginTop: 20 }}>
                <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
            </View>
        </View>
    );
};

export default RegisterScreen;

