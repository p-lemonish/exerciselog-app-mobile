import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import api from '../Service/api';
import { MyDarkTheme } from '../theme';

interface PlannedExercise {
    id: number;
    exerciseName: string;
    plannedSets: number;
    plannedReps: number;
    plannedWeight: number;
    notes: string;
}

interface SetResult {
    setNumber: number;
    reps: number;
    weight: number;
    completed: boolean;
}

interface Workout {
    id: number;
    workoutName: string;
    workoutNotes: string;
    selectedExerciseIds: number[];
}

interface ExerciseLog {
    exerciseId: number;
    exerciseName: string;
    setLogDtoList: SetResult[];
    notes: string;
}

interface CompletedWorkout {
    id: number;
    workoutName: string;
    workoutNotes: string;
    exercises: ExerciseLog[];
}

const StartWorkout = ({ navigation, route }: any) => {
    const { workoutId } = route.params as { workoutId: number; };
    const [setResults, setSetResults] = useState<Record<number, SetResult[]>>({});
    const [plannedExercises, setPlannedExercises] = useState<PlannedExercise[]>([]);
    const [workout, setWorkout] = useState<Workout>();

    useEffect(() => {
        const fetchWorkoutAndExercises = async () => {
            const workoutResponse = await api.get(`/workouts/${workoutId}`);
            const workoutData = workoutResponse.data;
            setWorkout(workoutData);
            const idsString = workoutData.selectedExerciseIds.join(',');
            const exercisesResponse = await api.get(`/planned/ids/${idsString}`);
            setPlannedExercises(exercisesResponse.data);
        };
        fetchWorkoutAndExercises();
    }, [workoutId]);

    useEffect(() => {
        if (plannedExercises.length > 0) {
            const initialResults: Record<number, SetResult[]> = {};
            plannedExercises.forEach((ex) => {
                const sets: SetResult[] = [];
                for (let i = 0; i < ex.plannedSets; i++) {
                    sets.push({
                        setNumber: i + 1,
                        reps: ex.plannedReps,
                        weight: ex.plannedWeight,
                        completed: false,
                    });
                }
                initialResults[ex.id] = sets;
            });
            setSetResults(initialResults);
        }
    }, [plannedExercises]);

    const updateSetResult = (
        exerciseId: number,
        setIndex: number,
        field: keyof SetResult,
        value: number | boolean
    ) => {
        setSetResults((prev) => {
            const newResults = { ...prev };
            const exerciseResults = newResults[exerciseId];
            if (!exerciseResults) return prev;
            exerciseResults[setIndex] = { ...exerciseResults[setIndex], [field]: value };
            return { ...newResults, [exerciseId]: exerciseResults };
        });
    };

    const toggleSetCompleted = (exerciseId: number, setIndex: number) => {
        updateSetResult(exerciseId, setIndex, 'completed', !setResults[exerciseId][setIndex].completed);
    };

    const completeWorkout = async () => {
        if (!workout) return;
        const exerciseLogDtos: ExerciseLog[] = plannedExercises
            .filter((ex) => workout.selectedExerciseIds.includes(ex.id))
            .map((ex) => {
                const completedSets = (setResults[ex.id] || []).filter((s) => s.completed);
                if (completedSets.length > 0) {
                    return {
                        exerciseId: ex.id,
                        exerciseName: ex.exerciseName,
                        setLogDtoList: completedSets.map(({ completed, ...rest }) => rest),
                        notes: ex.notes || '',
                    };
                } else {
                    return null;
                }
            })
            .filter((log) => log !== null) as ExerciseLog[];

        const completedWorkoutObj: CompletedWorkout = {
            id: workoutId,
            workoutName: workout.workoutName,
            workoutNotes: workout.workoutNotes,
            exercises: exerciseLogDtos,
        };

        try {
            await api.post(`/workouts/complete/${workout.id}`, completedWorkoutObj);
            Alert.alert('Success', 'Workout completed!');
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Error', 'Failed to complete workout.');
        }
    };

    const renderSetControls = (
        exercise: PlannedExercise,
        setIndex: number,
        setResult: SetResult
    ) => {
        return (
            <View
                key={setIndex}
                style={{
                    marginBottom: 15,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 10,
                }}
            >
                <Text style={{ fontSize: 16, marginBottom: 5, color: MyDarkTheme.colors.text }}>
                    {`Set ${setIndex + 1}:`}
                </Text>

                <View style={{ marginVertical: 5 }}>
                    <Text style={{ fontSize: 14, marginBottom: 3, color: MyDarkTheme.colors.text }}>
                        Reps: {setResult.reps}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 5 }}>
                        <Button
                            mode="contained"
                            onPress={() =>
                                updateSetResult(exercise.id, setIndex, 'reps', Math.max(1, setResult.reps - 5))
                            }
                        >
                            -5
                        </Button>
                        <Button
                            mode="contained"
                            onPress={() =>
                                updateSetResult(exercise.id, setIndex, 'reps', Math.max(1, setResult.reps - 1))
                            }
                        >
                            -1
                        </Button>
                        <Button
                            mode="contained"
                            onPress={() => updateSetResult(exercise.id, setIndex, 'reps', setResult.reps + 1)}
                        >
                            +1
                        </Button>
                        <Button
                            mode="contained"
                            onPress={() => updateSetResult(exercise.id, setIndex, 'reps', setResult.reps + 5)}
                        >
                            +5
                        </Button>
                    </View>
                </View>

                <View style={{ marginVertical: 5 }}>
                    <Text style={{ fontSize: 14, marginBottom: 3, color: MyDarkTheme.colors.text }}>
                        Weight (kg): {setResult.weight}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 5 }}>
                        <Button
                            mode="contained"
                            onPress={() =>
                                updateSetResult(exercise.id, setIndex, 'weight', setResult.weight + 0.5)
                            }
                        >
                            +0.5
                        </Button>
                        <Button
                            mode="contained"
                            onPress={() =>
                                updateSetResult(exercise.id, setIndex, 'weight', setResult.weight + 5)
                            }
                        >
                            +5
                        </Button>
                        <Button
                            mode="contained"
                            onPress={() =>
                                updateSetResult(exercise.id, setIndex, 'weight', setResult.weight + 20)
                            }
                        >
                            +20
                        </Button>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 5 }}>
                        <Button
                            mode="contained"
                            onPress={() =>
                                updateSetResult(exercise.id, setIndex, 'weight', Math.max(0, setResult.weight - 0.5))
                            }
                        >
                            -0.5
                        </Button>
                        <Button
                            mode="contained"
                            onPress={() =>
                                updateSetResult(exercise.id, setIndex, 'weight', Math.max(0, setResult.weight - 5))
                            }
                        >
                            -5
                        </Button>
                        <Button
                            mode="contained"
                            onPress={() =>
                                updateSetResult(exercise.id, setIndex, 'weight', Math.max(0, setResult.weight - 20))
                            }
                        >
                            -20
                        </Button>
                    </View>
                </View>

                <TouchableOpacity
                    style={{
                        marginTop: 10,
                        alignSelf: 'center',
                        backgroundColor: setResult.completed ? MyDarkTheme.colors.primary : '#444',
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 5,
                    }}
                    onPress={() => toggleSetCompleted(exercise.id, setIndex)}
                >
                    <Text style={{ fontSize: 16, color: '#fff' }}>
                        {setResult.completed ? '✓ Completed' : 'Mark as Done'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 20,
                backgroundColor: MyDarkTheme.colors.background,
                flexGrow: 1,
            }}
        >
            {workout && (
                <Text
                    style={{
                        fontSize: 26,
                        fontWeight: 'bold',
                        marginBottom: 20,
                        color: MyDarkTheme.colors.text,
                        textAlign: 'center',
                    }}
                >
                    {`Workout: ${workout.workoutName}`}
                </Text>
            )}
            {plannedExercises.map((ex) => (
                <View
                    key={ex.id}
                    style={{
                        marginBottom: 30,
                        borderBottomWidth: 1,
                        borderColor: '#ccc',
                        paddingBottom: 10,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 22,
                            fontWeight: '600',
                            marginBottom: 10,
                            color: MyDarkTheme.colors.text,
                        }}
                    >
                        {ex.exerciseName}
                    </Text>
                    {setResults[ex.id] &&
                        setResults[ex.id].map((setResult, index) => renderSetControls(ex, index, setResult))}
                </View>
            ))}
            <View style={{ marginTop: 30, alignItems: 'center' }}>
                <Button mode="contained" onPress={completeWorkout}>
                    Complete Workout
                </Button>
            </View>
        </ScrollView>
    );
};

export default StartWorkout;

