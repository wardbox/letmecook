import { RouteComponentProps } from "react-router-dom";
import { useQuery, getRecipe } from "wasp/client/operations";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowUp, ArrowDown, Printer, Share } from "@phosphor-icons/react";
import { toast, useToast } from "../../components/ui/use-toast"


export default function RecipePage(props: RouteComponentProps<{ id: string }>) {
  const { data, error, isLoading } = useQuery(getRecipe, { recipeId: props.match.params.id });
  const url = location.href;

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
    <div className="h-full max-w-4xl mx-auto p-8">
      {data && (
        <div className="flex flex-col gap-12 text-balance my-8">
          <section id="heading" className="p-3">
            <hgroup className="flex flex-col gap-5">
              <h1 className="text-6xl font-bold">{data.title}</h1>
              <div className="flex gap-8 items-center printhide">
                <div className="flex gap-3">
                  <Button size="sm" variant="secondary" className="hover:bg-primary hover:text-primary-foreground">{data.upvotes}<ArrowUp size={16} /></Button>
                  <Button size="sm" variant="secondary" className="hover:bg-destructive hover:text-destructive-foreground">{data.downvotes}<ArrowDown size={16} /></Button>
                </div>
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
            <img className="rounded-sm" src="https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F2022%2F11%2F15%2F6777730-chicken-noodle-salad-Chef-John-1x1-1.jpg&q=60&c=sc&poi=auto&orient=true&h=512" alt="photo of food" />
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
            <ol className="list-inside flex flex-col gap-3">
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
    </div >
  )
}

// title of recipe
// upvotes and downvotes count
// a photo at least, otherwise a carousel
// tags (#meat, #vegetarian)
// a print button that is customizable to remove photos - maybe
// a share button - maybe
// cook times
// servings
// ingredients
// steps
// notes
