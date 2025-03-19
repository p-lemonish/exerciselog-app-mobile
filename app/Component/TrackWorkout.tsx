import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TrackWorkout = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Track Workout</Text>
            <Text style={styles.description}>
                Monitor your progress by tracking past workouts and analyzing your performance over time.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default TrackWorkout;

