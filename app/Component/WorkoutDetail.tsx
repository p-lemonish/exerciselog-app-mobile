import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';

const WorkoutDetail = ({ navigation, route }: any) => {
    const { workout } = route.params;
    const workoutId = workout.id;
    const theme = useTheme();

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 20,
                backgroundColor: theme.colors.background,
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
                }}
            >
                {`Workout: ${workout.workoutName}`}
            </Text>
            <Text
                style={{
                    fontSize: 18,
                    marginVertical: 5,
                    textAlign: 'center',
                }}
            >
                {`Notes: ${workout.workoutNotes || 'None'}`}
            </Text>
            <Text
                style={{
                    fontSize: 18,
                    marginVertical: 5,
                    textAlign: 'center',
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

