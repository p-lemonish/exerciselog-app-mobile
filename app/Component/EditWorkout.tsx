import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Button,
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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Edit Workout</Text>
            <Text style={styles.label}>Workout Name</Text>
            <TextInput
                style={styles.input}
                value={workoutName}
                onChangeText={setWorkoutName}
                placeholder="Enter workout name"
            />
            <Text style={styles.label}>Workout Notes (optional)</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={workoutNotes}
                onChangeText={setWorkoutNotes}
                placeholder="Enter workout notes"
                multiline
            />
            <Text style={styles.label}>Select Planned Exercises:</Text>
            <View style={styles.exerciseList}>
                {plannedExercises.map((ex) => {
                    const isSelected = selectedExerciseIds.includes(ex.id);
                    return (
                        <TouchableOpacity
                            key={ex.id}
                            style={[styles.exerciseItem, isSelected && styles.exerciseItemSelected]}
                            onPress={() => toggleExerciseSelection(ex.id)}
                        >
                            <Text style={[styles.exerciseText, isSelected && styles.exerciseTextSelected]}>
                                {`${ex.exerciseName} ${ex.plannedWeight}kg @ ${ex.plannedSets}x${ex.plannedReps}`}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Save Changes" onPress={handleSaveChanges} />
                <Button title="Cancel" onPress={() => navigation.goBack()} color="#ff5c5c" />
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
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    exerciseList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    exerciseItem: {
        backgroundColor: '#eee',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    exerciseItemSelected: {
        backgroundColor: '#007bff',
    },
    exerciseText: {
        color: '#000',
    },
    exerciseTextSelected: {
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
});

export default EditWorkout;

