// SignNavigation.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../AuthScreens/SignInScreen';
import SignUpScreen from '../AuthScreens/SignUpScreen';
import ForgotPasswordScreen from '../AuthScreens/ForgotPasswordScreen';
import NewPasswordScreen from '../AuthScreens/NewPasswordScreen';
import ConfirmEmailScreen from '../AuthScreens/ConfirmEmailScreen';

const Stack = createStackNavigator();

const SignNavigation: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='SignIn'>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
            <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
        </Stack.Navigator>
    );
};

export default SignNavigation;
