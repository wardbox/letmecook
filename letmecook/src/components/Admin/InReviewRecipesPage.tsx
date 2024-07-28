import { RecipeCard } from "../Recipe/RecipeCard";
import { useState } from "react";
import { InReviewRecipesProps } from "../../client/app/AdminPage";

export default function PendingRecipesPage({ recipes }: { recipes: InReviewRecipesProps["recipes"] }) {
  const [author, setAuthor] = useState(null);

  return (
    <div className="mx-16 p-3 gap-12 text-balance flex flex-col w-full">
      <h2 className="text-2xl sm:text-3xl font-bold">In Review recipes</h2>
      {recipes && (
        recipes.map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.id} setAuthor={setAuthor} />
        ))
      )}
    </div>
  );
}
