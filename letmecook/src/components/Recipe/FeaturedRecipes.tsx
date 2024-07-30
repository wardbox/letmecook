import { Link } from "wasp/client/router"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { useQuery, getFeaturedRecipes } from "wasp/client/operations"
import { FeaturedRecipesSkeleton } from "./Skeletons/FeaturedRecipesSkeleton";
import Votes from "./Votes";
import { Button } from "../ui/button";
import { getDownloadFileSignedURL } from "wasp/client/operations";
import { useEffect, useState } from "react";
import { SmileySad } from "@phosphor-icons/react";

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
    <section id="featured-recipe" className="flex flex-col gap-3">
      {data && data.length > 0 && (
        <Card className="max-w-[512px]" aria-description="featured recipe card">
          <CardHeader>
            <CardTitle>
              {data[0].title}
            </CardTitle>
            <CardDescription>by {data[0].author.username}</CardDescription>
          </CardHeader>
          <CardContent className="flex relative aspect-square items-center justify-center p-6 overflow-hidden">
            {photo ? (
              <img className="rounded-md w-full h-[256px] sm:h-[512px] object-cover" src={photo} alt="photo of food" />
            ) : (
              <div className="rounded-md w-full aspect-square bg-gradient-to-r from-cyan-500 to-blue-500"></div>
            )}
          </CardContent>
          <CardFooter className="sm:p-5 flex justify-between items-center">
            <Votes upvotes={data[0].upvotes} downvotes={data[0].downvotes} />
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
