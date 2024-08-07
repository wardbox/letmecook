import { Link } from "wasp/client/router"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { useQuery, getFeaturedRecipes } from "wasp/client/operations"
import { FeaturedRecipesSkeleton } from "./Skeletons/FeaturedRecipesSkeleton";
import Votes from "./Votes";
import { Button } from "../ui/button";
import { getDownloadFileSignedURL } from "wasp/client/operations";
import { useEffect, useState } from "react";
import { SmileySad } from "@phosphor-icons/react";
import { Skeleton } from "../ui/skeleton";

export function FeaturedRecipes() {
  const { data, error, isLoading } = useQuery(getFeaturedRecipes);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.length > 0 && data[0].photo) {
      getDownloadFileSignedURL({ key: data[0].photo.key }).then((url) => {
        setPhoto(url);
      });
    }
  }, [data]);

  return (
    <section id="featured-recipe">
      {data && data.length > 0 && (
        <Card className="max-w-[512px]" aria-description="recipe card">
          <CardHeader>
            <CardTitle>
              {data[0].title}
            </CardTitle>
            <CardDescription >by {data[0].author.username}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {photo ? (
              <img className="object-cover rounded-md w-full h-[256px]" src={photo} alt={`photo of ${data[0].title}`} />
            ) : (
              <Skeleton className="object-cover rounded-md w-full h-[256px]" />
            )}
          </CardContent>
          <CardFooter className="sm:p-5 flex justify-between items-center">
            <Votes upvotes={data[0].votes.filter(vote => vote.upvote).length} downvotes={data[0].votes.filter(vote => vote.downvote).length} recipeId={data[0].id} />
            <Link to="/recipes/:id" params={{ id: data[0].id }} className="">
              <Button size="sm" className="origin-bottom-right hover:rotate-3 transition">Cook it</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
      {isLoading && <FeaturedRecipesSkeleton />}
      {error && (
        <div className="flex flex-col items-center text-center justify-center gap-3 text-2xl font-bold">
          <SmileySad size={128} weight="fill" className="text-destructive" />
          <p>We lost the cookbook. Sorry.</p>
        </div>
      )}
    </section>
  )
}
