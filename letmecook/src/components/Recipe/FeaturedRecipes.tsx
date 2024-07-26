import { Link } from "wasp/client/router"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { useQuery, getFeaturedRecipes } from "wasp/client/operations"
import { FeaturedRecipesSkeleton } from "./Skeletons/FeaturedRecipesSkeleton";
import Votes from "./Votes";
import { Button } from "../ui/button";

export function FeaturedRecipes() {
  const { data, error, isLoading } = useQuery(getFeaturedRecipes);

  if (isLoading) {
    return <FeaturedRecipesSkeleton />
  }

  if (error) {
    return <FeaturedRecipesSkeleton />
  }

  if (data && data.length >= 0) {
    return (
      <Card className="max-w-[512px]" aria-description="featured recipe card">
        <CardHeader>
          <CardTitle>
            {data[0].title}
          </CardTitle>
          <CardDescription>by {data[0].author.username}</CardDescription>
        </CardHeader>
        <CardContent className="flex relative aspect-square items-center justify-center p-6 overflow-hidden">
          {data[0].imageUrl ? (
            <img className="rounded-md w-full h-[256px] sm:h-[512px] object-cover" src={data[0].imageUrl} alt="photo of food" />
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
    )
  }
}