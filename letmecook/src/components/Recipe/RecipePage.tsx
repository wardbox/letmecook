import { RouteComponentProps } from "react-router-dom";
import { useQuery, getRecipe } from "wasp/client/operations";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Printer, Share } from "@phosphor-icons/react";
import { toast } from "../../components/ui/use-toast"
import Votes from "./Votes";
import { getDownloadFileSignedURL } from 'wasp/client/operations';
import { useEffect, useState } from "react";

export default function RecipePage(props: RouteComponentProps<{ id: string }>) {
  const { data, error, isLoading } = useQuery(getRecipe, { recipeId: props.match.params.id });
  const url = location.href;

  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
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

  return (
    <div className="h-full max-w-3xl mx-auto p-3 my-16">
      {data && (
        <div className="flex flex-col gap-12 text-balance">
          <section id="heading" className="p-3">
            <hgroup className="flex flex-col gap-5">
              <h1 className="text-6xl font-bold">{data.title}</h1>
              <p className="text-muted-foreground">by {data.author.username}</p>
              <div className="flex gap-8 items-center printhide">
                <Votes upvotes={data.upvotes} downvotes={data.downvotes} />
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
          <section id="photos" className="printhide">
            {photo ? (
              <img className="rounded-md w-full" src={photo} alt={`photo of ${data.title}`} />
            ) : (
              <div className="rounded-md w-full aspect-square bg-gradient-to-r from-cyan-500 to-blue-500"></div>
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
                <li key={ingredient.id}>{ingredient.amount} {ingredient.measurement} {ingredient.name}</li>
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
      )
      }
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  )
}