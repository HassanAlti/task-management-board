"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { historyApi } from "@/lib/api";
import { HistoryLogEntry, GroupedLogs } from "@/types";
import {
  formatLogMessage,
  formatDate,
  formatTimestampToTime,
} from "@/lib/utils";
import ReactMarkdown from "react-markdown";

const HistoryLogs = () => {
  const [groupedLogs, setGroupedLogs] = useState<GroupedLogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const logs: HistoryLogEntry[] = await historyApi.getAll();

        const groupedByDate = logs.reduce(
          (
            groups: {
              [key: string]: Array<{ message: string; timestamp: string }>;
            },
            log
          ) => {
            const formattedMessage = formatLogMessage(log);
            if (!groups[log.date]) {
              groups[log.date] = [];
            }
            groups[log.date].push({
              message: formattedMessage,
              timestamp: log.created_at,
            });
            return groups;
          },
          {}
        );

        const sortedGroups = Object.entries(groupedByDate)
          .map(([date, actions]) => ({
            date: formatDate(date),
            actions,
          }))
          .sort((a, b) => {
            if (a.date === "Today") return -1;
            if (b.date === "Today") return 1;
            if (a.date === "Yesterday") return -1;
            if (b.date === "Yesterday") return 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });

        setGroupedLogs(sortedGroups);
      } catch (err) {
        setError("Failed to load history logs");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-primary mb-6">History Logs</h1>
        <div className="space-y-6">
          {groupedLogs.map((log, index) => (
            <Card key={index} className="p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">
                {log.date}
              </h2>
              <ul className="space-y-2">
                {log.actions.map((action, actionIndex) => (
                  <li
                    key={actionIndex}
                    className="text-gray-600 border-l-4 border-tertiary pl-4 py-3"
                  >
                    <div className="flex justify-between items-start">
                      <ReactMarkdown className="prose">
                        {action.message}
                      </ReactMarkdown>
                      <span className="text-sm text-gray-400 ml-4">
                        {formatTimestampToTime(action.timestamp)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryLogs;
