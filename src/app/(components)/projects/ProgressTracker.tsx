import React, { useEffect } from "react";
import {
  useProjectBudget,
  useProjectMilestones,
  useProjectTimeline,
} from "@/app/hooks/useProjectBudget";
import { PlayCircle, Flag } from "lucide-react";

const currencyFormat = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);

// Gradient color list for milestones
const gradients = [
  "bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400",
  "bg-gradient-to-r from-amber-500 via-lime-400 to-green-400",
  "bg-gradient-to-r from-amber-600 via-pink-400 to-red-400",
  "bg-gradient-to-r from-amber-400 via-blue-400 to-purple-400",
];

interface ProgressTrackerProps {
  projectId: string;
}

type MilestoneKey = "foundation" | "roofing" | "finishing";
const milestoneKeys: MilestoneKey[] = ["foundation", "roofing", "finishing"];

const ProgressTracker = ({ projectId }: ProgressTrackerProps) => {
  // Logging the incoming projectId
  useEffect(() => {
    console.log("[ProgressTracker] projectId prop:", projectId);
  }, [projectId]);

  // Get budget, expenses from API
  const { data, loading, error } = useProjectBudget(projectId);
  // Get milestones from API
  const {
    milestones,
    loading: milestonesLoading,
    error: milestonesError,
  } = useProjectMilestones(projectId);
  // Get timeline from API
  const {
    timeline,
    loading: timelineLoading,
    error: timelineError,
  } = useProjectTimeline(projectId);

  // Log API call result
  useEffect(() => {
    console.log("[ProgressTracker] Loading:", loading);
    if (data) {
      console.log("[ProgressTracker] API Data:", data);
    }
    if (error) {
      console.error("[ProgressTracker] API Error:", error);
    }
    if (milestones) {
      console.log("[ProgressTracker] Milestones Data:", milestones);
    }
    if (milestonesError) {
      console.error("[ProgressTracker] Milestones Error:", milestonesError);
    }
    if (timeline) {
      console.log("[ProgressTracker] Timeline Data:", timeline);
    }
    if (timelineError) {
      console.error("[ProgressTracker] Timeline Error:", timelineError);
    }
  }, [
    loading,
    data,
    error,
    milestones,
    milestonesError,
    timeline,
    timelineError,
  ]);

  // If loading or error, handle accordingly
  if (loading) {
    return (
      <div className="bg-white border-2 border-amber-500 rounded-2xl p-6 shadow-xl mt-6">
        <div className="text-amber-600">Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white border-2 border-amber-500 rounded-2xl p-6 shadow-xl mt-6">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  // If data is not available, show nothing or you can render a fallback
  if (!data) {
    console.log("[ProgressTracker] No data returned from API.");
    return null;
  }

  const budget = {
    total: data.totalBudget,
    spent: data.totalSpent,
    currency: "RWF", // Hardcoded, or retrieve from API if available
  };
  const expenses = data.expenses.map((e) => ({
    amount: e.expenseAmount,
    description: e.description,
    stage: e.stage,
    createdAt: e.createdAt,
  }));

  const percentUsed =
    budget.total > 0 ? Math.round((budget.spent / budget.total) * 100) : 0;
  const remaining = budget.total - budget.spent;

  return (
    <div className="mt-6 flex flex-col gap-8">
      {/* Budget Tracker */}
      <div className="bg-white border-2 border-amber-500 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col">
        <h4 className="font-bold text-amber-600 mb-2 text-lg flex items-center gap-2">
          <span>Budget Tracker</span>
          <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
            Detailed
          </span>
        </h4>
        <div className="mb-2 flex flex-col xs:flex-row justify-between text-base font-medium gap-1 xs:gap-0">
          <span>Total Budget:</span>
          <span className="text-amber-700 text-right xs:text-left">
            {currencyFormat(budget.total, budget.currency)}
          </span>
        </div>
        <div className="mb-2 flex flex-col xs:flex-row justify-between text-base font-medium gap-1 xs:gap-0">
          <span>Spent:</span>
          <span className="text-amber-700 text-right xs:text-left">
            {currencyFormat(budget.spent, budget.currency)}
          </span>
        </div>
        <div className="mb-2 flex flex-col xs:flex-row justify-between text-base font-medium gap-1 xs:gap-0">
          <span>Remaining:</span>
          <span className="text-amber-700 text-right xs:text-left">
            {currencyFormat(remaining, budget.currency)}
          </span>
        </div>
        <div className="w-full bg-amber-100 rounded-full h-3 mt-2 mb-4">
          <div
            className="bg-gradient-to-r from-amber-500 to-yellow-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentUsed}%` }}
          />
        </div>
        <div className="text-xs text-right text-amber-600 mb-4">
          {percentUsed}% used
        </div>
        <div className="flex-1">
          <h5 className="font-semibold text-amber-700 mb-2 text-sm">
            Expense Breakdown
          </h5>
          {expenses.length === 0 ? (
            <div className="text-amber-400 px-2 py-1">
              There is no expense made yet.
            </div>
          ) : (
            <ul className="divide-y divide-amber-100">
              {expenses.map((exp, idx) => (
                <li
                  key={idx}
                  className="py-2 flex flex-col sm:flex-row sm:items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                    <span className="font-medium text-amber-900">
                      {currencyFormat(exp.amount, budget.currency)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center flex-1">
                    <span className="text-gray-600 flex-1">
                      {exp.description}
                      <span className="ml-2 text-xs text-amber-500 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
                        {exp.stage}
                      </span>
                      <span className="ml-2 text-xs text-gray-400 block sm:inline">
                        {exp.createdAt
                          ? new Date(exp.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Milestone Progress */}
      <div className="bg-white border-2 border-amber-500 rounded-2xl p-6 shadow-xl">
        <h4 className="font-bold text-amber-600 mb-2 text-lg">
          Milestone Progress
        </h4>
        {milestonesLoading ? (
          <div className="text-amber-600">Loading milestones...</div>
        ) : milestonesError ? (
          <div className="text-red-500">Error: {milestonesError}</div>
        ) : (
          <>
            {milestoneKeys.map((key, i) => (
              <div className="mb-5" key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-amber-800">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      milestones[key] === 100
                        ? "bg-green-100 text-green-700"
                        : milestones[key] > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {milestones[key] === 100
                      ? "Completed"
                      : milestones[key] > 0
                      ? "In Progress"
                      : "Pending"}
                  </span>
                </div>
                <div className="w-full bg-amber-100 rounded-full h-3 shadow-inner">
                  <div
                    className={`${
                      gradients[i % gradients.length]
                    } h-3 rounded-full transition-all duration-700 shadow-lg`}
                    style={{ width: `${milestones[key]}%` }}
                  />
                </div>
                <div className="text-xs text-right text-amber-500 mt-1">
                  {milestones[key]}%
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Project Timeline */}
      <div className="bg-white border-2 border-amber-500 rounded-2xl p-6 shadow-xl">
        <h4 className="font-bold text-amber-600 mb-2 text-lg">
          Project Timeline
        </h4>
        {timelineLoading ? (
          <div className="text-amber-600">Loading timeline...</div>
        ) : timelineError ? (
          <div className="text-red-500">Error: {timelineError}</div>
        ) : (
          <ul className="text-sm space-y-4">
            <li className="flex items-center gap-3">
              <PlayCircle className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-amber-700">Start Date:</span>
              <span className="text-gray-700">
                {timeline.startedAt ? (
                  new Date(timeline.startedAt).toLocaleDateString()
                ) : (
                  <span className="italic text-gray-400">not yet set</span>
                )}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Flag className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-amber-700">End Date:</span>
              <span className="text-gray-700">
                {timeline.endedAt ? (
                  new Date(timeline.endedAt).toLocaleDateString()
                ) : (
                  <span className="italic text-gray-400">not yet set</span>
                )}
              </span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
