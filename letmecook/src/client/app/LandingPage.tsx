import React from "react";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "../../components/ui/card"
import logomark from "../static/logomark.svg"
import { Button } from "../../components/ui/button";

export default function LandingPage() {
  return (
    <div className="h-full max-w-3xl mx-auto p-3 flex flex-col gap-5 text-balance">
      <section className="p-3 items-center">
        <div className="flex">
          <h1 className="text-6xl font-bold">letmecook</h1>
        </div>
        <h2 className="text-3xl">A clean and simple cookbook with 100% good recipes.</h2>
      </section>
      <section id="features" className="mt-12 p-3 flex flex-col gap-5">
        {/* <h2 className="text-4xl font-bold justify-center">Features</h2> */}
        {features.map((feature) => (
          <div>
            <h2 className="text-2xl">{feature.title}</h2>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
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
