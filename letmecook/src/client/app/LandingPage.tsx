import React from "react";
import { FeaturedRecipes } from "../../components/Recipe/FeaturedRecipes";

export default function LandingPage() {
  return (
    <div className="h-full max-w-3xl mx-auto my-16 p-3 flex flex-col gap-12 text-balance">
      <section id="document-title" className="p-3">
        <hgroup className="flex flex-col gap-3">
          <h1 className="text-5xl sm:text-6xl font-bold">letmecook</h1>
          <p className="text-xl sm:text-3xl subtitle font-light text-muted-foreground">A clean and simple cookbook with 100% good recipes.</p>
        </hgroup>
      </section>
      <section id="featured-recipe" className="flex flex-col gap-3">
        <h2 className="text-2xl sm:text-3xl font-bold">Featured Recipe</h2>
        <FeaturedRecipes />
      </section>
      <section id="features" className="p-3 flex flex-col gap-5">
        {features.map((feature) => (
          <div key={feature.title}>
            <h2 className="text-lg sm:text-2xl font-bold">{feature.title}</h2>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

const features = [
  {
    title: "No stories",
    description: "Tired of wasting time reading a novel before getting to the meat of the recipe you're after? Us too.",
  },
  {
    title: "Good recipes",
    description: "All recipes vetted and tested by wardbox - a non-professional cook."
  },
  {
    title: "Accessibility",
    description: "Through functional brutalist design principles, letmecook strives to be as accessible as possible."
  },
  {
    title: "Unobtrusive ads",
    description: "letmecook is ad-supported, but we promise to keep ads as unobtrusive as possible."
  }
]
