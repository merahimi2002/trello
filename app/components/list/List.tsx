"use client"

import { useState } from "react"
import { useBoardStore } from "@/app/store/board.store"
import type { ID } from "@/app/types/board.types"
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import Card from "@/app/components/card/Card"
import "@/app/styles/components/_list.scss"

interface ListProps {
  listId: ID
}

export default function List({ listId }: ListProps) {
  const list = useBoardStore((state) => state.lists[listId])
  const cardIds = useBoardStore((state) => state.lists[listId]?.cardIds ?? [])

  const { updateListTitle, removeList, addCard } = useBoardStore()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(list?.title || "")
  const [newCardTitle, setNewCardTitle] = useState("")

  // Make list draggable (sortable column)
  const {
    attributes,
    listeners,
    setNodeRef: setListRef,
    transition,
    isDragging,
  } = useSortable({ id: listId })

  const listStyle = {
    transition: isDragging
      ? 'transform 0.25s ease-out, opacity 0.25s ease-out'
      : 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
    opacity: isDragging ? 0.8 : 1,
  }

  const handleTitleBlur = () => {
    if (title.trim()) updateListTitle(listId, title.trim())
    setIsEditingTitle(false)
  }

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return
    addCard(listId, newCardTitle.trim())
    setNewCardTitle("")
  }

  if (!list) return null

  return (
    <div
      ref={setListRef}
      style={listStyle}
      className="list"
      {...attributes}
      {...listeners}
    >
      {/* List title */}
      {isEditingTitle ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          onKeyDown={(e) => e.key === "Enter" && handleTitleBlur()}
          autoFocus
          onPointerDown={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="list-title" onClick={() => setIsEditingTitle(true)}>
          {list.title}
        </div>
      )}

      {/* Horizontal cards container */}
      <SortableContext items={cardIds} strategy={horizontalListSortingStrategy}>
        <div className="cards-container">
          {cardIds.map((cardId) => (
            <Card key={cardId} cardId={cardId} />
          ))}
        </div>
      </SortableContext>

      {/* Add new card */}
      <div className="add-card-section">
        <input
          className="new-card-input"
          placeholder="+ Add a card..."
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddCard()}
          onPointerDown={(e) => e.stopPropagation()}
        />
        <button
          className="add-card-btn"
          onClick={handleAddCard}
        >
          + Add Card
        </button>
      </div>

      {/* Delete list button */}
      <button
        className="delete-list-btn"
        onClick={() => removeList(listId)}
      >
        Delete List
      </button>
    </div>
  )
}