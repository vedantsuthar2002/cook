import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigatorScreen from './TabNavigatorScreen';
import MainNavigater from './MainNavigater';

const Stack = createStackNavigator();

const SignTab: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainNavigater" component={MainNavigater} />
            <Stack.Screen name="Tab" component={TabNavigatorScreen} />
        </Stack.Navigator>
    );
};

export default SignTab;
