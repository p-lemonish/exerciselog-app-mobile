import React, { useState, useEffect } from 'react';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import {
    View,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView,
} from 'react-native';
import api from '../Service/api';

interface Workout {
    id: number;
    workoutName: string;
    workoutNotes: string;
    selectedExerciseIds: number[];
}

interface Exercise {
    id: number;
    exerciseName: string;
    plannedSets: number;
    plannedReps: number;
    plannedWeight: number;
    notes: string;
}

const EditWorkout = ({ navigation, route }: any) => {
    const { workout } = route.params as { workout: Workout; };
    const theme = useTheme();
    const id = workout.id;
    const [workoutName, setWorkoutName] = useState(workout.workoutName);
    const [workoutNotes, setWorkoutNotes] = useState(workout.workoutNotes);
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>(workout.selectedExerciseIds);
    const [plannedExercises, setPlannedExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlannedExercises = async () => {
            try {
                const response = await api.get('/planned');
                setPlannedExercises(response.data);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch planned exercises.');
            } finally {
                setLoading(false);
            }
        };
        fetchPlannedExercises();
    }, []);

    const toggleExerciseSelection = (id: number) => {
        if (selectedExerciseIds.includes(id)) {
            setSelectedExerciseIds(selectedExerciseIds.filter((eid) => eid !== id));
        } else {
            setSelectedExerciseIds([...selectedExerciseIds, id]);
        }
    };

    const handleSaveChanges = async () => {
        if (!workoutName.trim()) {
            Alert.alert('Validation', 'Workout must have a name.');
            return;
        }
        if (selectedExerciseIds.length === 0) {
            Alert.alert('Validation', 'Select at least one exercise.');
            return;
        }
        try {
            const payload = {
                id,
                workoutName,
                workoutNotes,
                selectedExerciseIds,
            };
            await api.put(`/workouts/${id}`, payload);
            Alert.alert('Success', 'Workout updated successfully.');
            navigation.navigate('WorkoutList');
        } catch (error) {
            Alert.alert('Error', 'Failed to update workout.');
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading planned exercises...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 20,
                backgroundColor: theme.colors.background,
                flexGrow: 1,
            }}>
            <Text
                style={{
                    fontSize: 26,
                    fontWeight: 'bold',
                    marginBottom: 20,
                    textAlign: 'center',
                }}
            >
                Edit Workout
            </Text>

            <Text style={{ fontSize: 18, marginVertical: 10 }}>
                Workout Name
            </Text>
            <TextInput
                value={workoutName}
                onChangeText={setWorkoutName}
                mode="outlined"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <Text style={{ fontSize: 18, marginVertical: 10 }}>
                Workout Notes (optional)
            </Text>
            <TextInput
                placeholder="Enter any notes here"
                multiline
                value={workoutNotes}
                onChangeText={setWorkoutNotes}
                mode="outlined"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8, height: 80 }}
            />
            <Text style={{ fontSize: 18, marginVertical: 10 }}>
                Select Planned Exercises:
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {plannedExercises.map((ex) => {
                    const isSelected = selectedExerciseIds.includes(ex.id);
                    return (
                        <TouchableOpacity
                            key={ex.id}
                            onPress={() => toggleExerciseSelection(ex.id)}
                            style={{
                                backgroundColor: isSelected ? theme.colors.primary : theme.colors.secondary,
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                borderRadius: 20,
                                marginRight: 10,
                                marginBottom: 10,
                            }}
                        >
                            <Text >
                                {`${ex.exerciseName} ${ex.plannedWeight}kg @ ${ex.plannedSets}x${ex.plannedReps}`}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                <Button mode="contained" onPress={handleSaveChanges}
                >
                    Save Changes
                </Button>
                <Button mode="contained" buttonColor="#ff5c5c" onPress={() => navigation.goBack()}
                >
                    Cancel
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    exerciseList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    exerciseItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
});

export default EditWorkout;

