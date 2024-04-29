// SaveScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TextInput, StatusBar, TouchableOpacity } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Emoji from 'react-native-emoji';

const SaveScreen: React.FC = () => {
    const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const navigation = useNavigation();

    const fetchFavoriteRecipes = async () => {
        try {
            const db = await SQLite.openDatabase({ name: 'RecipesDB' });
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM FavoriteRecipes WHERE recipeName LIKE ?',
                    [`%${searchTerm}%`],
                    (_, { rows }) => {
                        const recipes: any[] = [];
                        for (let i = 0; i < rows.length; i++) {
                            recipes.push(rows.item(i));
                        }
                        setFavoriteRecipes(recipes);
                    },
                    error => console.error('Error executing SQL:', error)
                );
            });
        } catch (error) {
            console.error('Error opening database:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchFavoriteRecipes();
        }, [searchTerm])
    );

    const handleRecipePress = (recipeId: string) => {
        // Navigate to RecipeDetails screen with recipeId as a parameter
        navigation.navigate('RecipeDetails', { idMeal: recipeId });
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={'dark-content'}
            />
            <Text style={styles.header}>Recipe saved</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search saved recipes"
                value={searchTerm}
                onChangeText={setSearchTerm}
            />
            {favoriteRecipes.length === 0 ? (
                <Text>No favorite recipes found.</Text>
            ) : (
                <ScrollView contentContainerStyle={styles.filteredRecipesContainer} showsVerticalScrollIndicator={false}>
                    {favoriteRecipes.map((recipe, index) => (
                        <TouchableOpacity key={recipe.recipeId} style={[styles.recipeItem, styles.shadowprop, index % 2 !== 0 && { marginLeft: 10 }]} onPress={() => handleRecipePress(recipe.recipeId)}>
                            <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
                            <Text numberOfLines={2} style={styles.recipeName}>{recipe.recipeName}</Text>
                            <View style={styles.saveName}>
                                <Text style={styles.star}>
                                    <Emoji name='star' style={styles.starIcon} /> (4.5)
                                </Text>
                                <Text style={styles.star}>
                                    <Emoji name='clock330' style={styles.starIcon} /> 30 min
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingRight: 15,
        paddingTop: 15,
        paddingLeft: 15,
        backgroundColor: '#FFF',
    },
    header: {
        color: '#0F172A',
        fontSize: 18,
        fontWeight: '600',
        paddingVertical: 10,
        paddingLeft: 5,
    },
    searchInput: {
        backgroundColor: '#F3F4F6',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    filteredRecipesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        marginTop: 10,
    },
    recipeItem: {
        borderRadius: 10,
        width: '48%',
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    shadowprop: {
        shadowColor: '#000',
        elevation: 3,
    },
    recipeImage: {
        width: '95%',
        aspectRatio: 3 / 4,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        left: 3,
        top: 3,
        marginBottom: 10,
    },
    recipeName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        paddingLeft: 5,
        marginBottom: 10,
    },
    saveName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 5,
        marginBottom: 15
    },
    star: {
        fontSize: 12
    },
    starIcon: {
        marginRight: 20,
    },

});

export default SaveScreen;
