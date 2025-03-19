import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../Auth/AuthContext';
import api from '../Service/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigator';

const Profile = () => {
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
            console.error(error);
            Alert.alert('Error', 'Failed to update password.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size='large' color='#0000ff' />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Profile</Text>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.info}>{userData.username || 'N/A'}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.info}>{userData.email || 'N/A'}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Role:</Text>
                <Text style={styles.info}>{userData.roleName || 'N/A'}</Text>
            </View>

            <Text style={styles.subtitle}>Change Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Current Password"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <Button
                title={isUpdating ? 'Updating...' : 'Change Password'}
                onPress={handleChangePassword}
                disabled={isUpdating}
            />

            <View style={styles.logoutContainer}>
                <Button title="Logout" onPress={authContext?.logout} color="#ff5c5c" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 80,
    },
    info: {
        fontSize: 16,
        flexShrink: 1,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    logoutContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
});

export default Profile;
