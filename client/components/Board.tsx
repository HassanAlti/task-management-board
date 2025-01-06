"use client";

import { DragDropContext } from "@hello-pangea/dnd";
import { Column } from "./Column";
import { useState, useEffect } from "react";
import { TagType } from "@/types";
import { AddCardModal } from "./AddCardModal";
import { cardsApi, tagsApi } from "@/lib/api";
import { useCards } from "@/hooks/useCards";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { toast } from "sonner";

export type ColumnId = "backlog" | "todo" | "done";

export const Board = () => {
  const { cards, setCards, organizeCards, addCard } = useCards();
  const { handleDragEnd } = useDragAndDrop(cards, setCards);

  const [tags, setTags] = useState<TagType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cardsData, tagsData] = await Promise.all([
          cardsApi.getAll(),
          tagsApi.getAll(),
        ]);

        setCards(organizeCards(cardsData));
        setTags(tagsData);
      } catch (error) {
        toast.error("Error retrieving Items at this moment");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full lg:h-[80vh] max-w-7xl mx-auto px-2 lg:px-4 mt-6 overflow-hidden">
        <div className="bg-transparent border-2 border-primary rounded-lg p-2 mb-4 lg:p-4 h-full">
          <div className="flex flex-col items-center lg:items-stretch lg:flex-row lg:justify-between gap-4 lg:gap-6 p-2 lg:p-4 h-full overflow-y-auto">
            {["backlog", "todo", "done"].map((columnId) => (
              <Column
                key={columnId}
                title={columnId.charAt(0).toUpperCase() + columnId.slice(1)}
                id={columnId}
                cards={cards[columnId as "backlog" | "todo" | "done"]}
                onAddCard={() => {
                  setActiveColumn(columnId);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveColumn(null);
        }}
        columnId={activeColumn}
        tags={tags}
        setTags={setTags}
        onAddCard={async (data) => {
          if (!activeColumn) return;
          await addCard(data, activeColumn);
        }}
      />
    </DragDropContext>
  );
};
