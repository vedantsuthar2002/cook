import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import TabNavigatorScreen from './TabNavigatorScreen';
import SignNavigation from './SignNavigation';
import SplashScreen from '../AuthScreens/SplashScreen';

const Stack = createStackNavigator();
const MainNavigater = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name='SplashScreen' component={SplashScreen} />
                <Stack.Screen name='signNavigation' component={SignNavigation} />
                <Stack.Screen name='tab' component={TabNavigatorScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigater;