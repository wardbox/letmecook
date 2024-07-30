import { type Recipe, type RecipeComment } from "wasp/entities";
import { HttpError } from "wasp/server";

import {
  type CreateRecipe,
  type CreateRecipeComment,
  type SetRecipeDenied,
  type SetRecipeFeatured,
  type SetRecipeInReview,
  type SetRecipePending,
  type SetRecipePublished,
  type SetRecipeUnfeatured,
  type SetUserSeenComment,
} from "wasp/server/operations";

export const createRecipe: CreateRecipe<
  Pick<
    Recipe,
    | "title"
    | "cookTime"
    | "notes"
    | "prepTime"
    | "servings"
  > & {
    ingredients: Array<{
      amount?: string;
      name?: string;
      measurement?: string;
    }>;
    steps: Array<{
      order?: number;
      description?: string;
    }>;
    tags: Array<string>;
    notes?: string;
  },
  Recipe
> = async (
  { title, cookTime, notes, prepTime, servings, ingredients, steps, tags },
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const recipe = await context.entities.Recipe.create({
    data: {
      title,
      author: { connect: { id: context.user.id } },
      cookTime,
      notes,
      prepTime,
      servings,
      pending: true,
    },
  });

  ingredients.map(async (ingredient) => {
    if (!ingredient.name || !ingredient.amount || !ingredient.measurement) {
      throw new HttpError(
        400,
        "Ingredient must have a name, amount, and measurement",
      );
    }

    await context.entities.Ingredient.create({
      data: {
        amount: ingredient.amount,
        name: ingredient.name,
        measurement: ingredient.measurement,
        recipe: { connect: { id: recipe.id } },
      },
    });
  });

  steps.map(async (step) => {
    if (!step.order || !step.description) {
      throw new HttpError(400, "Step must have an order and description");
    }

    await context.entities.Step.create({
      data: {
        order: step.order,
        description: step.description,
        recipe: { connect: { id: recipe.id } },
      },
    });
  });

  tags.map(async (tag) => {
    const existingTag = await context.entities.Tag.findFirst({
      where: { name: tag },
    });

    if (existingTag) {
      await context.entities.Tag.update({
        where: { id: existingTag.id },
        data: {
          recipes: { connect: { id: recipe.id } },
        },
      });
    } else {
      await context.entities.Tag.create({
        data: {
          name: tag,
          recipes: { connect: { id: recipe.id } },
        },
      });
    }
  });

  return recipe;
};

export const setRecipePending: SetRecipePending<{ recipeId: string }, Recipe> =
  async (
    { recipeId },
    context,
  ) => {
    if (!context.user) {
      throw new HttpError(401);
    }

    if (!context.user.isAdmin) {
      throw new HttpError(403);
    }

    const recipe = await context.entities.Recipe.findFirst({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new HttpError(404);
    }

    return await context.entities.Recipe.update({
      where: { id: recipeId },
      data: {
        pending: true,
        inReview: false,
        denied: false,
        published: false,
      },
    });
  };

export const setRecipeInReview: SetRecipeInReview<
  { recipeId: string },
  Recipe
> = async (
  { recipeId },
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403);
  }

  const recipe = await context.entities.Recipe.findFirst({
    where: { id: recipeId },
  });

  if (!recipe) {
    throw new HttpError(404);
  }

  return await context.entities.Recipe.update({
    where: { id: recipeId },
    data: {
      pending: false,
      inReview: true,
      denied: false,
      published: false,
    },
  });
};

export const setRecipeDenied: SetRecipeDenied<{ recipeId: string }, Recipe> =
  async (
    { recipeId },
    context,
  ) => {
    if (!context.user) {
      throw new HttpError(401);
    }

    if (!context.user.isAdmin) {
      throw new HttpError(403);
    }

    const recipe = await context.entities.Recipe.findFirst({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new HttpError(404);
    }

    return await context.entities.Recipe.update({
      where: { id: recipeId },
      data: {
        pending: false,
        inReview: false,
        denied: true,
        published: false,
      },
    });
  };

export const setRecipePublished: SetRecipePublished<
  { recipeId: string },
  Recipe
> = async (
  { recipeId },
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403);
  }

  const recipe = await context.entities.Recipe.findFirst({
    where: { id: recipeId },
  });

  if (!recipe) {
    throw new HttpError(404);
  }

  return await context.entities.Recipe.update({
    where: { id: recipeId },
    data: {
      pending: false,
      inReview: false,
      denied: false,
      published: true,
    },
  });
};

export const createRecipeComment: CreateRecipeComment<
  { recipeId: string; content: string; recipeStatus: string },
  RecipeComment
> = async ({ recipeId, content, recipeStatus }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const recipe = await context.entities.Recipe.findFirst({
    where: { id: recipeId },
  });

  if (!recipe) {
    throw new HttpError(404);
  }

  return await context.entities.RecipeComment.create({
    data: {
      recipe: { connect: { id: recipeId } },
      user: { connect: { id: context.user.id } },
      text: content,
      recipeStatus: recipeStatus,
    },
  });
};

export const setUserSeenComment: SetUserSeenComment<
  { commentId: string },
  RecipeComment | null
> = async ({ commentId }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const comment = await context.entities.RecipeComment.findFirst({
    where: { id: commentId },
    include: { recipe: { include: { author: true } } },
  });

  if (!comment) {
    throw new HttpError(404);
  }

  if (comment.recipe.author.id !== context.user.id) {
    // don't error, just don't update the comment
    return null;
  }

  return await context.entities.RecipeComment.update({
    where: { id: commentId },
    data: {
      userSeen: true,
    },
  });
};

export const setRecipeFeatured: SetRecipeFeatured<
  { recipeId: string },
  Recipe
> = async ({ recipeId }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403);
  }

  const recipe = await context.entities.Recipe.findFirst({
    where: { id: recipeId },
  });

  if (!recipe) {
    throw new HttpError(404);
  }

  return await context.entities.Recipe.update({
    where: { id: recipeId },
    data: {
      featured: true,
    },
  });
};

export const setRecipeUnfeatured: SetRecipeUnfeatured<
  { recipeId: string },
  Recipe
> = async ({ recipeId }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403);
  }

  const recipe = await context.entities.Recipe.findFirst({
    where: { id: recipeId },
  });

  if (!recipe) {
    throw new HttpError(404);
  }

  return await context.entities.Recipe.update({
    where: { id: recipeId },
    data: {
      featured: false,
    },
  });
};
