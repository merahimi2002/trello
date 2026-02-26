import type { BoardState } from "@/app/types/board.types"

export const initialData: BoardState = {
  board: {
    id: "board-1",
    title: "Demo Board",
    listIds: ["list-1", "list-2", "list-3"],
  },
  lists: {
    "list-1": { id: "list-1", title: "Todo", cardIds: ["card-1", "card-2"] },
    "list-2": { id: "list-2", title: "In Progress", cardIds: ["card-3"] },
    "list-3": { id: "list-3", title: "Done", cardIds: ["card-4"] },
  },
  cards: {
    "card-1": { id: "card-1", title: "Set up project", comments: [] },
    "card-2": { id: "card-2", title: "Create Board component", comments: [] },
    "card-3": { id: "card-3", title: "Implement List component", comments: [] },
  },
}