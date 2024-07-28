import { Recipe } from "wasp/entities";
import { HttpError } from "wasp/server";

import { type CreateRecipe } from "wasp/server/operations";

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
