import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { Skeleton } from "../../ui/skeleton"

export function FeaturedRecipesSkeleton() {
  return (
    <Card aria-description="loading featured recipe" className="max-w-[512px]">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
      <CardContent className="flex relative aspect-square items-center justify-center p-6 overflow-hidden">
        <Skeleton className="rounded-md w-full h-full object-cover" />
      </CardContent>
    </Card>
  )
}
