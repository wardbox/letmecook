import { HttpError } from "wasp/server";

import { type GetAllRecipes, type GetRecipe } from "wasp/server/operations";

export const getAllRecipes = (async (_args, context) => {
  const recipes = await context.entities.Recipe.findMany({
    include: { steps: true, ingredients: true },
    orderBy: { updatedAt: "desc" },
  });
  return recipes;
}) satisfies GetAllRecipes;

export const getRecipe = (async ({ recipeId }, context) => {
  const recipe = await context.entities.Recipe.findUnique({
    where: { id: recipeId },
    include: {
      author: true,
      ingredients: true,
      steps: {
        orderBy: { order: "asc" },
      },
      tags: true,
    },
  });

  if (!recipe) {
    throw new HttpError(404, `Recipe with id ${recipeId} not found`);
  }

  return recipe;
}) satisfies GetRecipe;
