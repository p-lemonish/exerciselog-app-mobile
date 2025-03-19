import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Button,
    Alert,
    ScrollView
} from 'react-native';
import api from '../Service/api';
import { AuthContext } from '../Auth/AuthContext';

const commonExerciseNames = [
    'Bicep Curl',
    'Bench Press',
    'Squat',
    'Deadlift',
    'Overhead Press'
];

const CreateExercise = ({ navigation }: any) => {
    const [exerciseName, setExerciseName] = useState('');
    const [userExercises, setUserExercises] = useState(['']);
    const [loading, setLoading] = useState(true);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const getUserExercises = async () => {
            try {
                const response = await api.get('/exercises');
                setUserExercises(response.data);
            } catch (error) {
                Alert.alert('Failed to fetch your exercise details.');
            } finally {
                setLoading(false);
            }
        };
        if (!authContext?.isLoading) {
            getUserExercises();
        }
        getUserExercises();
    }, []);

    const handleSave = () => {
        if (!exerciseName.trim()) {
            Alert.alert('Error', 'Please provide an exercise name.');
            return;
        }
        // Process the exercise saving logic here (e.g., send data to API)
        // TODO planned-exercise API
        // TODO add also users other exercises as blobs
        Alert.alert(
            'Exercise Saved',
            `Exercise "${exerciseName}" has been saved.`
        );
        setExerciseName('');
        if (navigation) {
            navigation.goBack();
        }
    };

    const handleCancel = () => {
        setExerciseName('');
        if (navigation) {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Exercise</Text>

            <Text style={styles.label}>Exercise Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter exercise name"
                value={exerciseName}
                onChangeText={setExerciseName}
            />
            <Text style={styles.subTitle}>Or choose from common exercises:</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.blobContainer}
            >
                {commonExerciseNames.map((name) => (
                    <TouchableOpacity
                        key={name}
                        style={[
                            styles.blob,
                            exerciseName === name && styles.blobSelected
                        ]}
                        onPress={() => setExerciseName(name)}
                    >
                        <Text
                            style={[
                                styles.blobText,
                                exerciseName === name && styles.blobTextSelected
                            ]}
                        >
                            {name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

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
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    },
    subTitle: {
        fontSize: 16,
        marginVertical: 10
    },
    blobContainer: {
        marginBottom: 20,
    },
    blob: {
        backgroundColor: '#eee',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    }
});

export default CreateExercise;

