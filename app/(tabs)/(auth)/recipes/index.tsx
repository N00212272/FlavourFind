import { View, StyleSheet } from 'react-native';
import { FlatList, Text } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button, Snackbar } from 'react-native-paper'; 
import RecipeItem from '@/components/RecipeItem';
import { RecipeTypeID } from '@/types';

export default function Tab() {
  const devUrl = process.env.EXPO_PUBLIC_DEV_URL;
  const [recipes, setRecipes] = useState([]);
  // using snack bar to display any error messages
  const [snackBarVisible, setSnackBarVisible] = useState(false); 
  const [snackBarMessage, setSnackBarMessage] = useState('');

//  getting the recipes
  useEffect(() => {
    axios
      .get('https://recipe-backend-rose.vercel.app/api/recipes')
      .then((response) => {
        console.log(response.data);
        setRecipes(response.data);
      })
      .catch((err) => {
        console.log(err);
        setSnackBarMessage('Failed to load recipes');
        setSnackBarVisible(true);
      });
  }, []);

  if (!recipes) return <Text>No recipes found</Text>;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Button to create new recipes */}
        <Link href={{pathname: '/recipes/create'}}>
        <Button
          mode="contained"
          onPress={() => setSnackBarMessage('oops.. Check if your logged in!')}
        >
          Create Your Own Recipe
        </Button>
        </Link>
        {/* Recipe List */}
        <FlatList
          data={recipes}
          renderItem={({ item }) => <RecipeItem recipe={item} />}
          keyExtractor={(recipe: RecipeTypeID) => recipe._id}
        />

        {/* Snack bar to show error messages */}
        <Snackbar
          visible={snackBarVisible}
          onDismiss={() => setSnackBarVisible(false)}
          action={{
            label: 'Close',
            onPress: () => setSnackBarVisible(false),
          }}
        >
          {snackBarMessage}
        </Snackbar>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  }
});
