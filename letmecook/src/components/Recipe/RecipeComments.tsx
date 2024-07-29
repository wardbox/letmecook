import { useQuery, getRecipeComments } from "wasp/client/operations";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { useEffect } from "react";
import { setUserSeenComment } from "wasp/client/operations";

export default function RecipeComments({ recipeId }: { recipeId: string }) {
  const { data } = useQuery(getRecipeComments, { recipeId });

  useEffect(() => {
    if (data && data.length > 0) {
      data.forEach(comment => {
        if (!comment.userSeen) {
          setUserSeenComment({ commentId: comment.id });
        }
      });
    }
  }, [data]);

  function getTimestamp(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
  return (
    <div className="flex flex-col gap-3">
      {data && data.length > 0 ? (
        data.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-3 p-3 border bg-secondary text-secondary-foreground rounded-lg">
            <Badge variant={comment.recipeStatus === "published" ? "default" : "destructive"} className="text-nowrap sm:max-w-min">{comment.recipeStatus}</Badge>
            <p>{comment.text}</p>
            <p className="text-sm">{comment.user.username}<span className="text-xs"> • {getTimestamp(new Date(comment.createdAt))}</span></p>
          </div>
          // <div key={index} className="flex flex-col gap-3 p-3">
          //   <p className="text-sm">{comment.user.username}<span className="text-xs"> • {getTimestamp(new Date(comment.createdAt))}</span></p>
          //   <p>{comment.text}</p>
          // </div>
        ))
      ) : (
        <p className="text-balance text-sm">There appear to be no notes from the admin.</p>
      )
      }
    </div >
  )
}
