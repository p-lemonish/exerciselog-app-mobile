import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

const WorkoutDetail = ({ navigation, route }: any) => {
    const { workout } = route.params;
    const workoutId = workout.id;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{`Workout: ${workout.workoutName}`}</Text>
            <Text style={styles.details}>{`Notes: ${workout.workoutNotes || 'None'}`}</Text>
            <Text style={styles.details}>
                {`Exercises: ${workout.selectedExerciseIds.join(', ')}`}
            </Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="Start Workout"
                    onPress={() => navigation.navigate('StartWorkout', { workoutId })}
                />
                <Button title="Edit Workout" onPress={() => navigation.navigate('EditWorkout', { workout })} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    details: {
        fontSize: 18,
        marginVertical: 5,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
        width: '100%',
    },
});

export default WorkoutDetail;

