import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RootStackParamList } from './Navigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Welcome to the Home Screen!</Text>
            </View>

            <View style={styles.menuContainer}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('CreateExercise')}
                >
                    <Text style={styles.menuText}>Create & Plan Exercises</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('PlanWorkout')}
                >
                    <Text style={styles.menuText}>Plan Your Workout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('WorkoutList')}
                >
                    <Text style={styles.menuText}>Your Workouts</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('TrackProgress')}
                >
                    <Text style={styles.menuText}>Track Workout Progress</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Text style={styles.menuText}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
    },
    welcome: {
        fontSize: 24,
        marginBottom: 10,
    },
    menuContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    menuItem: {
        backgroundColor: '#adebb3',
        padding: 20,
        marginVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    menuText: {
        fontSize: 18,
        color: '#333',
    },
    profileContainer: {
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    profileText: {
        fontWeight: 'bold',
    },
});

export default HomeScreen;
