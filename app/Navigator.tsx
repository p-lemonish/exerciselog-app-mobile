import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './Auth/LoginScreen';
import RegisterScreen from './Auth/RegisterScreen';
import { HomeScreen } from './HomeScreen';
import CreateExercise from './Component/CreateExercise';
import PlanWorkout from './Component/PlanWorkout';
import TrackWorkout from './Component/TrackWorkout';
import Profile from './Component/Profile';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    CreateExercise: undefined;
    PlanWorkout: undefined;
    TrackWorkout: undefined;
    Profile: undefined;
};

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
                options={{ title: 'CreateExercise' }}
            />
            <Stack.Screen
                name="PlanWorkout"
                component={PlanWorkout}
                options={{ title: 'PlanWorkout' }}
            />
            <Stack.Screen
                name="TrackWorkout"
                component={TrackWorkout}
                options={{ title: 'TrackWorkout' }}
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

