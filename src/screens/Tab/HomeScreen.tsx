import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { FlatList, Image, StatusBar, StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SaveScreen from './SaveScreen';

interface User {
    uid: string;
    name: string;
}

interface Recipe {
    dishName: string;
    description: string;
    portion: number;
    time: string;
    ingredients: string[];
    id: string;
}

const HomeScreen: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [userName, setUserName] = useState<string>('');
    const [greeting, setGreeting] = useState<string>('');
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState<boolean>(true);

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            retrieveUserRecipes();
        }
    }, [isFocused]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            setGreeting('Good Morning');
        } else if (hour >= 12 && hour < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }
    }, []);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (User) => {
            if (User) {
                const userId = User.uid;
                const userRef = firestore().collection('Users').doc(userId);
                const docSnapshot = await userRef.get();
                if (docSnapshot.exists) {
                    const userData = docSnapshot.data() as User;
                    setUserName(userData.name);
                }
            } else {
                setUserName('');
            }
        });
        return unsubscribe;
    }, []);

    const retrieveUserRecipes = async () => {
        try {
            setLoading(true); // Set loading state to true when starting data retrieval
            const user = auth().currentUser;
            if (!user) {
                console.error('User is not logged in. Cannot retrieve recipes.');
                return;
            }
            const userId = user.uid;
            const recipeSnapshot = await firestore().collection('Recipes').doc(userId).collection('recipes').get();
            const retrievedRecipes = recipeSnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            })) as Recipe[];

            setRecipes(retrievedRecipes);
            setLoading(false); // Update loading state to indicate data retrieval is complete
        } catch (error) {
            console.error('Error fetching user recipes:', error);
        }
    };

    const handleSaveRecipe = async (recipeId: string) => {
        try {
            const user = auth().currentUser;
            if (!user) {
                console.error('User is not logged in. Cannot save recipe.');
                return;
            }
            const userId = user.uid;
            const savedRecipeRef = firestore().collection('SavedRecipes').doc(userId).collection('saved').doc(recipeId);
            const savedRecipeSnapshot = await savedRecipeRef.get();
            if (savedRecipeSnapshot.exists) {
                // Recipe already saved, delete it
                await savedRecipeRef.delete();
            } else {
                // Recipe not saved, save it
                await savedRecipeRef.set({}); // You can store additional data if needed
            }
            // Refresh recipes after saving or deleting
            retrieveUserRecipes();
        } catch (error) {
            console.error('Error saving recipe:', error);
        }
    };

    const renderItem = ({ item }: { item: Recipe }) => (
        <TouchableOpacity style={styles.recipeItem}>
            <View style={styles.recipeText}>
                <Text style={styles.recipeTitle}>{item.dishName}</Text>
                <Text style={styles.recipeDetails}>Cooking Time: {item.time} minutes</Text>
            </View>
            <View style={styles.recipeSaveIcon}>
                <TouchableOpacity onPress={() => handleSaveRecipe(item.id)}>
                    <Image source={require('../../assets/nav/save.png')} style={styles.save} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <View style={styles.header}>
                <Image source={require('../../assets/images/user.png')} style={styles.userPhoto} />
                <View style={styles.greetingContainer}>
                    <Text style={styles.welcomeText}>Welcome, {userName}</Text>
                    <Text style={styles.greetingText}>{greeting}</Text>
                </View>
            </View>
            <TextInput placeholder='Type ingredients...' value={searchText}
                onChangeText={text => setSearchText(text)} placeholderTextColor='black' style={styles.TextInputContainer} />
            <FlatList
                data={recipes}
                renderItem={renderItem}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    userPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    greetingContainer: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000'
    },
    greetingText: {
        fontSize: 14,
        color: '#666666',
    },
    TextInputContainer: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'lightgray',
        padding: 10,
        marginBottom: 5,
    },
    recipeItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    recipeDetails: {
        fontSize: 14,
        color: '#666666',
    },
    saveIcon: {
        width: 20,
        height: 20,
    },
    recipeText: {
        flexDirection: 'column',
    },
    recipeSaveIcon: {
        marginRight: 10,
        position: 'relative'
    },
    save: {
        width: 25,
        height: 25
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
