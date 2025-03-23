import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import api from '../Service/api';

interface PlannedExercise {
    id: number;
    exerciseName: string;
    plannedSets: number;
    plannedReps: number;
    plannedWeight: number;
    notes: string;
}

interface ExerciseLog {
    exerciseId: number;
    exerciseName: string;
    setLogDtoList: SetResult[];
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
            if (exerciseResults[setIndex].completed && field !== 'completed') return prev;
            exerciseResults[setIndex] = { ...exerciseResults[setIndex], [field]: value };
            return { ...newResults, [exerciseId]: exerciseResults };
        });
    };

    const toggleSetCompleted = (exerciseId: number, setIndex: number) => {
        updateSetResult(exerciseId, setIndex, 'completed',
            !setResults[exerciseId][setIndex].completed);
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


    const renderSetControls = (exercise: PlannedExercise, setIndex: number, setResult: SetResult) => {
        return (
            <View key={setIndex} style={styles.setRow}>
                <Text style={styles.setLabel}>{`Set ${setIndex + 1}:`}</Text>
                <View style={styles.controlGroup}>
                    <Text style={styles.controlLabel}>Reps:</Text>
                    <View style={styles.adjustContainer}>
                        <Button
                            title="-5"
                            disabled={setResult.completed}
                            onPress={() =>
                                updateSetResult(
                                    exercise.id,
                                    setIndex,
                                    'reps',
                                    Math.max(1, setResult.reps - 5)
                                )
                            }
                        />
                        <Button
                            title="-1"
                            disabled={setResult.completed}
                            onPress={() =>
                                updateSetResult(
                                    exercise.id,
                                    setIndex,
                                    'reps',
                                    Math.max(1, setResult.reps - 1)
                                )
                            }
                        />
                        <Text style={styles.numberText}>{setResult.reps}</Text>
                        <Button
                            title="+1"
                            disabled={setResult.completed}
                            onPress={() =>
                                updateSetResult(
                                    exercise.id,
                                    setIndex,
                                    'reps',
                                    setResult.reps + 1
                                )
                            }
                        />
                        <Button
                            title="+5"
                            disabled={setResult.completed}
                            onPress={() =>
                                updateSetResult(
                                    exercise.id,
                                    setIndex,
                                    'reps',
                                    setResult.reps + 5
                                )
                            }
                        />
                    </View>
                </View>
                <View style={styles.controlGroup}>
                    <Text style={styles.controlLabel}>Weight (kg):</Text>
                    <View style={styles.adjustContainer}>
                        <Button
                            title="-20"
                            disabled={setResult.completed}
                            onPress={() =>
                                updateSetResult(
                                    exercise.id,
                                    setIndex,
                                    'weight',
                                    Math.max(0, setResult.weight - 20)
                                )
                            }
                        />
                        <Button
                            title="-5"
                            disabled={setResult.completed}
                            onPress={() =>
                                updateSetResult(
                                    exercise.id,
                                    setIndex,
                                    'weight',
                                    Math.max(0, setResult.weight - 5)
                                )
                            }
                        />
                        <Button
                            title="-0.5"
                            disabled={setResult.completed}
                            onPress={() =>
                                updateSetResult(
                                    exercise.id,
                                    setIndex,
                                    'weight',
                                    Math.max(0, setResult.weight - 0.5)
                                )
                            }
                        />
                        <Text style={styles.numberText}>{setResult.weight}</Text>
                        <Button
                            title="+0.5"
                            disabled={setResult.completed}
                            onPress={() =>
                                updateSetResult(
                                    exercise.id,
                                    setIndex,
                                    'weight',
                                    setResult.weight + 0.5
                                )
                            }
                        />
                        <Button
                            title="+5"
                            disabled={setResult.completed}
                            onPress={() =>
                                updateSetResult(
                                    exercise.id,
                                    setIndex,
                                    'weight',
                                    setResult.weight + 5
                                )
                            }
                        />
                        <Button
                            title="+20"
                            disabled={setResult.completed}
                            onPress={() =>
                                updateSetResult(
                                    exercise.id,
                                    setIndex,
                                    'weight',
                                    setResult.weight + 20
                                )
                            }
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.completeToggle}
                    onPress={() => toggleSetCompleted(exercise.id, setIndex)}
                >
                    <Text style={styles.completeText}>
                        {setResult.completed ? '✓ Completed' : 'Mark as Done'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {workout && <Text style={styles.title}>{`Workout: ${workout.workoutName}`}</Text>}
            {plannedExercises.map((ex) => (
                <View key={ex.id} style={styles.exerciseBlock}>
                    <Text style={styles.exerciseTitle}>{ex.exerciseName}</Text>
                    {setResults[ex.id] &&
                        setResults[ex.id].map((setResult, index) =>
                            renderSetControls(ex, index, setResult)
                        )}
                </View>
            ))}
            <View style={styles.buttonContainer}>
                <Button title="Complete Workout" onPress={completeWorkout} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    exerciseBlock: {
        marginBottom: 30,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingBottom: 10,
    },
    exerciseTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 10,
    },
    setRow: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
    },
    setLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    controlGroup: {
        marginVertical: 5,
    },
    controlLabel: {
        fontSize: 14,
        marginBottom: 3,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    adjustContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 5,
    },
    completeToggle: {
        marginTop: 10,
        alignSelf: 'center',
        backgroundColor: '#eee',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    completeText: {
        fontSize: 16,
        color: '#007bff',
    },
    buttonContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    numberText: {
        fontSize: 16,
        marginHorizontal: 8,
        alignSelf: 'center',
    },
});

export default StartWorkout;

