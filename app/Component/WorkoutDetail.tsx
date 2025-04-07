import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { MyDarkTheme } from '../theme';

const WorkoutDetail = ({ navigation, route }: any) => {
    const { workout } = route.params;
    const workoutId = workout.id;

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 20,
                backgroundColor: MyDarkTheme.colors.background,
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text
                style={{
                    fontSize: 26,
                    fontWeight: 'bold',
                    marginBottom: 20,
                    color: MyDarkTheme.colors.text,
                }}
            >
                {`Workout: ${workout.workoutName}`}
            </Text>
            <Text
                style={{
                    fontSize: 18,
                    marginVertical: 5,
                    textAlign: 'center',
                    color: MyDarkTheme.colors.text,
                }}
            >
                {`Notes: ${workout.workoutNotes || 'None'}`}
            </Text>
            <Text
                style={{
                    fontSize: 18,
                    marginVertical: 5,
                    textAlign: 'center',
                    color: MyDarkTheme.colors.text,
                }}
            >
                {`Exercises: ${workout.selectedExerciseIds.join(', ')}`}
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 30,
                    width: '100%',
                }}
            >
                <Button mode="contained" onPress={() => navigation.navigate('StartWorkout', { workoutId })}>
                    Start Workout
                </Button>
                <Button mode="contained" onPress={() => navigation.navigate('EditWorkout', { workout })}>
                    Edit Workout
                </Button>
            </View>
        </ScrollView>
    );
};

export default WorkoutDetail;

