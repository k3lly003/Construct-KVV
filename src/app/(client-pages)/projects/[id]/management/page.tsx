"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getBudgetByProjectId,
  PMBudgetSummary,
  getMilestonesByProjectId,
  PMMilestone,
  getTimelinesByProjectId,
  PMTimeline,
} from "@/app/services/ProjectManagementServices";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function ProjectManagementPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [budget, setBudget] = useState<PMBudgetSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<PMMilestone[] | null>(null);
  const [timelines, setTimelines] = useState<PMTimeline[] | null>(null);

  useEffect(() => {
    async function bootstrap() {
      try {
        setIsBootstrapping(true);
        setError(null);
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;
        if (!token) throw new Error("No auth token");
        const [budgetRes, milestoneRes, timelineRes] = await Promise.all([
          getBudgetByProjectId(token, projectId),
          getMilestonesByProjectId(token, projectId),
          getTimelinesByProjectId(token, projectId),
        ]);
        setBudget(budgetRes);
        setMilestones(milestoneRes);
        setTimelines(timelineRes);
      } catch (e: any) {
        setError(e?.message || "Failed to load budget");
      } finally {
        setIsBootstrapping(false);
      }
    }
    bootstrap();
  }, [projectId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 p-[1px]">
              <div className="bg-card p-6 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-2 rounded-full bg-amber-500" />
                  <div>
                    <h1 className="text-title font-semibold">
                      Project Workspace
                    </h1>
                    <p className="text-muted-foreground text-small">
                      Managing project {projectId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isBootstrapping ? (
          <Card>
            <CardHeader>
              <CardTitle>Loading workspace…</CardTitle>
              <CardDescription>Fetching project resources…</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-full rounded bg-amber-100 overflow-hidden">
                <div className="h-2 w-1/2 rounded bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:gap-6">
            <Card className="border-amber-100 shadow-sm md:shadow min-h-[400px] sm:min-h-[500px] md:min-h-[550px]">
              <CardHeader>
                <CardTitle className="text-base sm:text-mid font-semibold">
                  Budget Overview
                </CardTitle>
                <CardDescription className="text-small sm:text-base">
                  Visual summary of spent vs remaining and recent expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!budget ? (
                  <div className="text-small sm:text-base text-muted-foreground">
                    No budget data found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="h-56 sm:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <defs>
                              <linearGradient
                                id="spentGradient"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="1"
                              >
                                <stop offset="0%" stopColor="#f59e0b" />
                                <stop offset="50%" stopColor="#fbbf24" />
                                <stop offset="100%" stopColor="#d97706" />
                              </linearGradient>
                            </defs>
                            <Pie
                              dataKey="value"
                              data={[
                                { name: "Spent", value: budget.totalSpent },
                                {
                                  name: "Remaining",
                                  value: Math.max(0, budget.remaining),
                                },
                              ]}
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={2}
                              stroke="#fff"
                            >
                              <Cell fill="url(#spentGradient)" />
                              <Cell fill="#FCD34D" />
                            </Pie>
                            <Legend verticalAlign="bottom" height={24} />
                            <Tooltip
                              formatter={(v: any) =>
                                `${Number(v).toLocaleString()}`
                              }
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-small sm:text-base">
                        <div>
                          <div className="text-muted-foreground">Total</div>
                          <div className="font-semibold text-base sm:text-mid break-words">
                            {budget.totalBudget.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Spent</div>
                          <div className="font-semibold text-base sm:text-mid break-words">
                            {budget.totalSpent.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Remaining</div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-semibold text-base sm:text-mid break-words ${
                                budget.remaining < 0 ? "text-amber-800" : ""
                              }`}
                            >
                              {budget.remaining.toLocaleString()}
                            </span>
                            {budget.remaining < 0 ? (
                              <Badge variant="secondary">Overspent</Badge>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="space-y-3 max-h-[38vh] sm:max-h-72 md:max-h-80 overflow-y-auto pr-1"
                      aria-label="Expenses summary list"
                    >
                      {budget.expenses
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        )
                        .map((e) => (
                          <div
                            key={e.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-small sm:text-base"
                          >
                            <div className="flex flex-wrap items-center gap-2 text-small sm:text-base">
                              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                              <span className="font-medium break-words">
                                {e.description}
                              </span>
                              <span className="text-muted-foreground">
                                ({e.stage})
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span className="text-muted-foreground">
                                {new Date(e.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="font-semibold text-base sm:text-mid sm:text-right">
                              {e.expenseAmount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-amber-100 shadow-sm md:shadow">
              <CardHeader>
                <CardTitle className="text-base sm:text-mid font-semibold">
                  Milestones
                </CardTitle>
                <CardDescription className="text-small sm:text-base">
                  Progress across key phases (percentage complete)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!milestones || milestones.length === 0 ? (
                  <div className="text-small sm:text-base text-muted-foreground">
                    No milestones available.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-56 sm:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: "Foundation",
                              value: milestones
                                .slice()
                                .sort(
                                  (a, b) =>
                                    new Date(b.updatedAt).getTime() -
                                    new Date(a.updatedAt).getTime()
                                )[0].foundation,
                            },
                            {
                              name: "Roofing",
                              value: milestones
                                .slice()
                                .sort(
                                  (a, b) =>
                                    new Date(b.updatedAt).getTime() -
                                    new Date(a.updatedAt).getTime()
                                )[0].roofing,
                            },
                            {
                              name: "Finishing",
                              value: milestones
                                .slice()
                                .sort(
                                  (a, b) =>
                                    new Date(b.updatedAt).getTime() -
                                    new Date(a.updatedAt).getTime()
                                )[0].finishing,
                            },
                          ]}
                          layout="vertical"
                          margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
                        >
                          <defs>
                            <linearGradient
                              id="milestoneGradient"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="0"
                            >
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="100%" stopColor="#f59e0b" />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                          />
                          <XAxis
                            type="number"
                            tickFormatter={(v) => `${v}%`}
                            domain={[0, 100]}
                          />
                          <YAxis type="category" dataKey="name" width={90} />
                          <Tooltip formatter={(v: any) => `${v}%`} />
                          <Bar
                            dataKey="value"
                            fill="url(#milestoneGradient)"
                            radius={[6, 6, 6, 6]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      <div className="text-small text-muted-foreground">
                        Latest update:{" "}
                        {new Date(
                          milestones
                            .slice()
                            .sort(
                              (a, b) =>
                                new Date(b.updatedAt).getTime() -
                                new Date(a.updatedAt).getTime()
                            )[0].updatedAt
                        ).toLocaleString()}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-small sm:text-base">
                        <div>
                          <div className="text-muted-foreground">
                            Foundation
                          </div>
                          <div className="font-semibold">
                            {
                              milestones
                                .slice()
                                .sort(
                                  (a, b) =>
                                    new Date(b.updatedAt).getTime() -
                                    new Date(a.updatedAt).getTime()
                                )[0].foundation
                            }
                            %
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Roofing</div>
                          <div className="font-semibold">
                            {
                              milestones
                                .slice()
                                .sort(
                                  (a, b) =>
                                    new Date(b.updatedAt).getTime() -
                                    new Date(a.updatedAt).getTime()
                                )[0].roofing
                            }
                            %
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Finishing</div>
                          <div className="font-semibold">
                            {
                              milestones
                                .slice()
                                .sort(
                                  (a, b) =>
                                    new Date(b.updatedAt).getTime() -
                                    new Date(a.updatedAt).getTime()
                                )[0].finishing
                            }
                            %
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-amber-100 shadow-sm md:shadow">
              <CardHeader>
                <CardTitle className="text-base sm:text-mid font-semibold">
                  Timeline
                </CardTitle>
                <CardDescription className="text-small sm:text-base">
                  Project duration and key dates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!timelines || timelines.length === 0 ? (
                  <div className="text-small sm:text-base text-muted-foreground">
                    No timeline available.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timelines
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(a.startedAt).getTime() -
                          new Date(b.startedAt).getTime()
                      )
                      .map((t) => {
                        const start = new Date(t.startedAt);
                        const end = new Date(t.endedAt);
                        const totalMs = Math.max(
                          1,
                          end.getTime() - start.getTime()
                        );
                        const elapsedMs = Math.max(
                          0,
                          Math.min(Date.now() - start.getTime(), totalMs)
                        );
                        const pct = Math.round((elapsedMs / totalMs) * 100);
                        return (
                          <div
                            key={t.id}
                            className="rounded-lg border bg-card p-4"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div className="text-small sm:text-base">
                                <div className="text-muted-foreground">
                                  Start
                                </div>
                                <div className="font-semibold">
                                  {start.toLocaleString()}
                                </div>
                              </div>
                              <div className="text-small sm:text-base">
                                <div className="text-muted-foreground">End</div>
                                <div className="font-semibold">
                                  {end.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="h-3 w-full rounded-full bg-amber-100 overflow-hidden">
                                <div
                                  className="h-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"
                                  style={{ width: `${pct}%` }}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                  aria-valuenow={pct}
                                  role="progressbar"
                                />
                              </div>
                              <div className="mt-1 text-small sm:text-small text-muted-foreground">
                                {pct}% elapsed
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
