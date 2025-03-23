import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Button,
    Alert,
    ScrollView,
} from 'react-native';
import api from '../Service/api';

interface Workout {
    id: number;
    workoutName: string;
    workoutNotes: string;
    selectedExerciseIds: number[];
}

const WorkoutList = ({ navigation }: any) => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [selectedForDeletion, setSelectedForDeletion] = useState<number[]>([]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await api.get('/workouts');
                setWorkouts(response.data);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch workouts.');
            } finally {
                setLoading(false);
            }
        };
        fetchWorkouts();
    }, []);

    const toggleEditMode = () => {
        setEditMode(!editMode);
        setSelectedForDeletion([]);
    };

    const toggleSelection = (id: number) => {
        if (selectedForDeletion.includes(id)) {
            setSelectedForDeletion(selectedForDeletion.filter(item => item !== id));
        } else {
            setSelectedForDeletion([...selectedForDeletion, id]);
        }
    };

    const handleDeleteWorkouts = async () => {
        for (const id of selectedForDeletion) {
            try {
                await api.delete(`/workouts/delete-planned/${id}`);
                setWorkouts(prev => prev.filter(workout => workout.id !== id));
            } catch (error) {
                Alert.alert('Error', `Failed to delete workout with id ${id}`);
            }
        }
        setSelectedForDeletion([]);
        setEditMode(false);
    };

    const handleEditWorkout = (workout: Workout) => {
        navigation.navigate('EditWorkout', { workout });
    };

    const handleOpenWorkout = (workout: Workout) => {
        navigation.navigate('WorkoutDetail', { workout });
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading workouts...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerText}>
                Your workouts – start by pressing a workout to begin.
            </Text>
            <View style={styles.editHeader}>
                <Button title={editMode ? 'Cancel Edit' : 'Edit'} onPress={toggleEditMode} />
                {editMode && selectedForDeletion.length > 0 && (
                    <Button title="Delete" onPress={handleDeleteWorkouts} color="#ff5c5c" />
                )}
            </View>
            <View style={styles.workoutList}>
                {workouts.map((workout) => {
                    const isSelected = selectedForDeletion.includes(workout.id);
                    return (
                        <TouchableOpacity
                            key={workout.id}
                            style={[
                                styles.workoutItem,
                                editMode && isSelected && styles.workoutItemSelected,
                            ]}
                            onPress={() => {
                                if (editMode) {
                                    toggleSelection(workout.id);
                                } else {
                                    handleOpenWorkout(workout);
                                }
                            }}
                            onLongPress={() => {
                                if (!editMode) {
                                    handleEditWorkout(workout);
                                }
                            }}
                        >
                            <Text style={styles.workoutText}>
                                {`Workout: ${workout.workoutName}`}
                            </Text>
                            {editMode && isSelected && (
                                <Text style={styles.checkbox}>✓</Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
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
    headerText: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    editHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    workoutList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    workoutItem: {
        backgroundColor: '#eee',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginRight: 10,
        marginBottom: 10,
        minWidth: '45%',
        alignItems: 'center',
    },
    workoutItemSelected: {
        backgroundColor: '#007bff',
    },
    workoutText: {
        fontSize: 16,
        color: '#000',
    },
    checkbox: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#fff',
        color: '#007bff',
        borderRadius: 10,
        paddingHorizontal: 4,
        paddingVertical: 2,
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default WorkoutList;

