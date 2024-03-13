import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';

interface Recipe {
    dishName: string;
    description: string;
    portion: number;
    time: string;
    id: string;
}

const SaveScreen: React.FC = () => {
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        return () => {
            fetchSavedRecipes();
        };
    }, []);

    const fetchSavedRecipes = async () => {
        try {
            const savedRecipesSnapshot = await firestore().collection('SavedRecipes').get();
            const savedRecipesData = savedRecipesSnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            })) as Recipe[];

            setSavedRecipes(savedRecipesData);
        } catch (error) {
            console.error('Error fetching saved recipes:', error);
        }
    };

    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <View style={styles.recipeItem}>
            <Text style={styles.recipeTitle}>{item.dishName}</Text>
            <Text style={styles.recipeDescription}>{item.description}</Text>
            <Text style={styles.recipeDetails}>Portion: {item.portion}</Text>
            <Text style={styles.recipeDetails}>Cooking Time: {item.time} minutes</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={savedRecipes}
                renderItem={renderRecipeItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    recipeItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        paddingBottom: 10,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    recipeDescription: {
        fontSize: 16,
    },
    recipeDetails: {
        fontSize: 14,
        color: '#666666',
    },
});

export default SaveScreen;
