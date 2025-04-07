import React from 'react';
import { View } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './Navigator';

export const HomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const theme = useTheme();

    return (
        <View
            style={{
                flex: 1,
                padding: 20,
                justifyContent: 'space-between',
                backgroundColor: theme.colors.background,
            }}
        >
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 24, marginBottom: 10, color: theme.colors.onBackground }}>
                    Welcome to the Home Screen!
                </Text>
            </View>

            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Button
                    mode="contained"
                    style={{ marginVertical: 10 }}
                    onPress={() => navigation.navigate('CreateExercise')}
                    textColor={theme.colors.onSurface}
                >
                    Create & Plan Exercises
                </Button>

                <Button
                    mode="contained"
                    style={{ marginVertical: 10 }}
                    onPress={() => navigation.navigate('PlanWorkout')}
                    textColor={theme.colors.onSurface}
                >
                    Plan Your Workout
                </Button>

                <Button
                    mode="contained"
                    style={{ marginVertical: 10 }}
                    onPress={() => navigation.navigate('WorkoutList')}
                    textColor={theme.colors.onSurface}
                >
                    Your Workouts
                </Button>

                <Button
                    mode="contained"
                    style={{ marginVertical: 10 }}
                    onPress={() => navigation.navigate('TrackProgress')}
                    textColor={theme.colors.onSurface}
                >
                    Track Workout Progress
                </Button>

                <Button
                    mode="contained"
                    style={{ marginVertical: 10 }}
                    onPress={() => navigation.navigate('Profile')}
                    textColor={theme.colors.onSurface}
                >
                    Profile
                </Button>
            </View>
        </View>
    );
};

export default HomeScreen;

