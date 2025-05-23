const express = require("express");
const app = express();

const { initializeDatabase } = require("./db/db.connect");

const Recipe = require("./models/recipe.models");

app.use(express.json());

initializeDatabase();

// 3.
// Create an API with route "/recipes" to create a new recipe in the recipes database. Make sure to handle errors properly. Test your API with Postman.

async function createRecipe(newRecipe) {
  try {
    const recipe = new Recipe(newRecipe);

    const saveRecipe = await recipe.save();

    return saveRecipe;
  } catch (error) {
    throw error;
  }
}

app.post("/recipes", async (req, res) => {
  try {
    const savedRecipe = await createRecipe(req.body);

    res
      .status(201)
      .json({ message: "Recipe added successfully.", recipe: savedRecipe });
  } catch (error) {
    res.status(500).json({ error: "Failed to add recipe." });
  }
});

// 6.
// Create an API to get all the recipes in the database as a response. Make sure to handle errors properly

async function readAllRecipes() {
  try {
    const allRecipes = await Recipe.find();

    return allRecipes;
  } catch (error) {
    console.log(error);
  }
}

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await readAllRecipes();

    if (recipes.length != 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ error: "No recipes found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
});

// 7.
// Create an API to get a recipe's details by its title. Make sure to handle errors properly

async function readRecipeByTitle(recipeTitle) {
  try {
    const recipe = await Recipe.findOne({ title: recipeTitle });

    return recipe;
  } catch (error) {
    throw error;
  }
}

app.get("/recipes/:title", async (req, res) => {
  try {
    const recipe = await readRecipeByTitle(req.params.title);

    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe." });
  }
});

// 8.
// Create an API to get details of all the recipes by an author. Make sure to handle errors properly

async function readRecipesByAuthor(authorName) {
  try {
    const recipesByAuthor = await Recipe.find({ author: authorName });

    return recipesByAuthor;
  } catch (error) {
    console.log(error);
  }
}

app.get("/recipes/author/:authorName", async (req, res) => {
  try {
    const recipes = await readRecipesByAuthor(req.params.authorName);

    if (recipes.length != 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ error: "No recipes found." });
    }
  } catch {
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
});

// 9.
// Create an API to get all the recipes that are of "Easy" difficulty level

async function readRecipesByDifficulty(difficultyLevel) {
  try {
    const recipesByDifficulty = await Recipe.find({
      difficulty: difficultyLevel,
    });

    return recipesByDifficulty;
  } catch (error) {
    console.log(error);
  }
}

app.get("/recipes/difficulty/:difficultyLevel", async (req, res) => {
  try {
    const recipes = await readRecipesByDifficulty(req.params.difficultyLevel);

    if (recipes.length != 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ error: "No recipes found." });
    }
  } catch {
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
});

// 10.
// Create an API to update a recipe's difficulty level with the help of its id. Update the difficulty of "Spaghetti Carbonara" from "Intermediate" to "Easy". Send an error message "Recipe not found" if the recipe is not found

async function updateRecipeById(recipeId, dataToUpdate) {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      dataToUpdate,
      { new: true }
    );

    return updatedRecipe;
  } catch (error) {
    console.log("Error in updating Recipe data", error);
  }
}

app.post("/recipes/:recipeId", async (req, res) => {
  try {
    const updatedRecipe = await updateRecipeById(req.params.recipeId, req.body);

    if (updatedRecipe) {
      res.status(200).json({
        message: "Recipe updated successfully.",
        updatedRecipe: updatedRecipe,
      });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update recipe." });
  }
});

// 11.
// Create an API to update a recipe's prep time and cook time with the help of its title. Update the details of the recipe "Chicken Tikka Masala". Send an error message "Recipe not found" if the recipe is not found

async function updateRecipeByTitle(recipeTitle, dataToUpdate) {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { title: recipeTitle },
      dataToUpdate,
      { new: true }
    );

    return updatedRecipe;
  } catch (error) {
    console.log("Error in updating Recipe data", error);
  }
}

app.post("/recipes/title/:recipeTitle", async (req, res) => {
  try {
    const updatedRecipe = await updateRecipeByTitle(
      req.params.recipeTitle,
      req.body
    );

    if (updatedRecipe) {
      res.status(200).json({
        message: "Recipe updated successfully.",
        updatedRecipe: updatedRecipe,
      });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to updated recipe." });
  }
});

// 12.
// Create an API to delete a recipe with the help of a recipe id. Send an error message "Recipe not found" if the recipe does not exist

async function deleteRecipe(recipeId) {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);

    return deletedRecipe;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await deleteRecipe(req.params.recipeId);

    if (deletedRecipe) {
      res.status(200).json({
        message: "Recipe deleted successfully.",
        deletedRecipe: deletedRecipe,
      });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recipe." });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
