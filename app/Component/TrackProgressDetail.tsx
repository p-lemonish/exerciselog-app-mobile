import React from 'react';
import { ScrollView, Text } from 'react-native';
import { RootStackParamList } from '../Navigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MyDarkTheme } from '../theme';

type TrackProgressDetailProps = NativeStackScreenProps<RootStackParamList, 'TrackProgressDetail'>;

const TrackProgressDetail: React.FC<TrackProgressDetailProps> = ({ route }) => {
    const { log, date } = route.params;

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
                    fontSize: 26,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    textAlign: 'center',
                    color: MyDarkTheme.colors.text,
                }}
            >
                {log.exerciseName}
            </Text>
            {date && (
                <Text
                    style={{
                        fontSize: 16,
                        textAlign: 'center',
                        marginBottom: 20,
                        color: MyDarkTheme.colors.text,
                    }}
                >
                    {date}
                </Text>
            )}

            {log.setLogDtoList.map((set: any) => (
                <Text
                    key={set.setNumber}
                    style={{
                        paddingVertical: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: '#ccc',
                        fontSize: 18,
                        color: MyDarkTheme.colors.text,
                    }}
                >
                    {`Set ${set.setNumber}: ${set.reps} reps, ${set.weight} kg`}
                </Text>
            ))}

            <Text
                style={{
                    fontSize: 20,
                    fontWeight: '600',
                    marginTop: 20,
                    marginBottom: 5,
                    color: MyDarkTheme.colors.text,
                }}
            >
                Exercise Notes:
            </Text>
            <Text
                style={{
                    fontSize: 16,
                    lineHeight: 22,
                    color: MyDarkTheme.colors.text,
                }}
            >
                {log.notes || 'No notes provided.'}
            </Text>
        </ScrollView>
    );
};

export default TrackProgressDetail;

