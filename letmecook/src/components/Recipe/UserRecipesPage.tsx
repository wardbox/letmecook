import { useQuery, getUserRecipes } from "wasp/client/operations";
import UserRecipeCard from "./UserRecipeCard";
import { SmileySad, XCircle } from "@phosphor-icons/react";
import { RecipeCardSkeleton } from "./Skeletons/RecipeCardSkeleton";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";

export interface UserRecipesPageProps {
  recipes: Awaited<ReturnType<typeof getUserRecipes>>;
}

export default function UserRecipesPage() {
  const { data, error, isLoading } = useQuery(getUserRecipes);
  const [filteredData, setFilteredData] = useState<UserRecipesPageProps["recipes"] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState<UserRecipesPageProps["recipes"][0]["author"] | "">("");

  useEffect(() => {
    if (data) {
      let filteredRecipes = data;

      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        filteredRecipes = filteredRecipes.filter((recipe) =>
          recipe.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
          recipe.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          recipe.tags.some(tag => tag.name.toLowerCase().includes(lowerCaseSearchTerm))
        );
      }

      filteredRecipes = filteredRecipes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setFilteredData(filteredRecipes);
    }
  }, [data, searchTerm, authorFilter]);

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-8 gap-8">
      <h1 className="text-4xl font-bold">My Recipes</h1>
      <div className="flex flex-col gap-3 items-center sm:items-start">
        <Label htmlFor="recipe-filter">Filter recipes</Label>
        <Input
          id="recipe-filter"
          className="sm:w-1/3"
          type="text"
          placeholder="Type in an ingredient, tag, or recipe name"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {filteredData.map((recipe: UserRecipesPageProps["recipes"][0]) => (
            <div key={recipe.id} className="flex flex-col gap-3">
              {recipe.pending && <Badge variant="warning" className="text-lg">Pending</Badge>}
              {recipe.inReview && <Badge variant="warning" className="text-lg">In Review</Badge>}
              {recipe.denied && <Badge variant="destructive" className="text-lg">Denied</Badge>}
              {recipe.published && <Badge className="text-lg">Published</Badge>}
              <UserRecipeCard recipe={recipe} setAuthor={setAuthorFilter} />
            </div>
          ))}
        </div>
      )}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <RecipeCardSkeleton key={index} />
          ))}
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center text-center justify-center gap-3 text-2xl font-bold">
          <SmileySad size={128} weight="fill" className="text-destructive" />
          <p>We lost the cookbook. Sorry.</p>
        </div>
      )}
    </div>
  )
}
