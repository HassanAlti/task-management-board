import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardFormData, cardSchema } from "@/lib/utils";
import { TagType } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { BaseModal } from "./BaseModal";
import { FormField } from "./FormField";
import { AddTagModal } from "./AddTagModal";
import { Dispatch, SetStateAction, useState } from "react";
import { tagsApi } from "@/lib/api";
import { toast } from "sonner";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: string | null;
  tags: TagType[];
  onAddCard: (data: CardFormData) => Promise<void>;
  setTags: Dispatch<SetStateAction<TagType[]>>;
}

export const AddCardModal = ({
  isOpen,
  onClose,
  columnId,
  tags,
  onAddCard,
  setTags,
}: AddCardModalProps) => {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      title: "",
      description: "",
      tagId: undefined,
    },
  });

  const onSubmit = async (data: CardFormData) => {
    try {
      if (!columnId) {
        throw new Error("Column ID is required");
      }

      const formData = {
        title: data.title,
        description: data.description,
        tagId: data.tagId,
      };

      await onAddCard(formData);
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  const handleAddTag = async (tagData: { name: string; color: string }) => {
    try {
      const tag = await tagsApi.create(tagData);
      toast.success("Tag created successfully!");
      setTags((prev) => [...prev, tag]);
      setIsTagModalOpen(false);
    } catch (error) {
      toast.error("Failed to create tag. Please try again.");
      console.error("Error creating tag:", error);
    }
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={() => {
          reset();
          onClose();
        }}
        title="Add New Card"
        onSubmit={handleSubmit(onSubmit)}
        submitButtonText="Create Card"
      >
        <form className="space-y-4">
          <FormField label="Title" required error={errors.title}>
            <Input
              placeholder="Enter card title"
              {...register("title")}
              className="border-secondary focus:border-primary"
            />
          </FormField>

          <FormField label="Description" required error={errors.description}>
            <Textarea
              placeholder="Enter card description"
              {...register("description")}
              className="border-secondary focus:border-primary min-h-[100px]"
            />
          </FormField>

          <FormField label="Tag (Optional)">
            <Select
              value={watch("tagId")?.toString() || ""}
              onValueChange={(value) => {
                setValue("tagId", parseInt(value));
              }}
            >
              <SelectTrigger className="w-full border-secondary focus:border-primary">
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent className="bg-neutral">
                {tags.map((t) => (
                  <SelectItem
                    key={t.id}
                    value={t.id.toString()}
                    className="hover:bg-tertiary flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
                      <span style={{ color: t.color }}>{t.name}</span>
                    </div>
                  </SelectItem>
                ))}
                <div
                  className="flex items-center gap-2 text-primary hover:bg-tertiary cursor-pointer px-2 py-1.5 border-t border-secondary mt-2 pt-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsTagModalOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Create New Tag
                </div>
              </SelectContent>
            </Select>
          </FormField>
        </form>
      </BaseModal>

      <AddTagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onAddTag={handleAddTag}
      />
    </>
  );
};
