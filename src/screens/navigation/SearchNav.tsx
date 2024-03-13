import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../Tab/SearchScreen';
const Stack = createStackNavigator();

const SearchNav: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="search" component={SearchScreen} />
        </Stack.Navigator>
    );
};

export default SearchNav;