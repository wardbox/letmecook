import { RouteComponentProps } from "react-router-dom";
import { useQuery, getRecipe } from "wasp/client/operations";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Printer, Share, SmileySad } from "@phosphor-icons/react";
import { toast } from "../../components/ui/use-toast"
import Votes from "./Votes";
import { getDownloadFileSignedURL, setRecipeFeatured, setRecipeUnfeatured } from 'wasp/client/operations';
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "wasp/client/auth";
import RecipeAdminStatusForm from "./RecipeAdminStatusForm";
import RecipeComments from "./RecipeComments";
import { Skeleton } from "../ui/skeleton";

export interface RecipePageProps {
  recipe: Awaited<ReturnType<typeof getRecipe>>;
}

export default function RecipePage(props: RouteComponentProps<{ id: string }>) {
  const { data, error, isLoading } = useQuery(getRecipe, { recipeId: props.match.params.id });
  const history = useHistory();
  const url = location.href;
  const [photo, setPhoto] = useState<string | null>(null);
  const { data: user } = useAuth();

  useEffect(() => {
    if (data && !user?.isAdmin && user?.id !== data.authorId && !data.published) {
      history.push("/");
    }

    if (data && data.photo) {
      getDownloadFileSignedURL({ key: data.photo.key }).then((url) => {
        setPhoto(url);
      });
    }
  }, [data]);

  const handleClickShare = () => {
    try {
      navigator.clipboard.writeText(url)
      toast({
        title: "Copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Failed to copy to clipboard",
      })
    }
  }

  const handlePrintRecipe = () => {
    window.print()
  }

  function setFeatured() {
    if (data) {
      setRecipeFeatured({ recipeId: data.id })
      toast({
        title: "Recipe featured",
      })
    }
  }

  function setUnfeatured() {
    if (data) {
      setRecipeUnfeatured({ recipeId: data.id })
      toast({
        title: "Recipe unfeatured",
      })
    }
  }

  return (
    <div className="h-full max-w-3xl mx-auto p-3 my-16">
      {data && (user?.isAdmin || user?.id == data.authorId) && (
        <div className="flex flex-col gap-3 p-8 mb-8 border printhide">
          <h2 className="text-lg">Owner Info</h2>
          <p className="text-muted-foreground text-sm">Status updates and admin correspondence will appear here. This is not visible to other users.</p>
          <div className="flex flex-col gap-3 p-3 sm:max-w-min text-nowrap">
            <h3 className="text-lg">Status</h3>
            {data.pending && <Badge variant="warning" className="text-md">Pending</Badge>}
            {data.inReview && <Badge variant="warning" className="text-md">In Review</Badge>}
            {data.denied && <Badge variant="destructive" className="text-md">Denied</Badge>}
            {data.published && <Badge>Published</Badge>}
          </div>
          <div className="flex flex-col gap-3 p-3">
            <h3 className="text-lg">Admin Notes</h3>
            <div>
              <RecipeComments recipeId={data.id} />
            </div>
          </div>
        </div>
      )}
      {data && user?.isAdmin && (
        <div className="flex flex-col gap-5 p-5 printhide">
          <RecipeAdminStatusForm recipe={data} />
          <Button className="max-w-min" onClick={setFeatured}>Feature Recipe</Button>
          <Button className="max-w-min" variant="destructive" onClick={setUnfeatured}>Unfeature Recipe</Button>
        </div>
      )}
      {data && (
        data.published ||
        (user && (data.authorId === user.id || user.isAdmin))
      ) && (
          <div className="flex flex-col gap-12 text-balance">
            <section id="heading" className="p-3">
              <hgroup className="flex flex-col gap-5">
                <h1 className="text-6xl font-bold">{data.title}</h1>
                <p className="text-muted-foreground">by {data.author.username}</p>
                <div className="flex gap-8 items-center printhide">
                  <Votes upvotes={data.votes.filter(vote => vote.upvote).length} downvotes={data.votes.filter(vote => vote.downvote).length} recipeId={data.id} />
                  <div className="flex gap-3">
                    <Button size="sm" variant="secondary" onClick={handlePrintRecipe}><Printer size={24} /></Button>
                    <Button size="sm" variant="secondary" onClick={handleClickShare}><Share size={24} /></Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 printhide">
                  {data.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">#{tag.name}</Badge>
                  ))}
                </div>
              </hgroup>
            </section>
            <section id="photo" className="printhide">
              {photo ? (
                <img className="rounded-md w-full" src={photo} alt={`photo of ${data.title}`} />
              ) : (
                <Skeleton className="rounded-md w-full h-256" />
              )}
            </section>
            <hr className="printhide" />
            <section id="logistics" className="flex flex-col gap-3 max-w-max">
              <h2 className="text-3xl font-bold">Logistics</h2>
              <div className="grid grid-cols-2 gap-3">
                <p>Prep: {data.prepTime}m</p>
                <p>Cook: {data.cookTime}m</p>
                <p>Total: {data.prepTime + data.cookTime}m</p>
                <p>Servings: {data.servings} humans</p>
              </div>
            </section>
            <section id="ingredients" className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold">Ingredients</h2>
              <ul className="list-disc list-inside flex flex-col gap-3">
                {data.ingredients.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.name.toLocaleLowerCase()} - <span className="text-muted-foreground">{ingredient.amount} {ingredient.measurement}</span></li>
                ))}
              </ul>
            </section>
            <section id="steps" className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold">Steps</h2>
              <ol className="list-decimal list-inside flex flex-col gap-3">
                {data.steps.map((step) => (
                  <li key={step.id}>{step.description}</li>
                ))}
              </ol>
            </section>
            <section id="notes">
              <h2 className="text-3xl font-bold">Notes</h2>
              <p>{data.notes}</p>
            </section>
          </div>
        )}
      {isLoading && <p>Loading...</p>}
      {error && (
        <div className="flex flex-col items-center text-center justify-center gap-3 text-2xl font-bold">
          <SmileySad size={128} weight="fill" className="text-destructive" />
          <p>We lost the cookbook. Sorry.</p>
        </div>
      )}
    </div>
  )
}
