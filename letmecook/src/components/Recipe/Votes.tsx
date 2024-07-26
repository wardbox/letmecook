import { Button } from "../ui/button";
import { ArrowUp, ArrowDown } from "@phosphor-icons/react";

export const Votes = ({ upvotes, downvotes }: { upvotes: number, downvotes: number }) => {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="secondary" className="hover:bg-primary hover:text-primary-foreground">{upvotes}<ArrowUp size={16} /></Button>
      <Button size="sm" variant="secondary" className="hover:bg-destructive hover:text-destructive-foreground">{downvotes}<ArrowDown size={16} /></Button>
    </div>
  )
}

export default Votes;