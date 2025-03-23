import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import api from '../Service/api';

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

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/logs');
                const logs: ExerciseLog[] = response.data;

                const summaries: ExerciseLogSummary[] = logs.map((log) => {
                    const sortedSets = [...log.setLogDtoList].sort((a, b) => a.setNumber - b.setNumber);
                    const repsSummary = sortedSets.map((s) => s.reps).join('/');
                    const weightSummary = sortedSets.length > 0
                        ? Math.max(...sortedSets.map((s) => s.weight)).toString()
                        : '';

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
            style={styles.row}
            onPress={() =>
                navigation.navigate('TrackProgressDetail', { log: item.fullLog })
            }
        >
            <Text style={[styles.cell, styles.dateCell]}>{item.date}</Text>
            <Text style={[styles.cell, styles.nameCell]}>{item.exerciseName}</Text>
            <Text style={[styles.cell, styles.repsCell]}>{item.repsSummary}</Text>
            <Text style={[styles.cell, styles.weightCell]}>{item.weightSummary}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading progress logs...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                Your Exercise Logs – press an entry for more details.
            </Text>
            <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.dateCell]}>Date</Text>
                <Text style={[styles.headerCell, styles.nameCell]}>Exercise</Text>
                <Text style={[styles.headerCell, styles.repsCell]}>Reps</Text>
                <Text style={[styles.headerCell, styles.weightCell]}>Max Weight</Text>
            </View>
            <FlatList
                data={logSummaries}
                keyExtractor={(item, index) => item.id.toString() + '-' + index.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text>No progress logs found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 5,
    },
    headerCell: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    dateCell: {
        flex: 1,
    },
    nameCell: {
        flex: 2,
    },
    repsCell: {
        flex: 1,
        textAlign: 'center',
    },
    weightCell: {
        flex: 1,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cell: {
        flex: 1,
        fontSize: 14,
    },
});

export default TrackProgress;

