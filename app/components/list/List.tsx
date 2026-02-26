"use client"

import { useState } from "react"
import { useBoardStore } from "@/app/store/board.store"
import type { ID } from "@/app/types/board.types"
import "@/app/styles/components/_list.scss"

interface ListProps {
  listId: ID
}

export default function List({ listId }: ListProps) {
  const list = useBoardStore((state) => state.lists[listId])
  const { updateListTitle, removeList, addCard, cards } = useBoardStore()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(list.title)
  const [newCardTitle, setNewCardTitle] = useState("")

  const handleTitleBlur = () => {
    updateListTitle(listId, title)
    setIsEditingTitle(false)
  }

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return
    addCard(listId, newCardTitle.trim())
    setNewCardTitle("")
  }

  return (
    <div className="list">
      {/* Title */}
      {isEditingTitle ? (
        <input
          className="list-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleTitleBlur()
          }}
          autoFocus
        />
      ) : (
        <div className="list-title" onClick={() => setIsEditingTitle(true)}>
          {list.title}
        </div>
      )}

      {/* Cards */}
      <div className="cards flex flex-col gap-2">
        {list.cardIds.map((cardId) => (
          <div key={cardId} className="card">
            {cards[cardId].title}
          </div>
        ))}
      </div>

      {/* Add Card */}
      <input
        className="list-title-input"
        placeholder="New card..."
        value={newCardTitle}
        onChange={(e) => setNewCardTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddCard()
        }}
      />
      <div className="add-card-btn" onClick={handleAddCard}>
        + Add Card
      </div>

      {/* Remove List */}
      <div
        className="add-card-btn mt-2 bg-red-500"
        onClick={() => removeList(listId)}
      >
        Delete List
      </div>
    </div>
  )
}