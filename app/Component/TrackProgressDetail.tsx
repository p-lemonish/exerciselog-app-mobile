import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RootStackParamList } from '../Navigator';

type TrackProgressDetailProps = NativeStackScreenProps<RootStackParamList, 'TrackProgressDetail'>;

const TrackProgressDetail: React.FC<TrackProgressDetailProps> = ({ route }) => {
    const { log, date } = route.params;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{log.exerciseName}</Text>
            {date && <Text style={styles.date}>{date}</Text>}

            {log.setLogDtoList.map((set) => (
                <View key={set.setNumber} style={styles.setRow}>
                    <Text style={styles.setText}>
                        {`Set ${set.setNumber}: ${set.reps} reps, ${set.weight} kg`}
                    </Text>
                </View>
            ))}

            <Text style={styles.notesHeader}>Exercise Notes:</Text>
            {log.notes ? (
                <Text style={styles.notes}>{log.notes}</Text>
            ) : (
                <Text style={styles.notes}>No notes provided.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    date: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    setRow: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    setText: {
        fontSize: 18,
    },
    notesHeader: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 5,
    },
    notes: {
        fontSize: 16,
        lineHeight: 22,
    },
});

export default TrackProgressDetail;
