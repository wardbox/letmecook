import { Link } from "wasp/client/router"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import Votes from "./Votes";
import { Button } from "../ui/button";
import { AllRecipesPageProps } from "./AllRecipesPage";
import { getDownloadFileSignedURL, useQuery } from 'wasp/client/operations';
import { useEffect, useState } from "react";
export function RecipeCard({ recipe, setAuthor }: {
  recipe: AllRecipesPageProps["recipes"][0],
  setAuthor: Function
}) {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (recipe.photo) {
      getDownloadFileSignedURL({ key: recipe.photo.key }).then((url) => {
        setPhoto(url);
      });
    }
  }, [recipe.photo]);

  const handleAuthorClick = () => {
    setAuthor(recipe.author);
  }

  return (
    <Card className="h-[x]" aria-description="recipe card">
      <CardHeader>
        <CardTitle>
          {recipe.title}
        </CardTitle>
        <CardDescription onClick={handleAuthorClick} className="underline cursor-pointer">by {recipe.author.username}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <img className="object-cover rounded-md w-full h-[256px]" src={photo || ""} alt={`photo of ${recipe.title}`} />
      </CardContent>
      <CardFooter className="sm:p-5 flex justify-between items-center">
        <Votes upvotes={recipe.upvotes} downvotes={recipe.downvotes} />
        <Link to="/recipes/:id" params={{ id: recipe.id }} className="">
          <Button size="sm" className="origin-bottom-right hover:rotate-3 transition">Cook it</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}