import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { FlatList, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { StackActions, useNavigation, useIsFocused } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface User {
    uid: string;
    name: string;
    email: string;
    photoURL?: string;
}

interface Recipe {
    dishName: string;
    description: string;
    portion: number;
    time: string;
    ingredients: string[];
    id: string;
}

const ProfileScreen: React.FC = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [recipesCount, setRecipesCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            retrieveUserData();
        }
    }, [isFocused]);

    const retrieveUserData = async () => {
        try {
            setLoading(true); // Set loading state to true when starting data retrieval
            const user = auth().currentUser;
            if (!user) {
                console.error('User is not logged in. Cannot retrieve profile data.');
                return;
            }

            const userId = user.uid;
            const userRef = firestore().collection('Users').doc(userId);
            const docSnapshot = await userRef.get();

            if (docSnapshot.exists) {
                setUserData(docSnapshot.data() as User);
            }

            // Count user's recipes
            const recipesQuery = firestore()
                .collection('Recipes')
                .doc(userId)
                .collection('recipes');
            const recipeSnapshot = await recipesQuery.get();
            setRecipesCount(recipeSnapshot.size); // Get the number of documents
            setLoading(false); // Update loading state to indicate data retrieval is complete
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <View style={styles.header}>
                <Text style={styles.headerText}>Profile</Text>
                <TouchableOpacity>
                    <Image source={require('../../assets/images/Setting.png')} style={styles.userPhoto} />
                </TouchableOpacity>
            </View>
            {loading ? (
                <Text>Loading profile data...</Text>
            ) : (
                <>
                    <View style={styles.ProfileUpdate}>
                        <View style={styles.profileImageContainer}>
                            <View>
                                <Image source={require('../../assets/images/user.png')} style={styles.profileImage} />
                            </View>
                            <View style={styles.postcount}>
                                <Text style={styles.userRecipeCount}>{recipesCount}</Text>
                                <Text style={styles.userRecipeCount}>Recipes</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.usernamec}>
                        <Text style={styles.userName}>{userData?.name}</Text>
                    </View>
                </>
            )}
            <CustomButton text={'Manage profile'} type={'SECONDARY'} bgColor='#FFF5E6' fgColor='' onPress={() => { navigation.navigate('ManageProfile'); }} />
            <CustomButton text={'Logut'} type={'PRIMARY'} bgColor={''} fgColor={''} onPress={async () => {
                await auth().signOut();
                navigation.dispatch(StackActions.replace('signNavigation'));
            }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerText: {
        color: '#0F172A',
        fontSize: 18,
        fontWeight: '600',
        paddingVertical: 10,
        paddingLeft: 5,
    },
    profileImageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%'
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    ProfileUpdate: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        width: '100%',
        marginVertical: 20,
    },
    defaultProfileText: {
        fontSize: 16,
        textAlign: 'center',
    },
    usernamec: {
        paddingLeft: 25,
        width: '100%',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000',
    },
    postcount: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    userRecipeCount: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000',
    },
    userPhoto: {
        width: 24,
        height: 24,
    },
});

export default ProfileScreen;
