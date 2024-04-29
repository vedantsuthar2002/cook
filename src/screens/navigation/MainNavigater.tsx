import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import TabNavigatorScreen from './TabNavigatorScreen';
import SignNavigation from './SignNavigation';
import SplashScreen from '../AuthScreens/SplashScreen';
import RecipeDetailsScreen from '../Tab/RecipeDetailsScreen';

const Stack = createStackNavigator();
const MainNavigater = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name='SplashScreen' component={SplashScreen} options={{ animationEnabled: true, gestureEnabled: true }} />
                <Stack.Screen name='signNavigation' component={SignNavigation} options={{ animationEnabled: true, gestureEnabled: true }} />
                <Stack.Screen name='tab' component={TabNavigatorScreen} options={{ animationEnabled: true, gestureEnabled: true }} />
                <Stack.Screen name='RecipeDetails' component={RecipeDetailsScreen} options={{ animationEnabled: true, gestureEnabled: true }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigater;