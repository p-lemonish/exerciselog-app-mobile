import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './Auth/LoginScreen';
import RegisterScreen from './Auth/RegisterScreen';
import { HomeScreen } from './HomeScreen';
import CreateExercise from './Component/CreateExercise';
import PlanWorkout from './Component/PlanWorkout';
import WorkoutList from './Component/WorkoutList';
import TrackProgress from './Component/TrackProgress';
import Profile from './Component/Profile';
import EditWorkout from './Component/EditWorkout';
import WorkoutDetail from './Component/WorkoutDetail';
import StartWorkout from './Component/StartWorkout';
import TrackProgressDetail from './Component/TrackProgressDetail';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    CreateExercise: undefined;
    PlanWorkout: undefined;
    WorkoutList: undefined;
    EditWorkout: undefined;
    StartWorkout: undefined;
    WorkoutDetail: undefined;
    TrackProgress: undefined;
    TrackProgressDetail: {
        log: ExerciseLog;
        date: string;
    };
    Profile: undefined;
};

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
    notes: string;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'Login' }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: 'Register' }}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Home' }}
            />
            <Stack.Screen
                name="CreateExercise"
                component={CreateExercise}
                options={{ title: 'Create & Plan Your Exercise' }}
            />
            <Stack.Screen
                name="PlanWorkout"
                component={PlanWorkout}
                options={{ title: 'Plan Your Workout' }}
            />
            <Stack.Screen
                name="EditWorkout"
                component={EditWorkout}
                options={{ title: 'Editing Workout' }}
            />
            <Stack.Screen
                name="StartWorkout"
                component={StartWorkout}
                options={{ title: 'Working Out' }}
            />
            <Stack.Screen
                name="WorkoutDetail"
                component={WorkoutDetail}
                options={{ title: 'Workout Details' }}
            />
            <Stack.Screen
                name="WorkoutList"
                component={WorkoutList}
                options={{ title: 'Your Workouts' }}
            />
            <Stack.Screen
                name="TrackProgress"
                component={TrackProgress}
                options={{ title: 'Track Your Progress' }}
            />
            <Stack.Screen
                name="TrackProgressDetail"
                component={TrackProgressDetail}
                options={{ title: 'Details' }}
            />
            <Stack.Screen
                name="Profile"
                component={Profile}
                options={{ title: 'Profile' }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;

