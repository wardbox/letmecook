import React, { useEffect, useState } from "react";
import { type AuthUser } from 'wasp/auth'
import { useHistory } from "react-router-dom";
import AdminSideNav from "../../components/ui/adminsidenav";
import PendingRecipesPage from "../../components/Admin/PendingRecipesPage";
import InReviewRecipesPage from "../../components/Admin/InReviewRecipesPage";
import DeniedRecipesPage from "../../components/Admin/DeniedRecipesPage";
import PublishedRecipesPage from "../../components/Admin/PublishedRecipesPage";

import { useQuery, getPendingRecipes, getInReviewRecipes, getDeniedRecipes, getAllPublishedRecipes, getAllRecipes } from "wasp/client/operations";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Hourglass, Microscope, ThumbsDown, ThumbsUp } from "@phosphor-icons/react";

export interface PendingRecipesProps {
  recipes: Awaited<ReturnType<typeof getPendingRecipes>>;
}

export interface InReviewRecipesProps {
  recipes: Awaited<ReturnType<typeof getInReviewRecipes>>;
}

export interface DeniedRecipesProps {
  recipes: Awaited<ReturnType<typeof getDeniedRecipes>>;
}

export interface PublishedRecipesProps {
  recipes: Awaited<ReturnType<typeof getAllPublishedRecipes>>;
}

export default function AdminPage({ user }: { user: AuthUser }) {
  const { data: pending } = useQuery(getPendingRecipes);
  const { data: review } = useQuery(getInReviewRecipes);
  const { data: denied } = useQuery(getDeniedRecipes);
  const { data: published } = useQuery(getAllPublishedRecipes);
  const { data: allRecipes } = useQuery(getAllRecipes);

  const [page, setPage] = useState("dashboard");
  const history = useHistory();

  useEffect(() => {
    if (!user.isAdmin) {
      history.push("/");
    }
  }, [user]);

  return (
    <div className="h-full w-full mx-auto my-16 flex flex-col gap-12 text-balance">
      {user && user.isAdmin && (
        <div>
          <section id="document-title" className="p-3">
            <hgroup className="flex flex-col gap-3">
              <h1 className="text-5xl sm:text-6xl font-bold">admin portal</h1>
              <p className="text-xl sm:text-3xl subtitle font-light text-muted-foreground">welcome back, {user.username}</p>
            </hgroup>
          </section>
          <section id="admin-actions" className="flex gap-8">
            <AdminSideNav page={page} setPage={setPage} />
            <div>
              {page === "dashboard" && (
                <div>
                  <div className="mx-16 flex flex-wrap gap-8 p-12">
                    <Card className="p-5">
                      <CardHeader>
                        <CardTitle>Pending</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold flex gap-3 items-center">{pending?.length || "0"} <Hourglass size={32} /></p>
                      </CardContent>
                    </Card>
                    <Card className="p-5">
                      <CardHeader>
                        <CardTitle>In Review</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold flex gap-3 items-center">{review?.length || "0"} <Microscope size={32} /></p>
                      </CardContent>
                    </Card>
                    <Card className="p-5">
                      <CardHeader>
                        <CardTitle>Denied</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold flex gap-3 items-center">{denied?.length || "0"} <ThumbsDown size={32} /></p>
                      </CardContent>
                    </Card>
                    <Card className="p-5">
                      <CardHeader>
                        <CardTitle>Published</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold flex gap-3 items-center">{published?.length || "0"} <ThumbsUp size={32} /></p>
                      </CardContent>
                    </Card>
                    <Card className="p-5">
                      <CardHeader>
                        <CardTitle>Total</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold flex gap-3 items-center">{allRecipes?.length || "0"} <ThumbsUp size={32} /></p>
                      </CardContent>
                    </Card>
                  </div>

                </div>
              )}
              {page === "pending" && pending && <PendingRecipesPage recipes={pending} />}
              {page === "review" && review && <InReviewRecipesPage recipes={review} />}
              {page === "denied" && denied && <DeniedRecipesPage recipes={denied} />}
              {page === "published" && published && <PublishedRecipesPage recipes={published} />}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
