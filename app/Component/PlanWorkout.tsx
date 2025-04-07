import React, { useEffect, useState } from 'react';
import { View, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import api from '../Service/api';

interface Exercise {
    id: number;
    exerciseName: string;
    plannedSets: number;
    plannedReps: number;
    plannedWeight: number;
    notes: string;
}

interface WorkoutDto {
    workoutName: string;
    workoutNotes: string;
    selectedExerciseIds: number[];
}

const PlanWorkout = ({ navigation }: any) => {
    const theme = useTheme();
    const [workoutName, setWorkoutName] = useState('');
    const [workoutNotes, setWorkoutNotes] = useState('');
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);
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

    const handleSaveWorkout = async () => {
        if (!workoutName.trim()) {
            Alert.alert('Validation', 'Workout must have a name.');
            return;
        }
        if (selectedExerciseIds.length === 0) {
            Alert.alert('Validation', 'Select at least one exercise.');
            return;
        }

        const payload: WorkoutDto = {
            workoutName,
            workoutNotes,
            selectedExerciseIds,
        };

        try {
            await api.post('/workouts', payload);
            Alert.alert('Success', 'Workout saved successfully.');
            setWorkoutName('');
            setWorkoutNotes('');
            setSelectedExerciseIds([]);
            if (navigation) {
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save workout.');
        }
    };

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.colors.background,
                }}
            >
                <Text style={{ color: theme.colors.onBackground }}>Loading planned exercises...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 20,
                backgroundColor: theme.colors.background,
                flexGrow: 1,
            }}
        >
            <Text
                style={{
                    fontSize: 26,
                    fontWeight: 'bold',
                    marginBottom: 20,
                    color: theme.colors.onBackground,
                    textAlign: 'center',
                }}
            >
                Plan Your Workout
            </Text>

            <Text style={{ fontSize: 18, marginVertical: 10, color: theme.colors.onBackground }}>
                Workout Name
            </Text>
            <TextInput
                placeholder="Enter workout name"
                value={workoutName}
                onChangeText={setWorkoutName}
                mode="outlined"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <Text style={{ fontSize: 18, marginVertical: 10, color: theme.colors.onBackground }}>
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

            <Text style={{ fontSize: 18, marginVertical: 10, color: theme.colors.onBackground }}>
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
                            <Text style={{ color: theme.colors.onBackground }}>
                                {`${ex.exerciseName} ${ex.plannedWeight}kg @ ${ex.plannedSets}x${ex.plannedReps}`}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Updated Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                <Button mode="contained" onPress={handleSaveWorkout}
                    textColor={theme.colors.onSurface}
                >
                    Save Workout
                </Button>
                <Button mode="contained" buttonColor="#ff5c5c" onPress={() => navigation.goBack()}
                    textColor={theme.colors.onSurface}
                >
                    Cancel
                </Button>
            </View>
        </ScrollView>
    );
};

export default PlanWorkout;

