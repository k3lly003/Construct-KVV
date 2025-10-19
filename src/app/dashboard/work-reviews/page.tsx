"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";

function Page() {
  const avgRating = 0;
  const totalReviews = 0;
  const comments = [
    {
      id: "1",
      user: "Alex Johnson",
      avatar: "/user1.jpeg",
      rating: 0,
      comment: "No reviews yet. Your first feedback will appear here.",
      date: "—",
    },
    {
      id: "2",
      user: "Jamie Lee",
      avatar: "/user2.jpeg",
      rating: 0,
      comment: "Be the first to rate this technician's work.",
      date: "—",
    },
  ];

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: 0,
  }));

  return (
    <div className="min-h-[calc(100dvh-80px)] w-full">
      <div className="from-amber-400 to-amber-600 relative isolate mb-8 w-full bg-gradient-to-r py-10 text-amber-50">
        <div className="mx-auto w-full max-w-6xl px-4">
          <h1 className="text-balance text-2xl font-semibold md:text-3xl">
            Technician Work Reviews
          </h1>
          <p className="text-amber-100/90 mt-2 max-w-2xl text-sm md:text-base">
            View ratings, reviews, and comments left by your clients. Keep track
            of your performance and build trust.
          </p>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Average Rating
            </CardTitle>
            <CardDescription className="sr-only">
              Overall average based on all reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold text-amber-600">
                  {avgRating.toFixed(1)}
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  out of 5
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      "h-5 w-5 " +
                      (i < avgRating
                        ? "fill-amber-500 text-amber-500"
                        : "text-amber-300")
                    }
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-600">
              {totalReviews}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              reviews received
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground grid list-disc gap-2 pl-4 text-sm">
              <li>
                No reviews yet — invite your recent clients to leave feedback.
              </li>
              <li>Share your profile link to collect ratings faster.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto mt-6 grid w-full max-w-6xl grid-cols-1 gap-6 px-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Rating Distribution</CardTitle>
            <CardDescription>Breakdown of all review stars</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {ratingDistribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: row.stars }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <div className="bg-amber-100/70 relative h-2 flex-1 overflow-hidden rounded">
                    <div className="bg-amber-500 h-full w-0" />
                  </div>
                  <div className="text-muted-foreground w-10 text-right text-sm">
                    {row.count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">User Reviews</CardTitle>
            <CardDescription>
              Comments and feedback from clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[420px] pr-2">
              <div className="flex flex-col gap-4">
                {comments.map((r) => (
                  <div
                    key={r.id}
                    className="border-muted/60 hover:bg-amber-50/50 rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="size-10">
                        <AvatarImage src={r.avatar} alt={r.user} />
                        <AvatarFallback>
                          {r.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-medium">{r.user}</div>
                          <div className="text-muted-foreground text-xs">
                            {r.date}
                          </div>
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={
                                "h-4 w-4 " +
                                (i < r.rating
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-amber-300")
                              }
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground mt-2 text-sm">
                          {r.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Page;
