import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card"
import { Skeleton } from "../../ui/skeleton";

export function RecipeCardSkeleton() {
  return (
    <Card aria-description="recipe card">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="rounded-md h-[256px] object-cover" />
      </CardContent>
    </Card>
  )
}