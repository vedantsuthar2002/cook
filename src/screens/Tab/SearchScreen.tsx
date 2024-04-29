import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, StatusBar, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../../API/apiService';
import { useNavigation } from '@react-navigation/native';
import Emoji from 'react-native-emoji';

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
}

interface RecentSearch {
  idMeal: string;
  strMeal: string;
}

const MAX_SEARCH_HISTORY = 5;

const SearchScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Meal[]>([]);
  const [originalResults, setOriginalResults] = useState<Meal[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [recentlyOpened, setRecentlyOpened] = useState<Meal[]>([]);
  const dropdownRef = useRef<View>(null);
  const navigation = useNavigation();

  // Debounce function
  const debounce = (func: Function, timeout: number) => {
    let timer: any;
    return function (this: any, ...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  // Function to save recent search
  const saveRecentSearch = async (search: RecentSearch) => {
    try {
      // Load recent searches from AsyncStorage
      const recentSearchesString = await AsyncStorage.getItem('recentSearches');
      let recentSearches: RecentSearch[] = [];

      if (recentSearchesString) {
        recentSearches = JSON.parse(recentSearchesString);
      }

      // Remove duplicate recent searches
      recentSearches = recentSearches.filter(rs => rs.idMeal !== search.idMeal);

      // Add the new recent search at the beginning
      recentSearches.unshift(search);

      // Keep only the last 5 recent searches
      recentSearches = recentSearches.slice(0, MAX_SEARCH_HISTORY);

      // Save recent searches to AsyncStorage
      await AsyncStorage.setItem('recentSearches', JSON.stringify(recentSearches));
      setRecentSearches(recentSearches);
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  // Function to handle opening a recipe
  const handleOpenRecipe = (recipe: Meal) => {
    // Check if the recipe is already in recently opened
    const existsInRecentlyOpened = recentlyOpened.some(openedRecipe => openedRecipe.idMeal === recipe.idMeal);
    if (!existsInRecentlyOpened) {
      // Update recently opened recipes
      setRecentlyOpened(prevOpened => [recipe, ...prevOpened]);
    }

    // Navigate to RecipeDetails screen
    navigation.navigate('RecipeDetails', { idMeal: recipe.idMeal });
  };

  // Debounced function to save recent search
  const saveRecentSearchDebounced = useRef(debounce(saveRecentSearch, 2000)).current;

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const filteredResults = originalResults.filter((meal) =>
      meal.strMeal.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setSearchResults(filteredResults);
    setShowDropdown(true);

    // Save recent search to AsyncStorage with debouncing
    saveRecentSearchDebounced({ idMeal: '', strMeal: searchTerm });
  }, [searchTerm, originalResults]);

  useEffect(() => {
    if (dropdownRef.current) {
      const height = 91 * searchResults.length;
      dropdownRef.current.setNativeProps({
        style: { height: height > 700 ? 700 : height }
      });
    }
  }, [searchResults]);

  const loadRecentSearches = async () => {
    try {
      const recentSearchesString = await AsyncStorage.getItem('recentSearches');
      if (recentSearchesString) {
        const recentSearches = JSON.parse(recentSearchesString) as RecentSearch[];
        setRecentSearches(recentSearches);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const searchMealByName = async (name: string) => {
    setSearchTerm(name);
    setShowDropdown(true);

    try {
      setLoading(true);
      const firstLetter = name.charAt(0);
      const response = await apiService.listMealsByFirstLetter(firstLetter);
      const meals = response.meals || [];
      setOriginalResults(meals);
      setSearchResults(meals);
      setLoading(false);
    } catch (error) {
      console.error('Error searching meal by name:', error);
      setLoading(false);
    }
  };

  const handleDropdownPress = (item: Meal) => {
    handleOpenRecipe(item);
  };

  const handleClearText = () => {
    setSearchTerm('');
    console.log(searchTerm);
  };

  const handleRecentPress = (item: Meal) => {
    handleOpenRecipe(item);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor='#FFF' />
      <ScrollView
        showsVerticalScrollIndicator={!showDropdown && showDropdown}
        contentContainerStyle={styles.scrollViewContainer}
        scrollEnabled={!showDropdown}
      >
        {/* search Input */}
        <View style={styles.search}>
          <TextInput
            placeholder='Type Recipe...'
            placeholderTextColor='#9CA3AF'
            style={styles.searchinput}
            value={searchTerm}
            onChangeText={searchMealByName}
          />
          {(searchTerm !== '') ? (
            <TouchableOpacity onPress={() => handleClearText()} style={styles.iconbg}>
              <Image source={require('../../assets/close.png')} style={styles.icon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => searchMealByName(searchTerm)}>
              <Image source={require('../../assets/loupe.png')} style={styles.searchlogo} />
            </TouchableOpacity>
          )}
        </View>
        {/* Display search results */}
        {showDropdown && (
          <View ref={dropdownRef} style={[styles.dropdownContainer, loading && styles.dropdownContainerOpacity]}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {searchResults.map(item => (
                  <TouchableOpacity key={item.idMeal} style={styles.dropdownItem} activeOpacity={showDropdown ? 1 : 0} onPress={() => handleDropdownPress(item)}>
                    <Image source={{ uri: item.strMealThumb }} style={styles.mealImage} />
                    <Text style={styles.mealName}>{item.strMeal}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}
        {/* Recent Search */}
        <View style={styles.recentContainer}>
          <Text style={styles.recentText}>Last Search</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentSearches.slice(Math.max(recentSearches.length - MAX_SEARCH_HISTORY, 0)).map((search, index) => (
              <TouchableOpacity key={index} style={styles.recentItem} onPress={() => searchMealByName(search.strMeal)}>
                <Text style={styles.recentItemText}>{search.strMeal || ''}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recently Opened */}
        {recentlyOpened.length > 0 && (
          <View style={styles.recentContainer}>
            <Text style={styles.recentText}>Recently Opened</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.filteredRecipesContainer}>
              {recentlyOpened.map((recipe, index) => (
                <TouchableOpacity disabled={showDropdown} key={index} style={[styles.caregotyRecipeItemContainer, styles.shadowprop, index % 2 !== 0 && { marginLeft: 10 }]} onPress={() => handleRecentPress(recipe)}>
                  <Image source={{ uri: recipe.strMealThumb }} style={styles.recentItemImage} />
                  <View style={styles.randomRecipeDetails}>
                    <Text numberOfLines={2} style={styles.recentItemText}>{recipe.strMeal}</Text>
                    <View style={styles.saveName}>
                      <Text style={styles.star}>
                        <Emoji name='star' style={styles.starIcon} /> (4.5)
                      </Text>
                      <Text style={styles.star}>
                        <Emoji name='clock330' style={styles.starIcon} /> 30 min
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  root: {
    backgroundColor: '#FFF',
    flex: 1,
    padding: 20,
  },
  search: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  searchinput: {
    padding: 16,
    height: 53,
    width: '80%',
  },
  touchsearch: {
    position: 'absolute',
    padding: 16,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchlogo: {
    right: 20,
    position: 'relative',
    height: 20,
    width: 20,
    alignItems: "center",
  },
  iconbg: {
    width: "20%",
    alignItems: "center",
  },
  icon: {
    height: 20,
    width: 20,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 1,
    maxHeight: 600,
    minHeight: 600
  },
  dropdownContainerOpacity: {
    opacity: 0.5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 70,
    marginBottom: 10,
  },
  mealImage: {
    width: 65,
    height: 70,
    marginRight: 10,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
  },
  scrollView: {
    maxHeight: 600,
  },
  recentContainer: {
    marginTop: 20,
  },
  recentText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  recentItem: {
    marginRight: 20,
  },
  caregotyRecipeItemContainer: {
    borderRadius: 10,
    width: '48%',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  shadowprop: {
    shadowColor: '#000',
    elevation: 3,
  },
  recentItemImage: {
    width: '95%',
    aspectRatio: 3 / 4,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    left: 3,
    top: 3,
  },
  recentItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  recipeInfo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  recipeInfoText: {
    fontSize: 14,
  },
  filteredRecipesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: 10,
  },
  randomRecipeDetails: {
    marginVertical: 10,
    paddingHorizontal: 5,
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

export default SearchScreen;
