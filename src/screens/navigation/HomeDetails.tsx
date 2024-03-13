import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Tab/HomeScreen';
const Stack = createStackNavigator();

const HomeDetailsScreen: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" component={HomeScreen} />
        </Stack.Navigator>
    );
};

export default HomeDetailsScreen;