import { HttpError } from "wasp/server";
import {
  type Recipe,
} from "wasp/entities"

import {
  type GetAllRecipes,
} from "wasp/server/operations"


export const getAllRecipes = (async (_args, context) => {
  const recipes = await context.entities.Recipe.findMany({
    include: { steps: true, ingredients: true },
    orderBy: { updatedAt: "desc" },
  })
  return recipes;
}) satisfies GetAllRecipes