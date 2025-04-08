import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, TextInput, useTheme } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import api from '../Service/api';
import { AuthContext } from '../Auth/AuthContext';

interface Exercise {
    id: number;
    exerciseName: string;
    plannedSets: number;
    plannedReps: number;
    plannedWeight: number;
    notes: string;
}

const commonExercises = [
    'Bicep Curl',
    'Bench Press',
    'Squat',
    'Deadlift',
    'Overhead Press',
];

const CreateExercise = ({ navigation }: any) => {
    const theme = useTheme();
    const [exercise, setExercise] = useState<Exercise>({
        id: 0,
        exerciseName: '',
        plannedSets: 3,
        plannedReps: 5,
        plannedWeight: 0,
        notes: '',
    });
    const [userExercises, setUserExercises] = useState<Exercise[]>([]);
    const [exerciseNames, setExerciseNames] = useState<string[]>([]);
    const [deletionMode, setDeletionMode] = useState(false);
    const [selectedForDeletion, setSelectedForDeletion] = useState<number[]>([]);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const getUserExercises = async () => {
            try {
                const response = await api.get('/planned');
                const exercises: Exercise[] = response.data;
                setUserExercises(exercises);
                const uniqueNames: string[] = Array.from(
                    new Set(
                        exercises
                            .map((exercise: any) => exercise.exerciseName)
                            .filter((name: string) => name != null)
                    )
                );
                setExerciseNames(uniqueNames);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch your existing exercises.');
            }
        };
        if (!authContext?.isLoading) {
            getUserExercises();
        }
    }, []);

    const handleSave = async () => {
        if (!exercise.exerciseName.trim()) {
            Alert.alert('Error', 'Please provide an exercise name.');
            return;
        }
        try {
            await api.post('/planned', exercise);
            Alert.alert(
                'Exercise Saved',
                `Exercise "${exercise.exerciseName}" with ${exercise.plannedSets} sets, ${exercise.plannedReps} reps at ${exercise.plannedWeight}kg has been saved.`
            );
            setExercise({
                id: 0,
                exerciseName: '',
                plannedSets: 3,
                plannedReps: 5,
                plannedWeight: 0,
                notes: '',
            });
            if (navigation) {
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save exercise.');
        }
    };

    const handleCancel = () => {
        if (navigation) {
            navigation.goBack();
        }
    };

    const updateExercise = (field: keyof Exercise, value: any) => {
        setExercise((prev) => ({ ...prev, [field]: value }));
    };

    const toggleDeletionMode = () => {
        setDeletionMode((prev) => !prev);
        setSelectedForDeletion([]);
    };

    const toggleSelection = (id: number) => {
        if (selectedForDeletion.includes(id)) {
            setSelectedForDeletion(selectedForDeletion.filter((x) => x !== id));
        } else {
            setSelectedForDeletion([...selectedForDeletion, id]);
        }
    };

    const handleDeleteSome = async () => {
        for (const id of selectedForDeletion) {
            try {
                await api.delete(`/planned/${id}`);
                setUserExercises((prev) => prev.filter((ex) => ex.id !== id));
            } catch (error) {
                Alert.alert('Error', `Failed to delete exercise with id ${id}`);
            }
        }
        setExerciseNames(
            userExercises
                .filter((ex) => !selectedForDeletion.includes(ex.id))
                .map((ex) => ex.exerciseName)
        );
        setSelectedForDeletion([]);
        setDeletionMode(false);
    };

    const exerciseOptions = [
        ...new Set([...exerciseNames, ...commonExercises].filter((name) => name != null)),
    ];

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 20,
                backgroundColor: theme.colors.background,
                flexGrow: 1,
            }}
        >
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Exercise Name
            </Text>
            <TextInput
                placeholder="Enter exercise name"
                value={exercise.exerciseName}
                onChangeText={(text) => updateExercise('exerciseName', text)}
                mode="outlined"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <Text style={{ fontSize: 16, marginVertical: 10 }}>
                Or choose from your exercises & common ones:
            </Text>

            {userExercises.length > 0 && (
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Button mode="contained" onPress={toggleDeletionMode}>
                            {deletionMode ? 'Cancel Edit' : 'Edit'}
                        </Button>
                        {deletionMode && selectedForDeletion.length > 0 && (
                            <Button mode="contained" onPress={handleDeleteSome}>
                                Delete
                            </Button>
                        )}
                    </View>

                    {deletionMode && (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
                            {userExercises.map((ex) => {
                                const isSelected = selectedForDeletion.includes(ex.id);
                                return (
                                    <TouchableOpacity
                                        key={ex.id}
                                        style={{
                                            backgroundColor: isSelected ? theme.colors.primary : theme.colors.secondary,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            borderRadius: 20,
                                            marginRight: 10,
                                            marginBottom: 10,
                                        }}
                                        onPress={() => toggleSelection(ex.id)}
                                    >
                                        <Text
                                        >
                                            {`${ex.exerciseName} ${ex.plannedSets}x${ex.plannedReps}@${ex.plannedWeight}kg`}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            )}

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
                {exerciseOptions.map((name) => {
                    const isSelected = exercise.exerciseName === name;
                    return (
                        <TouchableOpacity
                            key={name}
                            style={{
                                backgroundColor: isSelected ? theme.colors.primary : theme.colors.secondary,
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                borderRadius: 20,
                                marginRight: 10,
                                marginBottom: 10,
                            }}
                            onPress={() => updateExercise('exerciseName', name)}
                        >
                            <Text >
                                {name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <Text style={{ fontSize: 18, marginVertical: 10 }}>
                Planned Sets: {exercise.plannedSets}
            </Text>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={exercise.plannedSets}
                thumbTintColor={theme.colors.primary}
                minimumTrackTintColor={theme.colors.primary}
                onValueChange={(value) => updateExercise('plannedSets', value)}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                <Button mode="contained" onPress={() =>
                    updateExercise('plannedSets', Math.max(1, exercise.plannedSets - 1))
                }
                >
                    -1
                </Button>
                <Button mode="contained" onPress={() =>
                    updateExercise('plannedSets', exercise.plannedSets + 1)
                }
                >
                    +1
                </Button>
            </View>

            <Text style={{ fontSize: 18, marginVertical: 10 }}>
                Planned Reps: {exercise.plannedReps}
            </Text>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={30}
                step={1}
                value={exercise.plannedReps}
                thumbTintColor={theme.colors.primary}
                minimumTrackTintColor={theme.colors.primary}
                onValueChange={(value) => updateExercise('plannedReps', value)}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                <Button mode="contained" onPress={() =>
                    updateExercise('plannedReps', Math.max(1, exercise.plannedReps - 5))
                }
                >
                    -5
                </Button>
                <Button mode="contained" onPress={() =>
                    updateExercise('plannedReps', Math.max(1, exercise.plannedReps - 1))
                }
                >
                    -1
                </Button>
                <Button mode="contained" onPress={() =>
                    updateExercise('plannedReps', exercise.plannedReps + 1)
                }
                >
                    +1
                </Button>
                <Button mode="contained" onPress={() =>
                    updateExercise('plannedReps', exercise.plannedReps + 5)
                }
                >
                    +5
                </Button>
            </View>

            <Text style={{ fontSize: 18, marginVertical: 10 }}>
                Planned Weight: {exercise.plannedWeight} kg
            </Text>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={200}
                step={1}
                value={exercise.plannedWeight}
                thumbTintColor={theme.colors.primary}
                minimumTrackTintColor={theme.colors.primary}
                onValueChange={(value) => updateExercise('plannedWeight', value)}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                <Button mode="contained" onPress={() =>
                    updateExercise('plannedWeight', Math.max(0, exercise.plannedWeight - 0.5))
                }
                >
                    -0.5
                </Button>
                <Button mode="contained" onPress={() =>
                    updateExercise('plannedWeight', Math.max(0, exercise.plannedWeight - 5))
                }
                >
                    -5
                </Button>
                <Button mode="contained" onPress={() =>
                    updateExercise('plannedWeight', Math.max(0, exercise.plannedWeight - 20))
                }
                >
                    -20
                </Button>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Button mode="contained" onPress={() =>
                    updateExercise('plannedWeight', exercise.plannedWeight + 0.5)
                }
                >
                    +0.5
                </Button>
                <Button mode="contained" onPress={() =>
                    updateExercise('plannedWeight', exercise.plannedWeight + 5)
                }
                >
                    +5
                </Button>
                <Button mode="contained" onPress={() =>
                    updateExercise('plannedWeight', exercise.plannedWeight + 20)
                }
                >
                    +20
                </Button>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                <Button mode="contained" onPress={handleSave}
                >
                    Save
                </Button>
                <Button mode="contained" buttonColor="#ff5c5c" onPress={handleCancel}
                >
                    Cancel
                </Button>
            </View>
        </ScrollView>
    );
};

export default CreateExercise;

