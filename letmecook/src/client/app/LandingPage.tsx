import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

export default function LandingPage() {
  return (
    <div className="h-full max-w-3xl mx-auto p-3 flex flex-col gap-5 text-balance">
      <section className="p-3">
        <h1 className="text-5xl font-bold">letmecook</h1>
        <p className="text-sm text-muted-foreground">A clean and simple recipe website with 🔥 recipes.</p>
      </section>
      <section className="p-3">
        <h2 className="text-2xl font-bold">Features</h2>
        <Accordion type="single" collapsible>
          {features.map((feature, index) => (
            <AccordionItem value={feature.name} key={index}>
              <AccordionTrigger>{feature.name}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{feature.description}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

const features = [
  {
    name: "No stories",
    description: "Tired of wasting time reading a novel before getting to the meat of the recipe you're after? Look no further."
  },
  {
    name: "Good recipes",
    description: "All recipes vetted and tested by wardbox - a non-professional cook."
  },
  {
    name: "Accessibility",
    description: "Through functional brutalist design principles, letmecook strives to be as accessible as possible."
  },
  {
    name: "Unobtrusive ads",
    description: "letmecook is ad-supported, but we promise to keep ads as unobtrusive as possible."
  }
]