
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../Service/api';
import { Text, useTheme } from 'react-native-paper';

interface SetResult {
    setNumber: number;
    reps: number;
    weight: number;
    completed: boolean;
}

interface ExerciseLog {
    exerciseId: number;
    exerciseName: string;
    setLogDtoList: SetResult[];
    exerciseNotes: string;
    date: string;
}

interface ExerciseLogSummary {
    id: number;
    date: string;
    exerciseName: string;
    repsSummary: string;
    weightSummary: string;
    notes: string;
    fullLog: ExerciseLog;
}

const TrackProgress = ({ navigation }: any) => {
    const [logSummaries, setLogSummaries] = useState<ExerciseLogSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/logs');
                const logs: ExerciseLog[] = response.data;

                const summaries: ExerciseLogSummary[] = logs.map((log) => {
                    const sortedSets = [...log.setLogDtoList].sort((a, b) => a.setNumber - b.setNumber);
                    const repsSummary = sortedSets.map((s) => s.reps).join('/');
                    const weightSummary =
                        sortedSets.length > 0 ? Math.max(...sortedSets.map((s) => s.weight)).toString() : '';

                    return {
                        id: log.exerciseId,
                        date: log.date,
                        exerciseName: log.exerciseName,
                        repsSummary,
                        weightSummary,
                        notes: log.exerciseNotes,
                        fullLog: log,
                    };
                });
                setLogSummaries(summaries);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch progress logs.');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const renderItem = ({ item }: { item: ExerciseLogSummary; }) => (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                paddingVertical: 10,
                borderBottomWidth: 1,
            }}
            onPress={() => navigation.navigate('TrackProgressDetail', { log: item.fullLog })}
        >
            <Text
                style={{ flex: 1 }}
            >
                {item.date}
            </Text>
            <Text
                style={{ flex: 2 }}
            >
                {item.exerciseName}
            </Text>
            <Text
                style={{ flex: 1, textAlign: 'center' }}
            >
                {item.repsSummary}
            </Text>
            <Text
                style={{ flex: 1, textAlign: 'center' }}
            >
                {item.weightSummary}
            </Text>
        </TouchableOpacity>
    );

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
                <Text >Loading progress logs...</Text>
            </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                padding: 10,
                backgroundColor: theme.colors.background,
            }}
        >
            <Text
                style={{
                    fontSize: 20,
                    marginBottom: 10,
                    textAlign: 'center',
                }}
            >
                Your Exercise Logs – press an entry for more details.
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                    paddingVertical: 5,
                }}
            >
                <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 16 }}>
                    Date
                </Text>
                <Text style={{ flex: 2, fontWeight: 'bold', fontSize: 16 }}>
                    Exercise
                </Text>
                <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                    Reps
                </Text>
                <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                    Max Weight
                </Text>
            </View>
            <FlatList
                data={logSummaries}
                keyExtractor={(item, index) => item.id.toString() + '-' + index.toString()}
                renderItem={renderItem}
                ListEmptyComponent={
                    <Text >No progress logs found.</Text>
                }
            />
        </View>
    );
};

export default TrackProgress;

