import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const apiService = {
    searchMealByName: async (name: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/search.php?s=${name}`);
            return response.data;
        } catch (error) {
            console.error('Error searching meal by name:', error);
            throw error;
        }
    },

    listMealsByFirstLetter: async (letter: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/search.php?f=${letter}`);
            return response.data;
        } catch (error) {
            console.error('Error listing meals by first letter:', error);
            throw error;
        }
    },

    lookupMealById: async (id: string) => {
        try {
            // Fetch recipe details by ID
            const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
            const recipeDetails = response.data.meals ? response.data.meals[0] : null;

            // Store idMeal in AsyncStorage
            if (recipeDetails) {
                await AsyncStorage.setItem('idMeal', id);
            }

            return response.data;
        } catch (error) {
            console.error('Error looking up meal by id:', error);
            throw error;
        }
    },

    lookupRandomMeal: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/random.php`);
            return response.data;
        } catch (error) {
            console.error('Error looking up random meal:', error);
            throw error;
        }
    },

    listMealCategories: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/categories.php`);
            return response.data;
        } catch (error) {
            console.error('Error listing meal categories:', error);
            throw error;
        }
    },

    listAllCategories: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/list.php?c=list`);
            return response.data;
        } catch (error) {
            console.error('Error listing all categories:', error);
            throw error;
        }
    },

    listAllAreas: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/list.php?a=list`);
            return response.data;
        } catch (error) {
            console.error('Error listing all areas:', error);
            throw error;
        }
    },

    listAllIngredients: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/list.php?i=list`);
            return response.data;
        } catch (error) {
            console.error('Error listing all ingredients:', error);
            throw error;
        }
    },

    filterByMainIngredient: async (ingredient: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/filter.php?i=${ingredient}`);
            return response.data;
        } catch (error) {
            console.error('Error filtering by main ingredient:', error);
            throw error;
        }
    },

    filterByCategory: async (category: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/filter.php?c=${category}`);
            return response.data;
        } catch (error) {
            console.error('Error filtering by category:', error);
            throw error;
        }
    },

    filterByArea: async (area: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/filter.php?a=${area}`);
            return response.data;
        } catch (error) {
            console.error('Error filtering by area:', error);
            throw error;
        }
    },
    // Function to store idMeal in AsyncStorage
    storeIdMeal: async (id: string) => {
        try {
            await AsyncStorage.setItem('idMeal', id);
        } catch (error) {
            console.error('Error storing idMeal:', error);
            throw error;
        }
    },

    // Function to fetch idMeal from AsyncStorage
    fetchIdMeal: async () => {
        try {
            const idMeal = await AsyncStorage.getItem('idMeal');
            return idMeal;
        } catch (error) {
            console.error('Error fetching idMeal:', error);
            throw error;
        }
    },

    // Function to fetch recipe details by ID
    fetchRecipeById: async (id: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
            return response.data.meals ? response.data.meals[0] : null;
        } catch (error) {
            console.error('Error fetching recipe by id:', error);
            throw error;
        }
    },

    // Function to fetch multiple recipes by their IDs
    fetchRecipesByIds: async (ids: string[]) => {
        try {
            const promises = ids.map(id => axios.get(`${BASE_URL}/lookup.php?i=${id}`));
            const responses = await Promise.all(promises);
            const recipes = responses.map(response => response.data.meals ? response.data.meals[0] : null);
            return recipes.filter(recipe => recipe !== null);
        } catch (error) {
            console.error('Error fetching recipes by ids:', error);
            throw error;
        }
    },
    // Store the recipe ID in AsyncStorage
    storeRecipeId: async (id: string) => {
        try {
            let recipeIds = await AsyncStorage.getItem('recipeIds');
            let updatedRecipeIds: string[] = [];

            if (recipeIds) {
                updatedRecipeIds = JSON.parse(recipeIds);
            }

            updatedRecipeIds.push(id);
            await AsyncStorage.setItem('recipeIds', JSON.stringify(updatedRecipeIds));
        } catch (error) {
            console.error('Error storing recipe ID:', error);
            throw error;
        }
    },

    // Get the latest 5 recipe IDs from AsyncStorage
    getLatestRecipeIds: async () => {
        try {
            let recipeIds = await AsyncStorage.getItem('recipeIds');
            if (recipeIds) {
                return JSON.parse(recipeIds)?.slice(-5) || []; // Get the latest 5 recipe IDs
            }
            return [];
        } catch (error) {
            console.error('Error getting latest recipe IDs:', error);
            throw error;
        }
    },

    // Clear the search history
    clearSearchHistory: async () => {
        try {
            await AsyncStorage.removeItem('recipeIds');
        } catch (error) {
            console.error('Error clearing search history:', error);
            throw error;
        }
    }
};

export default apiService;
