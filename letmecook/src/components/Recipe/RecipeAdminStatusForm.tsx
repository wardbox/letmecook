import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"
import { RecipePageProps } from "./RecipePage"
import { useEffect, useState } from "react"
import {
  setRecipePending,
  setRecipeInReview,
  setRecipeDenied,
  setRecipePublished,
  createRecipeComment,
} from "wasp/client/operations"

const FormSchema = z.object({
  comment: z
    .string()
    .min(10, {
      message: "Comment must be at least 10 characters.",
    })
    .max(160, {
      message: "Comment must not be longer than 30 characters.",
    }),
  status: z.string(),
})

export default function RecipeAdminStatusForm({ recipe }: { recipe: RecipePageProps["recipe"] }) {
  const [status, setStatus] = useState<string | null>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.status === 'pending') {
      try {
        setRecipePending({ recipeId: recipe.id })
        createRecipeComment({ recipeId: recipe.id, content: data.comment, recipeStatus: data.status })
        toast({
          title: "Recipe set to pending",
        })
      } catch (error) {
        toast({
          title: "Failed to set recipe to pending",
          variant: "destructive",
        })
      }
    } else if (data.status === 'review') {
      try {
        setRecipeInReview({ recipeId: recipe.id })
        createRecipeComment({ recipeId: recipe.id, content: data.comment, recipeStatus: data.status })
        toast({
          title: "Recipe set to in review",
        })
      } catch (error) {
        toast({
          title: "Failed to set recipe to in review",
          variant: "destructive",
        })
      }
    } else if (data.status === 'denied') {
      try {
        setRecipeDenied({ recipeId: recipe.id })
        createRecipeComment({ recipeId: recipe.id, content: data.comment, recipeStatus: data.status })
        toast({
          title: "Recipe set to denied",
        })
      } catch (error) {
        toast({
          title: "Failed to set recipe to denied",
          variant: "destructive",
        })
      }
    } else if (data.status === 'published') {
      try {
        setRecipePublished({ recipeId: recipe.id })
        createRecipeComment({ recipeId: recipe.id, content: data.comment, recipeStatus: data.status })
        toast({
          title: "Recipe set to published",
        })
      } catch (error) {
        toast({
          title: "Failed to set recipe to published",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Failed to set recipe status",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (recipe.pending) {
      setStatus('pending')
    } else if (recipe.inReview) {
      setStatus('review')
    } else if (recipe.denied) {
      setStatus('declined')
    } else if (recipe.published) {
      setStatus('published')
    }
  }, [recipe])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please give a reason for the status change."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={status ? status : field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
