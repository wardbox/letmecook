import { useQuery, getAllPublishedRecipes } from "wasp/client/operations";
import { RecipeCard } from "./RecipeCard";
import { SmileySad, XCircle } from "@phosphor-icons/react";
import { RecipeCardSkeleton } from "./Skeletons/RecipeCardSkeleton";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";

export interface AllRecipesPageProps {
  recipes: Awaited<ReturnType<typeof getAllPublishedRecipes>>;
}

export default function AllRecipesPage() {
  // TODO: Paginate recipes
  // filter by upvote ratio (upvotes / (upvotes + downvotes))
  // filter by newest (which is default right now)

  const { data, error, isLoading } = useQuery(getAllPublishedRecipes);
  const [filteredData, setFilteredData] = useState<AllRecipesPageProps["recipes"] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState<AllRecipesPageProps["recipes"][0]["author"] | "">("");

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

      if (authorFilter) {
        filteredRecipes = filteredRecipes.filter((recipe) => recipe.authorId === authorFilter.id);
      }

      filteredRecipes = filteredRecipes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setFilteredData(filteredRecipes);
    }
  }, [data, searchTerm, authorFilter]);

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-8 gap-8">
      <h1 className="text-4xl font-bold">Recipes</h1>
      <div className="flex flex-col gap-3 items-center sm:items-start">
        <Label htmlFor="recipe-filter">Filter recipes</Label>
        <Input
          id="recipe-filter"
          className="sm:w-1/3"
          type="text"
          placeholder="Type in an ingredient, tag, or recipe name"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {authorFilter && filteredData && (
          <Badge variant="secondary" className="flex gap-1 p-1 pl-2 cursor-pointer">
            <span className="inline-block align-middle">{authorFilter.username}</span>
            <XCircle size={20} weight="fill" onClick={() => setAuthorFilter("")} className="p-0" />
          </Badge>
        )}
      </div>
      {filteredData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {filteredData.map((recipe: AllRecipesPageProps["recipes"][0]) => (
            <RecipeCard key={recipe.id} recipe={recipe} setAuthor={setAuthorFilter} />
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
