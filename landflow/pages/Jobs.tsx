// pages/Jobs.tsx
import React, { useState } from "react";
import { CalendarPlus } from "lucide-react";

interface Job {
  id: number;
  title: string;
  client: string;
  date: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([{
    id: 1,
    title: "Lawn Mowing",
    client: "John Doe",
    date: "2025-06-01",
    status: "Scheduled"
  }]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded">
          <CalendarPlus className="w-5 h-5" /> Schedule Job
        </button>
      </div>

      <table className="w-full table-auto border">
        <thead className="bg-blue-100">
          <tr>
            <th className="text-left p-2">Title</th>
            <th className="text-left p-2">Client</th>
            <th className="text-left p-2">Date</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-t">
              <td className="p-2">{job.title}</td>
              <td className="p-2">{job.client}</td>
              <td className="p-2">{job.date}</td>
              <td className="p-2">{job.status}</td>
              <td className="p-2">
                <button className="text-sm text-blue-700 hover:underline mr-2">Edit</button>
                <button className="text-sm text-red-600 hover:underline">Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
