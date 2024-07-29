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
import { useHistory } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

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
  prepTime: z.coerce.number().min(1, { message: "Prep time is required" }),
  cookTime: z.coerce.number().min(1, { message: "Cook time is required" }),
  servings: z.coerce.number().min(1, { message: "Servings is required" }),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Name is required" }),
        amount: z.string().min(1, { message: "Amount is required" }),
        measurement: z
          .string()
          .refine(
            (value) =>
              [
                "g", "kg", "ml", "l", "tsp", "tbsp", "oz", "lb", "fl oz", "c", "pt", "qt", "gal"
              ].includes(value.toLowerCase()),
            {
              message: "Invalid measurement",
            }
          ),
      }, { message: "At least one ingredient is required" })
    )
    .min(1, { message: "At least one ingredient is required" }),
  steps: z.array(z.object({
    order: z.number().min(1, { message: "Order is required" }),
    description: z.string().min(1, { message: "Description is required" }),
  })).min(1, { message: "At least one step is required" }),
  notes: z.string(),
})

export default function SubmitRecipePage() {
  const { toast } = useToast()
  const history = useHistory();
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
      if (values.ingredients.some((ingredient) => !ingredient.name || !ingredient.amount || !ingredient.measurement)) {
        toast({
          title: 'Error',
          description: 'Empty ingredients are not allowed',
        })
        return;
      }

      if (values.steps.some((step) => !step.order || !step.description)) {
        toast({
          title: 'Error',
          description: 'Empty steps are not allowed',
        })
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
        toast({
          title: 'Error',
          description: 'Failed to upload photo',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Recipe submitted successfully',
        })
        history.push(`/recipes/${createdRecipe.id}`);
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
                  <FormLabel className="text-2xl">Recipe Title</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Bacon Pancakes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-2xl">Photo</FormLabel>
                  <FormControl>
                    <Input type="file" {...fileRef} />
                  </FormControl>
                  <FormDescription>
                    Ensure it's well lit and in focus.
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
                    <FormLabel className="text-2xl">Prep time</FormLabel>
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
                    <FormLabel className="text-2xl">Cook time</FormLabel>
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
                  <FormLabel className="text-2xl">Servings</FormLabel>
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
                  <FormLabel className="text-2xl">Ingredients</FormLabel>
                  {ingredientFields.map((field, index) => (
                    <div key={field.id} className="flex flex-col sm:flex-row gap-3">
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Measurement">
                                    {field.value}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent aria-label="Measurement">
                                <SelectGroup>
                                  <SelectLabel className="font-bold">Metric</SelectLabel>
                                  <SelectItem value="g">g</SelectItem>
                                  <SelectItem value="kg">kg</SelectItem>
                                  <SelectItem value="ml">mL</SelectItem>
                                  <SelectItem value="l">L</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                  <SelectLabel className="font-bold">Imperial</SelectLabel>
                                  <SelectItem value="tsp">tsp</SelectItem>
                                  <SelectItem value="tbsp">tbsp</SelectItem>
                                  <SelectItem value="oz">oz</SelectItem>
                                  <SelectItem value="lb">lb</SelectItem>
                                  <SelectItem value="fl oz">fl oz</SelectItem>
                                  <SelectItem value="c">cup</SelectItem>
                                  <SelectItem value="pt">pt</SelectItem>
                                  <SelectItem value="qt">qt</SelectItem>
                                  <SelectItem value="gal">gal</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>

                          )}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            removeIngredient(index)
                          }
                          aria-label="Remove ingredient"
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
                  <FormLabel className="text-2xl">Steps</FormLabel>
                  {stepFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 sm:flex gap-3">
                      <Controller
                        control={control}
                        name={`steps.${index}.order`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="string"
                              placeholder={`${index + 1}`}
                              disabled
                              value={index + 1}
                              className='w-12'
                            />
                          </FormControl>
                        )}
                      />
                      <div className="flex w-full gap-3">
                        <Controller
                          control={control}
                          name={`steps.${index}.description`}
                          render={({ field }) => (
                            <FormControl>
                              <Textarea
                                placeholder="Describe what to do on this step"
                                {...field}
                              />
                            </FormControl>
                          )}
                        />
                        {index !== 0 && <Button
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
                        }
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      appendStep({ order: stepFields[stepFields.length - 1].order + 1, description: "" })
                    }
                  >
                    Add Step
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
                  <FormLabel className="text-2xl">Notes</FormLabel>
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
