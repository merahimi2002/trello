import { create } from "zustand"
import { persist } from "zustand/middleware"
import { nanoid } from "nanoid"
import type { BoardState, ID } from "@/app/types/board.types"

interface BoardActions {
  updateBoardTitle: (title: string) => void

  addList: (title: string) => void
  updateListTitle: (listId: ID, title: string) => void
  removeList: (listId: ID) => void

  addCard: (listId: ID, title: string) => void
  updateCardTitle: (cardId: ID, title: string) => void
  removeCard: (listId: ID, cardId: ID) => void

  addComment: (cardId: ID, text: string) => void

  setInitialState: (data: BoardState) => void
}

type Store = BoardState & BoardActions

export const useBoardStore = create<Store>()(
  persist(
    (set, get) => ({
      board: {
        id: "board-1",
        title: "Demo Board",
        listIds: [],
      },

      lists: {},
      cards: {},

      updateBoardTitle: (title) =>
        set((state) => ({
          board: { ...state.board, title },
        })),

      addList: (title) =>
        set((state) => {
          const id = nanoid()

          return {
            lists: {
              ...state.lists,
              [id]: { id, title, cardIds: [] },
            },
            board: {
              ...state.board,
              listIds: [...state.board.listIds, id],
            },
          }
        }),

      updateListTitle: (listId, title) =>
        set((state) => ({
          lists: {
            ...state.lists,
            [listId]: { ...state.lists[listId], title },
          },
        })),

      removeList: (listId) =>
        set((state) => {
          const { [listId]: removedList, ...remainingLists } = state.lists

          // remove cards belonging to list
          const updatedCards = { ...state.cards }
          removedList?.cardIds.forEach((cardId) => {
            delete updatedCards[cardId]
          })

          return {
            lists: remainingLists,
            cards: updatedCards,
            board: {
              ...state.board,
              listIds: state.board.listIds.filter(
                (id) => id !== listId
              ),
            },
          }
        }),

      addCard: (listId, title) =>
        set((state) => {
          const id = nanoid()

          return {
            cards: {
              ...state.cards,
              [id]: { id, title, comments: [] },
            },
            lists: {
              ...state.lists,
              [listId]: {
                ...state.lists[listId],
                cardIds: [...state.lists[listId].cardIds, id],
              },
            },
          }
        }),

      updateCardTitle: (cardId, title) =>
        set((state) => ({
          cards: {
            ...state.cards,
            [cardId]: { ...state.cards[cardId], title },
          },
        })),

      removeCard: (listId, cardId) =>
        set((state) => {
          const { [cardId]: _, ...remainingCards } = state.cards

          return {
            cards: remainingCards,
            lists: {
              ...state.lists,
              [listId]: {
                ...state.lists[listId],
                cardIds: state.lists[listId].cardIds.filter(
                  (id) => id !== cardId
                ),
              },
            },
          }
        }),

      addComment: (cardId, text) =>
        set((state) => ({
          cards: {
            ...state.cards,
            [cardId]: {
              ...state.cards[cardId],
              comments: [
                ...state.cards[cardId].comments,
                { id: nanoid(), text, createdAt: Date.now() },
              ],
            },
          },
        })),

      setInitialState: (data: BoardState) =>
        set({
          board: data.board,
          lists: data.lists,
          cards: data.cards,
        }),
    }),
    {
      name: "trello-clone-storage",
    }
  )
)