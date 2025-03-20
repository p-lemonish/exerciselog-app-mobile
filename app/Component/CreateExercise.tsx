import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Button,
    Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import api from '../Service/api';
import { AuthContext } from '../Auth/AuthContext';

interface Exercise {
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
    const [exercise, setExercise] = useState<Exercise>({
        exerciseName: '',
        plannedSets: 3,
        plannedReps: 5,
        plannedWeight: 0,
        notes: '',
    });

    const [userExercises, setUserExercises] = useState<{ exerciseName: string; }[]>([]);
    const [exerciseNames, setExerciseNames] = useState<string[]>([]);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const getUserExercises = async () => {
            try {
                const response = await api.get('/planned');
                const uniqueNames: string[] = Array.from(
                    new Set(
                        response.data
                            .map((exercise: any) => exercise.exerciseName)
                            .filter((name: string) => name != null)
                    ),
                );
                setExerciseNames(uniqueNames);

                console.log(response);
                const userExerciseNames = response.data.map((exercise: any) => {
                    exercise.exerciseName;
                });
                console.log(userExerciseNames);
                setUserExercises(userExerciseNames);
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

    const exerciseOptions = [
        ...new Set(
            [...exerciseNames, ...commonExercises]
                .map((name) => name)
                .filter((name) => name != null)
        ),
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Exercise</Text>

            <Text style={styles.label}>Exercise Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter exercise name"
                value={exercise.exerciseName}
                onChangeText={(text) => updateExercise('exerciseName', text)}
            />

            <Text style={styles.subTitle}>Or choose from your exercises & common ones:</Text>
            <View style={styles.blobContainer}>
                {exerciseOptions.map((name) => (
                    <TouchableOpacity
                        key={name}
                        style={[
                            styles.blob,
                            exercise.exerciseName === name && styles.blobSelected,
                        ]}
                        onPress={() => updateExercise('exerciseName', name)}
                    >
                        <Text
                            style={[
                                styles.blobText,
                                exercise.exerciseName === name && styles.blobTextSelected,
                            ]}
                        >
                            {name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Planned Sets: {exercise.plannedSets}</Text>
            <Slider
                style={styles.slider}
                minimumValue={3}
                maximumValue={6}
                step={1}
                value={exercise.plannedSets}
                onValueChange={(value) => updateExercise('plannedSets', value)}
            />
            <View style={styles.adjustContainer}>
                <Button
                    title="-"
                    onPress={() =>
                        updateExercise(
                            'plannedSets',
                            Math.max(0, exercise.plannedSets - 1)
                        )
                    }
                />
                <Button
                    title="+"
                    onPress={() =>
                        updateExercise(
                            'plannedSets',
                            exercise.plannedSets + 1
                        )
                    }
                />
            </View>

            <Text style={styles.label}>Planned Reps: {exercise.plannedReps}</Text>
            <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={30}
                step={1}
                value={exercise.plannedReps}
                onValueChange={(value) => updateExercise('plannedReps', value)}
            />
            <View style={styles.adjustContainer}>
                <Button
                    title="-5"
                    onPress={() =>
                        updateExercise(
                            'plannedReps',
                            Math.max(0, exercise.plannedReps - 5)
                        )
                    }
                />
                <Button
                    title="-"
                    onPress={() =>
                        updateExercise(
                            'plannedReps',
                            Math.max(0, exercise.plannedReps - 1)
                        )
                    }
                />
                <Button
                    title="+"
                    onPress={() =>
                        updateExercise(
                            'plannedReps',
                            exercise.plannedReps + 1
                        )
                    }
                />
                <Button
                    title="+5"
                    onPress={() =>
                        updateExercise(
                            'plannedReps',
                            exercise.plannedReps + 5
                        )
                    }
                />
            </View>

            <Text style={styles.label}>Planned Weight: {exercise.plannedWeight} kg</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={exercise.plannedWeight}
                onValueChange={(value) => updateExercise('plannedWeight', value)}
            />
            <View style={styles.adjustContainer}>
                <Button
                    title="-20"
                    onPress={() =>
                        updateExercise(
                            'plannedWeight',
                            Math.max(0, exercise.plannedWeight - 20)
                        )
                    }
                />
                <Button
                    title="-5"
                    onPress={() =>
                        updateExercise(
                            'plannedWeight',
                            Math.max(0, exercise.plannedWeight - 5)
                        )
                    }
                />
                <Button
                    title="-0.5"
                    onPress={() =>
                        updateExercise(
                            'plannedWeight',
                            Math.max(0, exercise.plannedWeight - 0.5)
                        )
                    }
                />
                <Button
                    title="+0.5"
                    onPress={() =>
                        updateExercise(
                            'plannedWeight',
                            exercise.plannedWeight + 0.5
                        )
                    }
                />
                <Button
                    title="+5"
                    onPress={() =>
                        updateExercise(
                            'plannedWeight',
                            exercise.plannedWeight + 5
                        )
                    }
                />
                <Button
                    title="+20"
                    onPress={() =>
                        updateExercise(
                            'plannedWeight',
                            exercise.plannedWeight + 20
                        )
                    }
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Save" onPress={handleSave} />
                <Button title="Cancel" onPress={handleCancel} color="#ff5c5c" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
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
    subTitle: {
        fontSize: 16,
        marginVertical: 10,
    },
    blobContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    blob: {
        backgroundColor: '#eee',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    blobSelected: {
        backgroundColor: '#007bff',
    },
    blobText: {
        color: '#000',
    },
    blobTextSelected: {
        color: '#fff',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    adjustContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
});

export default CreateExercise;

