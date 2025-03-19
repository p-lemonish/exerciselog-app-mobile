import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlanWorkout = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Plan Workout</Text>
            <Text style={styles.description}>
                Create a detailed workout plan by grouping exercises and sets for your gym sessions.
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

export default PlanWorkout;

