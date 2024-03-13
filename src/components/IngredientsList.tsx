import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';


interface Ingredient {
  name: string;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
  onPressAdd: () => void;
  onPressDelete: (index: number) => void;
  onHandle: (text: string, index: number) => void;
  onEndEditing: (text: string, index: number) => void;
}


const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients, onPressAdd, onPressDelete, onHandle, onEndEditing }) => {
  return (
    <View style={styles.container}>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientRow}>
          <TextInput
            style={styles.input}
            placeholder="Ingredient"
            value={ingredient.name}
            onChangeText={(text) => onHandle(text, index)}
            onBlur={() => onEndEditing(ingredient.name, index)}
          />
          {index === ingredients.length - 1 ? (
            <TouchableOpacity style={styles.addButton} onPress={onPressAdd}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.deleteButton} onPress={() => onPressDelete(index)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: 'white',
    width: '80%',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 0,
  },
  addButton: {
    backgroundColor: '#FFF',
    borderColor: '#FB9400',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: 60, // Fixed width for both buttons
    height: 50, // Fixed height for both buttons
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
  deleteButton: {
    backgroundColor: '#FFF',
    borderColor: '#FB9400',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: 60, // Fixed width for both buttons
    height: 50, // Fixed height for both buttons
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center',
  },
  buttonText: {
    color: '#FB9400',
    fontWeight: 'bold',
    fontSize: 12,
  },
});


export default IngredientsList;
