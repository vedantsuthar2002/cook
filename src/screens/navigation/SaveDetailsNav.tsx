import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SaveScreen from '../Tab/SaveScreen';
const Stack = createStackNavigator();

const SearchNav: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="save" component={SaveScreen} />
        </Stack.Navigator>
    );
};

export default SearchNav;