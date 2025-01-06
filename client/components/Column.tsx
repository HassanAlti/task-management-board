import { Droppable } from "@hello-pangea/dnd";
import { Card } from "./Card";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { ColumnProps } from "@/types";

export const Column = ({ title, cards, id, onAddCard }: ColumnProps) => {
  return (
    <div className="bg-neutral rounded-lg p-3 lg:p-4 w-full lg:w-[32%] flex flex-col min-h-[300px] max-h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        <div className="lg:hidden">
          <Button
            onClick={onAddCard}
            size="sm"
            variant="ghost"
            className="bg-primary hover:bg-primary-hover text-white h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto min-h-[200px] transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-secondary/50" : ""
            }`}
          >
            {cards.map((card, index) => (
              <Card key={card.id} {...card} index={index} tag={card.tag} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <Button
        onClick={onAddCard}
        variant="ghost"
        className="hidden lg:flex bg-primary hover:bg-primary-hover text-white mt-4"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create a card
      </Button>
    </div>
  );
};
