import { Link } from "wasp/client/router";
import { Hourglass, Microscope, SecurityCamera, ThumbsDown, ThumbsUp } from "@phosphor-icons/react";
import { Button } from "./button";

export default function AdminSideNav({ page, setPage }: { page: string, setPage: Function }) {

  async function handlePageChange(page: string) {
    setPage(page);
  }

  return (
    <aside className="fixed left-0 z-10 w-20 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 p-2 sm:py-5">
        <Button onClick={() => handlePageChange("dashboard")} variant={page === "dashboard" ? "default" : "secondary"}>
          <SecurityCamera size={24} />
          <span className="sr-only">Dashboard</span>
        </Button>
        <Button onClick={() => handlePageChange("pending")} variant={page === "pending" ? "default" : "secondary"}>
          <Hourglass size={24} />
          <span className="sr-only">Pending</span>
        </Button>
        <Button onClick={() => handlePageChange("review")} variant={page === "review" ? "default" : "secondary"}>
          <Microscope size={24} />
          <span className="sr-only">In Review</span>
        </Button>
        <Button onClick={() => handlePageChange("denied")} variant={page === "denied" ? "default" : "secondary"}>
          <ThumbsDown size={24} />
          <span className="sr-only">Denied</span>
        </Button>
        <Button onClick={() => handlePageChange("published")} variant={page === "published" ? "default" : "secondary"}>
          <ThumbsUp size={24} />
          <span className="sr-only">Published</span>
        </Button>
      </nav>
    </aside>
  )
}
