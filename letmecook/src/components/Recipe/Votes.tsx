import { Button } from "../ui/button";
import { CaretUp, CaretDown } from "@phosphor-icons/react";

export const Votes = ({ upvotes, downvotes }: { upvotes: number, downvotes: number }) => {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="secondary" className="flex gap-1 hover:bg-primary hover:text-primary-foreground">{upvotes}<CaretUp size={16} /></Button>
      <Button size="sm" variant="secondary" className="flex gap-1 hover:bg-destructive hover:text-destructive-foreground">{downvotes}<CaretDown size={16} /></Button>
    </div>
  )
}

export default Votes;
