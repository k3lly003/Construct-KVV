"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import 'react-circular-progressbar/dist/styles.module.css';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Task {
  id: number;
  title: string;
  progress: number;
  members: number;
}

const SellerDashboard: NextPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Start the two hours design sprint",
      progress: 43,
      members: 7,
    },
    {
      id: 2,
      title: "Complete the Documentation of Travto app",
      progress: 76,
      members: 2,
    },
    {
      id: 3,
      title: "Do A/B Testing on bench with team memebers",
      progress: 32,
      members: 1,
    },
  ]);

  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Performance",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: "#6EE7B7",
        borderColor: "#6EE7B7",
        tension: 0.4,
      },
      {
        label: "Success",
        data: [20, 35, 45, 30, 60, 70, 55],
        fill: false,
        backgroundColor: "#A78BFA",
        borderColor: "#A78BFA",
        tension: 0.4,
      },
      {
        label: "Innovation",
        data: [80, 70, 65, 90, 75, 85, 60],
        fill: false,
        backgroundColor: "#60A5FA",
        borderColor: "#60A5FA",
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#4B5563" },
        ticks: { color: "#D1D5DB" },
      },
      x: {
        grid: { color: "#4B5563" },
        ticks: { color: "#D1D5DB" },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className=" text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex gap-6">
        <div className="md:col-span-1 lg:col-span-4 space-y-6 w-[70%]">
          {/* Top Section */}
          <div className="bg-gray-900 rounded-lg shadow p-4">
            <div className="flex items-center mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                <Image
                  src="/user1.jpeg"
                  width={64}
                  height={64}
                  alt="User Avatar"
                  // layout="fill"
                  objectFit="cover"
                />
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  in
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Harish Ramachandran</h3>
                <p className="text-sm text-gray-400">UI/UX Designer</p>
                <p className="text-sm text-gray-400">+91 7661875209</p>
                <p className="text-sm text-gray-400">Hyderabad</p>
              </div>
            </div>
            <div className="bg-gray-700 rounded-md p-3 text-sm">
              <p className="flex justify-between items-center">
                <span>
                  Start were you left{" "}
                  <FiChevronRight className="inline-block ml-1" />
                </span>
              </p>
              <p className="text-blue-400">
                complete the two hours design sprint
              </p>
              <div className="flex items-center mt-2">
                <div className="w-6 h-6 rounded-full bg-gray-500 mr-1 flex items-center justify-center text-xs">
                  +7
                </div>
                <span className="text-gray-400">members</span>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-3 mt-3 text-xs">
                Jump to the project
              </button>
            </div>
            <div className="flex justify-between mt-5">
              <div className="bg-gray-500 w-[20%] rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Active goals</span>
                  <FiChevronRight />
                </div>
                <p className="text-xl font-semibold">3</p>
              </div>
              <div className="bg-gray-500 w-[20%] rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <FiChevronRight />
                </div>
                <p className="text-xl font-semibold">40%</p>
              </div>
              <div className="bg-gray-500 w-[20%] rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Completed Task</span>
                  <FiChevronRight />
                </div>
                <p className="text-xl font-semibold">6</p>
              </div>
              <div className="bg-gray-500 w-[20%] rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Due Tasks</span>
                  <FiChevronRight />
                </div>
                <p className="text-xl font-semibold">2</p>
              </div>
            </div>
          </div>
          {/* bottom Section */}
          <div className="md:col-span-2 lg:col-span-5 space-y-6">
            <div className="bg-gray-900 rounded-lg shadow p-4">
              <h2 className="font-semibold mb-4">Complete Due Tasks</h2>
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="bg-gray-700 rounded-md p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-sm">{task.title}</p>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: task.members }).map(
                          (_, index) => (
                            <div
                              key={index}
                              className={`w-5 h-5 rounded-full bg-gray-500 mr-1 flex items-center justify-center text-xs ${
                                index > 2 ? "-ml-2" : ""
                              }`}
                            >
                              {index > 2 ? `+${task.members - 3}` : ""}
                            </div>
                          )
                        )}
                        <span className="text-gray-400 text-xs ml-1">
                          {task.members} members
                        </span>
                      </div>
                    </div>
                    <div className="relative w-12 h-12">
                      <CircularProgressbar
                        value={task.progress}
                        text={`${task.progress}%`}
                        styles={buildStyles({
                          textColor: "#fff",
                          pathColor: "#60A5FA",
                          trailColor: "#4B5563",
                        })}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="lg:col-span-3 space-y-6 w-[30%]">
            <div className="bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
              <div className="relative w-24 h-24 mb-2">
                <CircularProgressbar
                  value={70}
                  text={`70%`}
                  styles={buildStyles({
                    textColor: "#fff",
                    pathColor: "#A78BFA",
                    trailColor: "#4B5563",
                  })}
                />
              </div>
              <span className="text-sm text-yellow-400">Fantastic job</span>
            </div>
            <div className="bg-gray-900  rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Statistics</h3>
                <div className="relative">
                  <button className="text-gray-400 text-sm flex items-center">
                    oct{" "}
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {/* Dropdown can be added here */}
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Performance</span>
                    <span className="text-green-400 text-xs">+21%</span>
                  </div>
                  <div className="h-16">
                    <Line
                      data={{
                        ...lineChartData,
                        datasets: [lineChartData.datasets[0]],
                      }}
                      options={lineChartOptions}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Success</span>
                    <span className="text-purple-400 text-xs">+42%</span>
                  </div>
                  <div className="h-16">
                    <Line
                      data={{
                        ...lineChartData,
                        datasets: [lineChartData.datasets[1]],
                      }}
                      options={lineChartOptions}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Innovation</span>
                    <span className="text-blue-400 text-xs">+12%</span>
                  </div>
                  <div className="h-16">
                    <Line
                      data={{
                        ...lineChartData,
                        datasets: [lineChartData.datasets[2]],
                      }}
                      options={lineChartOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
