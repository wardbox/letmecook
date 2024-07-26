import { useQuery, getAllRecipes } from "wasp/client/operations";
import { RecipeCard } from "./RecipeCard";
import { FunnelX, MagnifyingGlass, SlidersHorizontal, SmileySad, X, XCircle } from "@phosphor-icons/react";
import { RecipeCardSkeleton } from "./Skeletons/RecipeCardSkeleton";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
export interface AllRecipesPageProps {
  recipes: Awaited<ReturnType<typeof getAllRecipes>>;
}

export default function AllRecipesPage() {
  const { data, error, isLoading } = useQuery(getAllRecipes);
  const [filteredData, setFilteredData] = useState<AllRecipesPageProps["recipes"] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");

  useEffect(() => {
    if (data) {
      setFilteredData(
        data.filter((recipe) =>
          searchTerm
            .toLowerCase()
            .split('')
            .every((char) =>
              recipe.title.toLowerCase().includes(char) ||
              recipe.tags.some(tag => tag.name.toLowerCase().includes(char))
            )
        )
      );
      if (authorFilter && filteredData) {
        setFilteredData(filteredData.filter((recipe) => recipe.authorId === authorFilter));
      }
    }
  }, [data, searchTerm, authorFilter]);

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-8 gap-8">
      <h1 className="text-4xl font-bold">Recipes</h1>
      <div className="flex gap-3 items-center">
        <Input
          className=" sm:w-1/3"
          type="search"
          placeholder="Filter recipes"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {authorFilter && filteredData && (
          <Badge variant="secondary" className="flex gap-1 p-1 pl-2 cursor-pointer">
            <span className="inline-block align-middle">{filteredData[0].author.username}</span>
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
