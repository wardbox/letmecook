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
          <img className="rounded-md h-[256px] sm:h-[512px] object-cover" src="https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F2022%2F11%2F15%2F6777730-chicken-noodle-salad-Chef-John-1x1-1.jpg&q=60&c=sc&poi=auto&orient=true&h=512" alt="photo of food" />
        </CardContent>
        <CardFooter className="sm:p-5 flex justify-between items-center">
          <Votes upvotes={data[0].upvotes} downvotes={data[0].downvotes} />
          <Link to="/recipes/:id" params={{ id: data[0].id }} className="">
            <Button size="sm" className="origin-bottom-right hover:rotate-3 transition duration-500">Cook it</Button>
          </Link>
        </CardFooter>
      </Card>

    )
  }
}