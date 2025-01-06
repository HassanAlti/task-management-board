"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tagSchema, TagFormData } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { BaseModal } from "./BaseModal";
import { FormField } from "./FormField";
import { AddTagModalProps } from "@/types";
import { useState } from "react";

export const AddTagModal = ({
  isOpen,
  onClose,
  onAddTag,
}: AddTagModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      color: "#22c55e",
    },
  });

  const onSubmit = async (data: TagFormData) => {
    try {
      setIsSubmitting(true);
      await onAddTag(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating tag:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Tag"
      onSubmit={handleSubmit(onSubmit)}
      submitButtonText="Create Tag"
    >
      <form className="space-y-4">
        <FormField label="Tag Name" required error={errors.name}>
          <Input
            placeholder="Enter tag name"
            {...register("name")}
            className="border-secondary focus:border-primary"
            disabled={isSubmitting}
          />
        </FormField>

        <FormField label="Tag Color" required error={errors.color}>
          <div className="flex items-center gap-4">
            <Input
              type="color"
              {...register("color")}
              className="w-20 h-10 p-1 border-secondary focus:border-primary"
              disabled={isSubmitting}
            />
            <div
              className="w-10 h-10 rounded border border-secondary"
              style={{ backgroundColor: watch("color") }}
            />
          </div>
        </FormField>
      </form>
    </BaseModal>
  );
};
