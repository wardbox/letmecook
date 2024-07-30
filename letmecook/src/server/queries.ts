import { HttpError } from "wasp/server";

import {
  type GetAllPublishedRecipes,
  type GetAllRecipes,
  type GetDeniedRecipes,
  type GetFeaturedRecipes,
  type GetInReviewRecipes,
  type GetPendingRecipes,
  type GetRecipe,
  type GetRecipeComments,
  type GetUserRecipes,
} from "wasp/server/operations";

export const getAllPublishedRecipes = (async (_args, context) => {
  const recipes = await context.entities.Recipe.findMany({
    where: {
      AND: {
        published: true,
        pending: false,
        inReview: false,
        denied: false,
      },
    },
    include: {
      author: true,
      ingredients: true,
      photo: true,
      steps: true,
      tags: true,
    },
    orderBy: { title: "asc" },
  });

  return recipes;
}) satisfies GetAllPublishedRecipes;

export const getAllRecipes = (async (_args, context) => {
  if (!context.user || !context.user.isAdmin) {
    throw new HttpError(403, "Unauthorized");
  }

  const recipes = await context.entities.Recipe.findMany({
    include: {
      author: true,
      ingredients: true,
      photo: true,
      steps: true,
      tags: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return recipes;
}) satisfies GetAllRecipes;

export const getFeaturedRecipes = (async (_args, context) => {
  const recipes = await context.entities.Recipe.findMany({
    where: {
      AND: {
        featured: true,
        published: true,
        pending: false,
        inReview: false,
        denied: false,
      },
    },
    include: {
      author: true,
      photo: true,
    },
    orderBy: { upvotes: "desc" },
    take: 3,
  });
  return recipes;
}) satisfies GetFeaturedRecipes;

export const getPendingRecipes = (async (_args, context) => {
  if (!context.user || !context.user.isAdmin) {
    throw new HttpError(403, "Unauthorized");
  }

  const recipes = await context.entities.Recipe.findMany({
    where: { pending: true },
    include: {
      author: true,
      photo: true,
      ingredients: true,
      steps: true,
      tags: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return recipes;
}) satisfies GetPendingRecipes;

export const getInReviewRecipes = (async (_args, context) => {
  if (!context.user || !context.user.isAdmin) {
    throw new HttpError(403, "Unauthorized");
  }

  const recipes = await context.entities.Recipe.findMany({
    where: { inReview: true },
    include: {
      author: true,
      photo: true,
      ingredients: true,
      steps: true,
      tags: true,
      adminComment: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return recipes;
}) satisfies GetInReviewRecipes;

export const getDeniedRecipes = (async (_args, context) => {
  if (!context.user || !context.user.isAdmin) {
    throw new HttpError(403, "Unauthorized");
  }

  const recipes = await context.entities.Recipe.findMany({
    where: { denied: true },
    include: {
      author: true,
      photo: true,
      ingredients: true,
      steps: true,
      tags: true,
      adminComment: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return recipes;
}) satisfies GetDeniedRecipes;

export const getRecipe = (async ({ recipeId }, context) => {
  const recipe = await context.entities.Recipe.findUnique({
    where: { id: recipeId },
    include: {
      author: true,
      ingredients: true,
      photo: true,
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

export const getUserRecipes = (async (_args, context) => {
  if (!context.user) {
    throw new HttpError(403, "Unauthorized");
  }

  const recipes = await context.entities.Recipe.findMany({
    where: { authorId: context.user.id },
    include: {
      author: true,
      photo: true,
      ingredients: true,
      steps: true,
      tags: true,
      adminComment: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return recipes;
}) satisfies GetUserRecipes;

export const getRecipeComments = (async ({ recipeId }, context) => {
  if (!context.user) {
    throw new HttpError(403, "Unauthorized");
  }

  const recipe = await context.entities.Recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) {
    throw new HttpError(404, `Recipe with id ${recipeId} not found`);
  }

  if ((context.user.id !== recipe.authorId) && !context.user.isAdmin) {
    throw new HttpError(403, "Unauthorized");
  }

  const comments = await context.entities.RecipeComment.findMany({
    where: { recipeId },
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return comments;
}) satisfies GetRecipeComments;
