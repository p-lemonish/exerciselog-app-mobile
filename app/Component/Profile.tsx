import React, { useContext, useEffect, useState } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { AuthContext } from '../Auth/AuthContext';
import api from '../Service/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigator';

const Profile = () => {
    const theme = useTheme();
    const authContext = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [userData, setUserData] = useState({
        id: null,
        username: '',
        email: '',
        roleName: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile');
                setUserData(response.data);
            } catch (error) {
                Alert.alert('Failed to fetch your user details. Please login again');
                navigation.navigate('Login');
            } finally {
                setLoading(false);
            }
        };
        if (!authContext?.isLoading) {
            fetchProfile();
        }
    }, [authContext?.isLoading]);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New password and confirm password do not match.');
            return;
        }
        if (newPassword.trim().length === 0) {
            Alert.alert('Error', 'New password cannot be empty.');
            return;
        }
        if (newPassword.trim().length < 4) {
            Alert.alert('Error', 'New password cannot be shorter than 4 characters.');
            return;
        }

        setIsUpdating(true);
        try {
            await api.post('/profile/change-password', {
                currentPassword,
                newPassword,
            });
            Alert.alert('Success', 'Password updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            Alert.alert('Error', 'Failed to update password.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = () => {
        authContext?.logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.colors.background,
                }}
            >
                <ActivityIndicator size="large" color="#aaa" />
                <Text >Loading...</Text>
            </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                padding: 20,
                backgroundColor: theme.colors.background,
            }}
        >
            <Text
                style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    marginBottom: 20,
                    textAlign: 'center',
                }}
            >
                Your Profile
            </Text>

            <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', width: 80 }}>
                    Name:
                </Text>
                <Text style={{ fontSize: 16, flexShrink: 1 }}>
                    {userData.username || 'N/A'}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', width: 80 }}>
                    Email:
                </Text>
                <Text style={{ fontSize: 16, flexShrink: 1 }}>
                    {userData.email || 'N/A'}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', width: 80 }}>
                    Role:
                </Text>
                <Text style={{ fontSize: 16, flexShrink: 1 }}>
                    {userData.roleName || 'N/A'}
                </Text>
            </View>

            <Text
                style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    marginVertical: 20,
                    textAlign: 'center',
                }}
            >
                Change Password
            </Text>
            <TextInput
                placeholder="Current Password"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                mode="outlined"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <TextInput
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                mode="outlined"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <TextInput
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <Button mode="contained" onPress={handleChangePassword} disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Change Password'}
            </Button>

            <View style={{ marginTop: 30, alignItems: 'center' }}>
                <Button mode="contained" buttonColor="#ff5c5c" onPress={handleLogout}>
                    Logout
                </Button>
            </View>
        </View>
    );
};

export default Profile;

