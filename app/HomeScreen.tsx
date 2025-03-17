import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from './Auth/AuthContext';

export const HomeScreen = () => {
    const authContext = useContext(AuthContext);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>
                Welcome to the Home Screen!
            </Text>
            {authContext && authContext.username && (
                <Text style={{ marginBottom: 20 }}>
                    Hello, {authContext.username}!
                </Text>
            )}
            {authContext && (
                <Button title="Logout" onPress={authContext.logout} />
            )}
        </View>
    );
};

export default HomeScreen;
