import { useState } from "react";
import { CardType, TagType } from "@/types";
import { cardsApi } from "@/lib/api";
import { CardFormData } from "@/lib/utils";
import { toast } from "sonner";
import { getColumnName, getColumnId } from "@/lib/utils";

type ColumnName = "backlog" | "todo" | "done";
type OrganizedCards = Record<ColumnName, CardType[]>;

export const useCards = () => {
  const [cards, setCards] = useState<OrganizedCards>({
    backlog: [],
    todo: [],
    done: [],
  });

  const organizeCards = (cardsData: CardType[]) => {
    const organizedCards: OrganizedCards = {
      backlog: [],
      todo: [],
      done: [],
    };

    cardsData.forEach((card: CardType) => {
      try {
        const columnName = getColumnName(card.column_id);
        organizedCards[columnName].push({
          ...card,
          columnId: parseInt(card.column_id, 10),
          tag: card.tag,
        });
      } catch (error) {
        console.error(`Error processing card ${card.id}:`, error);
        organizedCards.backlog.push(card);
      }
    });

    // sort cards by position
    Object.keys(organizedCards).forEach((columnName) => {
      organizedCards[columnName as ColumnName].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      );
    });

    return organizedCards;
  };

  const addCard = async (data: CardFormData, columnName: string) => {
    try {
      const columnId = getColumnId(columnName);
      const cardData = {
        title: data.title,
        description: data.description,
        columnId,
        tagId: data.tagId,
      };

      const response = await cardsApi.create(cardData);
      toast.success(`Card ${cardData.title} created successfully!`);

      setCards((prev) => ({
        ...prev,
        [columnName]: [...prev[columnName as ColumnName], response],
      }));

      return response;
    } catch (error) {
      console.error("Error creating card:", error);
      toast.error(`Failed Creating Card, Try Again Later`);
      throw error;
    }
  };

  return {
    cards,
    setCards,
    organizeCards,
    addCard,
  };
};
