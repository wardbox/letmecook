import RecipeForm from "./RecipeForm";

export default function SubmitRecipePage() {

  return (
    <div className="flex flex-col h-full mx-auto p-8 gap-8">
      <h1 className="text-4xl font-bold">Submit a recipe</h1>
      <div className="max-w-2xl">
        <RecipeForm />
      </div>
    </div >
  )
}
