import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, StatusBar, TouchableOpacity, BackHandler, ToastAndroid, TouchableWithoutFeedback } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import apiService from '../../API/apiService';
import Emoji from 'react-native-emoji';

interface RecipeDetailsProps {
    route: {
        params: {
            idMeal: string;
        };
    };
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ route, navigation }) => {
    const { idMeal } = route.params;
    const [recipeDetails, setRecipeDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const scrollViewRef = useRef<ScrollView>(null);
    const [scrollPosition, setScrollPosition] = useState<number>(0);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [longPressPopupVisible, setLongPressPopupVisible] = useState<boolean>(false);
    const [longPressPopupText, setLongPressPopupText] = useState<string>('');

    useEffect(() => {
        SQLite.openDatabase({ name: 'RecipesDB' }, () => { }, error => {
            console.error('Error opening database:', error);
        });
    }, []);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                setLoading(true);
                const response = await apiService.lookupMealById(idMeal);
                const details = response.meals ? response.meals[0] : null;
                setRecipeDetails(details);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching recipe details:', error);
                setLoading(false);
            }
        };

        fetchRecipeDetails();
    }, [idMeal]);

    const checkIfBookmarked = async () => {
        try {
            const db = await SQLite.openDatabase({ name: 'RecipesDB' });
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM FavoriteRecipes WHERE recipeId = ?',
                    [idMeal],
                    (_, { rows }) => {
                        setIsBookmarked(rows.length > 0);
                    },
                    error => console.error('Error executing SQL:', error)
                );
            });
        } catch (error) {
            console.error('Error opening database:', error);
        }
    };

    useEffect(() => {
        checkIfBookmarked();
    }, []);

    const handleScroll = (event: any) => {
        const { y } = event.nativeEvent.contentOffset;
        setScrollPosition(y);
    };

    const handleBookmarkToggle = async () => {
        try {
            const db = await SQLite.openDatabase({ name: 'RecipesDB' });
            db.transaction(tx => {
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS FavoriteRecipes (id INTEGER PRIMARY KEY NOT NULL, recipeId TEXT, recipeName TEXT, imageUrl TEXT)',
                    [],
                    () => {
                        if (isBookmarked) {
                            tx.executeSql('DELETE FROM FavoriteRecipes WHERE recipeId = ?', [idMeal]);
                            ToastAndroid.show('Recipe deleted!', ToastAndroid.SHORT);
                        } else {
                            tx.executeSql(
                                'INSERT INTO FavoriteRecipes (recipeId, recipeName, imageUrl) VALUES (?, ?, ?)',
                                [idMeal, recipeDetails.strMeal, recipeDetails.strMealThumb]
                            );
                            ToastAndroid.show('Recipe saved!', ToastAndroid.SHORT);
                        }
                    },
                    error => console.error('Error executing SQL:', error)
                );
            });
            setIsBookmarked(prevState => !prevState);
        } catch (error) {
            console.error('Error opening database:', error);
        }
    };

    const handleRecipeNameLongPress = () => {
        setLongPressPopupText(recipeDetails.strMeal);
        setLongPressPopupVisible(true);
        setTimeout(() => {
            setLongPressPopupVisible(false);
        }, 3000);
    };

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor={scrollPosition >= 350 ? '#FFFFFF' : 'transparent'}
                barStyle={'dark-content'}
            />
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FB9400" />
                </View>
            ) : !recipeDetails ? (
                <View style={styles.errorContainer}>
                    <Text>Error fetching recipe details. Please try again later.</Text>
                </View>
            ) : (
                <>
                    <ScrollView
                        ref={scrollViewRef}
                        showsVerticalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        <Image source={{ uri: recipeDetails.strMealThumb }} style={styles.recipeImage} />
                        <View style={styles.recipe}>
                            <View style={styles.saveName}>
                                <TouchableWithoutFeedback onLongPress={handleRecipeNameLongPress}>
                                    <Text numberOfLines={2} style={styles.recipeName}>{recipeDetails.strMeal}</Text>
                                </TouchableWithoutFeedback>
                                <Text style={styles.star}>
                                    <Emoji name='star' style={styles.starIcon} /> (4.5)
                                </Text>
                            </View>
                            <Text style={styles.title}>Category: </Text>
                            <Text style={styles.category}>{recipeDetails.strCategory}</Text>
                            <Text style={styles.title}>Instruction: </Text>
                            <Text style={styles.instructions}>{recipeDetails.strInstructions}</Text>
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={styles.touchableImageContainer} onPress={handleBookmarkToggle}>
                        <Image
                            source={require('../../assets/nav/Bookmark.png')}
                            style={[styles.touchableImage, { tintColor: isBookmarked ? '#FB9400' : '#666' }]}
                        />
                    </TouchableOpacity>
                    {longPressPopupVisible && (
                        <View style={styles.longPressPopup}>
                            <Text>{longPressPopupText}</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Image source={require('../../assets/nav/arrow-left.png')} />
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipeImage: {
        flex: 0.5,
        width: '100%',
        height: 350,
        marginBottom: 10,
    },
    recipe: {
        padding: 24,
    },
    recipeName: {
        width: '80%',
        fontSize: 18,
        lineHeight: 22,
        color: '#0F172A',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    title: {
        color: '#0F172A',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
        marginVertical: 10,
    },
    category: {
        fontSize: 14,
        marginBottom: 10,
        color: '#64748B',
        fontWeight: '400',
    },
    instructions: {
        justifyContent: 'center',
        fontSize: 14,
        color: '#64748B',
        fontWeight: '400',
    },
    touchableImageContainer: {
        position: 'absolute',
        top: 45,
        right: 20,
        zIndex: 10,
        backgroundColor: '#FFF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchableImage: {
        resizeMode: 'contain',
    },
    saveName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15
    },
    star: {
        width: "20%",
        fontSize: 14,
    },
    starIcon: {
        marginRight: 20,
    },
    backButton: {
        position: 'absolute',
        top: 45,
        left: 20,
        zIndex: 10,
        backgroundColor: '#FFF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 25,
    },
    longPressPopup: {
        position: 'absolute',
        top: '50%',
        left: '15%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 5,
        elevation: 5,
        fontSize: 18,
        lineHeight: 22,
        color: '#0F172A',
        fontWeight: 'bold',
    },
});

export default RecipeDetails;
