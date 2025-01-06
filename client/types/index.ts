import { TagFormData } from "@/lib/utils";
import { FieldError } from "react-hook-form";

export interface Tag {
  name: string;
  color: string;
}

export interface TagType {
  id: number;
  name: string;
  color: string;
}

export interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: string | null;
}

export interface AddTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTag: (data: TagFormData) => Promise<void>;
}

export interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
  error?: FieldError;
}

export interface CardType {
  id: number;
  title: string;
  description: string;
  columnId: number;
  column_id: string;
  tagId?: number;
  position?: number;
  tag?: TagType;
}

export interface CardProps extends CardType {
  index: number;
}

export interface ColumnProps {
  title: string;
  cards: CardType[];
  id: string;
  onAddCard: () => void;
}

export interface HistoryLogEntry {
  id: number;
  card_id: number;
  card_title: string;
  action_type: "move_column" | "move_position" | string;
  details: {
    columnId: number;
    sourceColumnId?: number;
    direction?: "up" | "down";
    message: string;
  };
  created_at: string;
  date: string;
  timestamp: string;
}

export interface GroupedLogs {
  date: string;
  actions: Array<{
    message: string;
    timestamp: string;
  }>;
}
