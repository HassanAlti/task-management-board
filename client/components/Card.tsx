import { CardProps } from "@/types";
import { Draggable } from "@hello-pangea/dnd";

export const Card = ({ id, title, description, index, tag }: CardProps) => {
  return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-tertiary py-4 px-3 sm:p-4 rounded-lg mb-4 shadow-md 
            touch-manipulation select-none
            active:shadow-lg active:scale-[1.02]
            hover:shadow-lg transition-all duration-200
            ${snapshot.isDragging ? "rotate-3 scale-105 shadow-lg" : ""}`}
        >
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="font-semibold text-gray-800 flex-1 text-sm sm:text-base">
              {title}
            </h3>
            {tag && (
              <div
                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                style={{
                  color: tag.color,
                  backgroundColor: `${tag.color}30`,
                }}
              >
                <div
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </div>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">
            {description}
          </p>
        </div>
      )}
    </Draggable>
  );
};
