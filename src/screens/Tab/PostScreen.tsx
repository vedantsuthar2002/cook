import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomInput from '../../components/CustomInput';
import ImagePickerModel from '../../components/ImagePickerModel';
import IngredientsList from '../../components/IngredientsList';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const PostScreen = () => {
    const [dishName, setDishName] = useState('');
    const [description, setDescription] = useState('');
    const [portion, setPortion] = useState('');
    const [time, setTime] = useState('');
    const [ingredients, setIngredients] = useState([{ name: '' }]);

    const resetRecipe = () => {
        setDishName('');
        setDescription('');
        setPortion('');
        setTime('');
        setIngredients([{ name: '' }]);
    };

    const saveRecipe = async () => {
        try {
            const user = auth().currentUser;
            if (!user) {
                console.error('User is not logged in. Cannot save recipe.');
                return;
            }
            const recipeData = {
                dishName,
                description,
                portion,
                time,
                ingredients,
            };

            const recipeRef = await firestore().collection('Recipes').doc(user.uid).collection('recipes').doc();
            const recipeId = recipeRef.id;
            await recipeRef.set(recipeData);
            console.log('Recipe saved successfully!', recipeId);

            resetRecipe();
        } catch (error) {
            console.error('Error saving recipe:', error);
        }
    };

    const onAddIng = () => {
        const data = [...ingredients];
        data.push({ name: '' });
        console.log('data', data);
        setIngredients(data);

    }

    const onDeleteIngredients = (index: number) => {
        console.log("del===", index);
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1);
        setIngredients(updatedIngredients);
    }
    const onHandle = (text: string, index: number) => {
        const updatedIngredients = [...ingredients];
        console.log(" ----", updatedIngredients, index, text);
        updatedIngredients[index].name = text;
        setIngredients(updatedIngredients);
    };
    const onEndEditing = (text: string, index: number) => {
        const updatedIngredients = [...ingredients];
        console.log(" ----", updatedIngredients, index, text);
        updatedIngredients[index].name = text;
        setIngredients(updatedIngredients);
    };



    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.PostContainer}>
                <Text style={styles.HText}>
                    Post Recipe
                </Text>
                <Text style={styles.heading}>
                    Recipe title
                </Text>
                <CustomInput placeholder='Family favorite dishes...' value={dishName} setValue={setDishName} />
                <Text style={styles.heading}>
                    Description
                </Text>
                <CustomInput placeholder="Example: grandma's delicious recipe..." value={description} setValue={setDescription} multiline={true}
                    numberOfLines={4} />
                <Text style={styles.heading}>
                    Recipe photo
                </Text>
                {/* ImagePickerModel */}
                <ImagePickerModel />
                <View style={styles.TiPo}>
                    <Text style={styles.heading}>
                        Portion
                    </Text>
                    <TextInput style={styles.TiPoInput} placeholder='2 people' value={portion} onChangeText={setPortion}></TextInput>
                </View>
                <View style={styles.TiPo}>
                    <Text style={styles.heading}>
                        Cooking time
                    </Text>
                    <TextInput style={styles.TiPoInput} placeholder='1 hr 30 min' value={time} onChangeText={setTime}></TextInput>
                </View>
                <Text style={styles.heading}>Ingredients</Text>
                <IngredientsList ingredients={ingredients} onPressAdd={() => onAddIng()} onPressDelete={(index) => onDeleteIngredients(index)} onHandle={(text, index) => onHandle(text, index)} onEndEditing={(text, index) => onEndEditing(text, index)} />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={resetRecipe}>
                        <Text style={styles.buttonText}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={saveRecipe}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    PostContainer: {
        flex: 1,
        padding: 18,
        backgroundColor: '#FFF',
    },
    HText: {
        color: '#0F172A',
        fontSize: 18,
        fontWeight: '600',
        paddingVertical: 10,
        paddingLeft: 5,
    },
    heading: {
        color: '#0F172A',
        fontSize: 14,
        fontWeight: '600',
        paddingVertical: 8,
    },
    TiPo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    TiPoInput: {
        backgroundColor: '#FFF',
        width: '50%',
        borderColor: '#E8E8E8',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#FB9400',
        padding: 10,
        borderRadius: 5,
        width: '48%', // Adjust width as needed
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
export default PostScreen;