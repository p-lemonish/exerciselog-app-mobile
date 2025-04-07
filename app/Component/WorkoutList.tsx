import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import api from '../Service/api';
import { MyDarkTheme } from '../theme';

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
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: MyDarkTheme.colors.background,
                }}
            >
                <Text style={{ color: MyDarkTheme.colors.text }}>Loading workouts...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 20,
                backgroundColor: MyDarkTheme.colors.background,
                flexGrow: 1,
            }}
        >
            <Text
                style={{
                    fontSize: 20,
                    marginBottom: 10,
                    textAlign: 'center',
                    color: MyDarkTheme.colors.text,
                }}
            >
                Your workouts – start by pressing a workout to begin.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Button mode="contained" onPress={toggleEditMode}>
                    {editMode ? 'Cancel Edit' : 'Edit'}
                </Button>
                {editMode && selectedForDeletion.length > 0 && (
                    <Button mode="contained" buttonColor="#ff5c5c" onPress={handleDeleteWorkouts}>
                        Delete
                    </Button>
                )}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {workouts.map((workout) => {
                    const isSelected = selectedForDeletion.includes(workout.id);
                    return (
                        <TouchableOpacity
                            key={workout.id}
                            style={{
                                backgroundColor: editMode && isSelected ? MyDarkTheme.colors.primary : '#333',
                                paddingVertical: 10,
                                paddingHorizontal: 12,
                                borderRadius: 10,
                                marginRight: 10,
                                marginBottom: 10,
                                minWidth: '45%',
                                alignItems: 'center',
                            }}
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
                            <Text style={{ fontSize: 16, color: isSelected ? '#fff' : MyDarkTheme.colors.text }}>
                                {`Workout: ${workout.workoutName}`}
                            </Text>
                            {editMode && isSelected && (
                                <Text
                                    style={{
                                        position: 'absolute',
                                        top: 5,
                                        right: 5,
                                        backgroundColor: '#fff',
                                        color: MyDarkTheme.colors.primary,
                                        borderRadius: 10,
                                        paddingHorizontal: 4,
                                        paddingVertical: 2,
                                        fontWeight: 'bold',
                                        fontSize: 12,
                                    }}
                                >
                                    ✓
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
};

export default WorkoutList;

