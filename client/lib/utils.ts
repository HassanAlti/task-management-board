import { HistoryLogEntry } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//card schema
export const cardSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
  tagId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return typeof val === "string" ? parseInt(val, 10) : val;
    }),
});

export type CardFormData = z.infer<typeof cardSchema>;

// Tag Schema
export const tagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(20, "Tag name must be less than 20 characters"),
  color: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Please enter a valid color hex"
    ),
});

export type TagFormData = z.infer<typeof tagSchema>;

// Column helper functions

export const getColumnName = (
  columnId: string | number | undefined
): "backlog" | "todo" | "done" => {
  if (!columnId) {
    console.warn("No column ID provided");
    return "backlog";
  }

  const numColumnId =
    typeof columnId === "string" ? parseInt(columnId, 10) : columnId;

  switch (numColumnId) {
    case 1:
      return "backlog";
    case 2:
      return "todo";
    case 3:
      return "done";
    default:
      console.warn(`Invalid column ID: ${columnId}, defaulting to backlog`);
      return "backlog";
  }
};

export const getColumnId = (columnName: string): number => {
  switch (columnName) {
    case "backlog":
      return 1;
    case "todo":
      return 2;
    case "done":
      return 3;
    default:
      throw new Error("Invalid column name");
  }
};

// formatters for showing history nicely

export const formatLogMessage = (log: HistoryLogEntry): string => {
  const cardTitle = `**${log.card_title}**`;

  switch (log.action_type) {
    case "move_column":
      return `Moved ${cardTitle} from **${getColumnName(
        log.details.sourceColumnId
      ).toUpperCase()}** to **${getColumnName(
        log.details.columnId
      ).toUpperCase()}**`;

    case "move_position": {
      const direction = log.details.direction;
      return `Moved ${cardTitle} ${direction} in **${getColumnName(
        log.details.columnId
      ).toUpperCase()}**`;
    }

    case "create":
      return `Created ${cardTitle}`;

    default:
      return `Action performed on ${cardTitle}`;
  }
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split("T")[0]) {
    return "Today";
  } else if (dateStr === yesterday.toISOString().split("T")[0]) {
    return "Yesterday";
  }
  return new Date(dateStr).toLocaleDateString();
};

export const formatTimestampToTime = (timestamp: string) => {
  const date = new Date(timestamp); // Parse the UTC timestamp
  return date.toLocaleString(undefined, {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // User's local timezone
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
