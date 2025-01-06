"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitButtonText?: string;
}

export const BaseModal = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitButtonText = "Submit",
}: BaseModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          {children}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="hover:bg-tertiary"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              className="bg-primary hover:bg-primary-hover text-white"
            >
              {submitButtonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
