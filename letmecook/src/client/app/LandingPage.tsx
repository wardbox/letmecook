import { Button } from "../../components/ui/button";
import { ModeToggle } from "../../components/mode-toggle";
import { useQuery, getAllRecipes } from "wasp/client/operations";

export default function LandingPage() {
  const { data: recipes } = useQuery(getAllRecipes, {});

  return (
    <div className="flex flex-col max-w-6xl justify-center p-8 gap-5">
      <h1>Welcome to LetMeCook</h1>
      <p>LetMeCook is a place where you can share your recipes with the world.</p>
      <p>Sign up to get started!</p>
      <Button>Sign up</Button>
      <div>
        {recipes && recipes.map((recipe) => (
          <div key={recipe.id}>
            <h2>{recipe.title}</h2>
            <p>{recipe.updatedAt.toLocaleString()}</p>
            {recipe.ingredients && (
              <ul>
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.name}</li>
                ))}
              </ul>
            )}
            {recipe.steps && (
              <ol>
                {recipe.steps.map((step) => (
                  <li key={step.id}>{step.description}</li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}