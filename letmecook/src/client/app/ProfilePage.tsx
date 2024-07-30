import React, { useState } from "react";
import { AuthUser } from "wasp/auth";
import { useQuery, getUserRecipes } from "wasp/client/operations";
import { RecipeCard } from "../../components/Recipe/RecipeCard";
import UserRecipesPage from "../../components/Recipe/UserRecipesPage";
import { User } from "lucide-react";

export default function ProfilePage({ user }: { user: AuthUser }) {
  const { data: recipes, error, isLoading } = useQuery(getUserRecipes, { userId: user.id });
  const [author, setAuthor] = useState<AuthUser | null>(null);

  return (
    <div className="h-full max-w-4xl mx-auto my-16 p-3 flex flex-col gap-12 text-balance">
      <section id="document-title" className="p-3">
        <hgroup className="flex flex-col gap-3">
          <h1 className="text-5xl sm:text-6xl font-bold">Profile</h1>
          <p className="text-xl sm:text-3xl subtitle font-light text-muted-foreground">welcome back, {user.username}</p>
        </hgroup>
      </section>
      <section id="my-recipes" className="p-3">
        <UserRecipesPage />
      </section>
    </div>
  );
}
