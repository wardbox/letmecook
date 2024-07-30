import { Button } from "../ui/button";
import { CaretUp, CaretDown } from "@phosphor-icons/react";
import { createVote } from "wasp/client/operations";

export const Votes = ({ upvotes, downvotes, recipeId }: { upvotes: number, downvotes: number, recipeId: string }) => {

  function upvote() {
    createVote({ recipeId, upvote: true });
  }

  function downvote() {
    createVote({ recipeId, downvote: true });
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="secondary" className="flex gap-1 hover:bg-primary hover:text-primary-foreground" onClick={upvote}>{upvotes}<CaretUp size={16} /></Button>
      <Button size="sm" variant="secondary" className="flex gap-1 hover:bg-destructive hover:text-destructive-foreground" onClick={downvote}>{downvotes}<CaretDown size={16} /></Button>
    </div>
  )
}

export default Votes;
