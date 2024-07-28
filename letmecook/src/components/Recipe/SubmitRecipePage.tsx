import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { createFile, createRecipe } from "wasp/client/operations";
import axios from 'axios';
import { X } from "@phosphor-icons/react";
import { Textarea } from "../ui/textarea";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType === "jpg" || fileType === "png") return true;
  }
  return false;
}

const recipeFormSchema = z.object({
  title: z.string(),
  tags: z.string().transform((value) => value.split(" ")),
  photo: z.instanceof(FileList).refine((files) => {
    if (files.length > 1) return false;
    const file = files[0];
    if (file.size > MAX_FILE_SIZE) return false;
    return checkFileType(file);
  }),
  prepTime: z.coerce.number().min(1),
  cookTime: z.coerce.number().min(1),
  servings: z.coerce.number().min(1),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Name is required" }),
        amount: z.string().min(1, { message: "Amount is required" }),
        measurement: z
          .string()
          .refine(
            (value) =>
              ["c", "tsp", "tbsp", "oz", "lb", "g", "kg", "ml", "l", "fl oz", "gal", "pt", "qt"].includes(value.toLowerCase()), {
            message: "Invalid measurement",
          })
      }),
    ).min(1, { message: "At least one ingredient is required" }),
  steps: z.array(z.object({
    order: z.number().min(1, { message: "Order is required" }),
    description: z.string().min(1, { message: "Description is required" }),
  })).min(1, { message: "At least one step is required" }),
  notes: z.string(),
})

export default function SubmitRecipePage() {
  const form = useForm<z.infer<typeof recipeFormSchema>>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      photo: undefined,
      tags: [""],
      prepTime: 0,
      cookTime: 0,
      servings: 0,
      ingredients: [{ name: "", amount: "", measurement: "" }],
      steps: [{ order: 1, description: "" }],
      notes: "",
    },
  })
  const { control, handleSubmit, register } = form;
  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: "ingredients",
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: "steps",
  });

  const fileRef = register("photo")

  async function onSubmit(values: z.infer<typeof recipeFormSchema>) {
    try {
      console.log(values)

      if (values.ingredients.some((ingredient) => !ingredient.name || !ingredient.amount || !ingredient.measurement)) {
        console.error('All ingredient fields are required');
        return;
      }

      if (values.steps.some((step) => !step.order || !step.description)) {
        console.error('All step fields are required');
        return;
      }

      const createdRecipe = await createRecipe({
        title: values.title,
        cookTime: values.cookTime,
        notes: values.notes,
        prepTime: values.prepTime,
        servings: values.servings,
        ingredients: values.ingredients,
        steps: values.steps,
        tags: values.tags,
      });

      const createdFile = await createFile({
        fileType: values.photo[0].type,
        name: values.photo[0].name,
        recipeId: createdRecipe.id,
      });

      const res = await axios.put(createdFile.uploadUrl, values.photo[0], {
        headers: {
          'Content-Type': values.photo[0].type,
        }
      });

      if (res.status !== 200) {
        console.error('Failed to upload file to S3')
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="flex flex-col h-full mx-auto p-8 gap-8">
      <h1 className="text-4xl font-bold">Submit a recipe</h1>
      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="My great recipe" {...field} />
                  </FormControl>
                  <FormDescription>
                    Title of the recipe - what you'd call it in a cookbook
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <Input type="file" {...fileRef} />
                  </FormControl>
                  <FormDescription>
                    Photo of the recipe - ensure it's well lit and in focus.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="prepTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prep time</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Time in minutes it takes to prepare the recipe
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="cookTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cook time</FormLabel>
                    <FormControl>
                      <Input type="number" step={1} placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Time in minutes it takes to cook the recipe
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name="servings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servings</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormDescription>
                    Number of humans the recipe serves
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="ingredients"
              render={() => (
                <FormItem>
                  <FormLabel>Ingredients</FormLabel>
                  {ingredientFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-3 gap-3">
                      <Controller
                        control={control}
                        name={`ingredients.${index}.name`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Ingredient name"
                              {...field}
                            />
                          </FormControl>
                        )}
                      />
                      <Controller
                        control={control}
                        name={`ingredients.${index}.amount`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Amount"
                              {...field}
                            />
                          </FormControl>
                        )}
                      />
                      <div className="flex gap-3">
                        <Controller
                          control={control}
                          name={`ingredients.${index}.measurement`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Measurement (e.g. cup, tsp)"
                                {...field}
                              />
                            </FormControl>
                          )}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            removeIngredient(index)
                          }
                        >
                          <X />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      appendIngredient({ name: "", amount: "", measurement: "" })
                    }
                  >
                    Add Ingredient
                  </Button>
                  <FormDescription>
                    Ingredients for the recipe. Add as many as you need.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="steps"
              render={() => (
                <FormItem>
                  <FormLabel>Steps</FormLabel>
                  {stepFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-2 gap-3">
                      <Controller
                        control={control}
                        name={`steps.${index}.order`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="number"
                              placeholder={`${index + 1}`}
                              disabled
                              {...field}
                            />
                          </FormControl>
                        )}
                      />
                      <div className="flex gap-3">
                        <Controller
                          control={control}
                          name={`steps.${index}.description`}
                          render={({ field }) => (
                            <FormControl>
                              <Textarea
                                placeholder="Describe what to do on this step"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                          )}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (stepFields.length === 1) return;
                            removeStep(index)
                          }}
                        >
                          <X />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      appendStep({ order: stepFields[stepFields.length - 1].order + 1, description: "" })
                    }
                  >
                    Add Ingredient
                  </Button>
                  <FormDescription>
                    Steps for the recipe
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. This recipe is great for breakfast" {...field} />
                  </FormControl>
                  <FormDescription>
                    Notes about the recipe - optional
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. breakfast, vegan, drink" type="" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tags for the recipe - separated by spaces
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div >
  )
}
