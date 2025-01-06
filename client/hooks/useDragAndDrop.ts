import { DropResult } from "@hello-pangea/dnd";
import { CardType } from "@/types";
import { cardsApi } from "@/lib/api";
import { toast } from "sonner";
import { getColumnId } from "@/lib/utils";

export const useDragAndDrop = (
  cards: { [key: string]: CardType[] },
  setCards: Function
) => {
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // if there's no destination or if the card was dropped in the same spot, do nothing
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    const destinationColumnId = getColumnId(destination.droppableId);
    const sourceColumnName = source.droppableId;
    const destinationColumnName = destination.droppableId;
    const sourceColumnId = getColumnId(sourceColumnName);
    const isSameColumn = sourceColumnName === destinationColumnName;

    const previousCards = JSON.parse(JSON.stringify(cards));

    try {
      // optimistic update, then we revert on failure
      setCards((prev: any) => {
        const newCards = { ...prev };
        const sourceColumn = [...prev[sourceColumnName]];
        const destColumn = isSameColumn
          ? sourceColumn
          : [...prev[destinationColumnName]];
        const [movedCard] = sourceColumn.splice(source.index, 1);

        if (isSameColumn) {
          destColumn.splice(destination.index, 0, {
            ...movedCard,
            position: destination.index,
          });
          destColumn.forEach((card, index) => {
            card.position = index;
          });
        } else {
          destColumn.splice(destination.index, 0, {
            ...movedCard,
            columnId: destinationColumnId,
            column_id: destinationColumnId.toString(),
            position: destination.index,
          });

          sourceColumn.forEach((card, index) => {
            card.position = index;
          });
          destColumn.forEach((card, index) => {
            card.position = index;
          });
        }

        return {
          ...newCards,
          [sourceColumnName]: sourceColumn,
          [destinationColumnName]: destColumn,
        };
      });

      const movedCard = cards[sourceColumnName].find(
        (card) => card.id.toString() === draggableId
      );

      await cardsApi.updatePosition(
        draggableId,
        destination.index,
        source.index,
        destinationColumnId,
        sourceColumnId
      );

      if (!isSameColumn) {
        toast.success(
          `Moved "${
            movedCard?.title
          }" from ${sourceColumnName.toUpperCase()} to ${destinationColumnName.toUpperCase()}`
        );
      } else if (source.index !== destination.index) {
        const direction = destination.index > source.index ? "down" : "up";
        toast.success(
          `Moved "${
            movedCard?.title
          }" ${direction} in ${sourceColumnName.toUpperCase()}`
        );
      }
    } catch (error) {
      console.error("Error updating card position:", error);
      toast.error(`Error moving Card`);
      setCards(previousCards);
    }
  };

  return { handleDragEnd };
};
