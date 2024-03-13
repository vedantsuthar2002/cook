import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../Tab/ProfileScreen';
import ManageProfile from '../other/ManageProfile';
const Stack = createStackNavigator();

const ProNavScreen: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="ManageProfile" component={ManageProfile} />
        </Stack.Navigator>
    );
};

export default ProNavScreen;