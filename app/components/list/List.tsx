"use client"

import { useState } from "react"
import { useBoardStore } from "@/app/store/board.store"
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Card from "@/app/components/card/Card"
import "@/app/styles/components/_list.scss"
import { MdDeleteForever } from "react-icons/md"
import { FaPen } from "react-icons/fa"

interface ListProps {
  listId: string
}

export default function List({ listId }: ListProps) {
  const list = useBoardStore((s) => s.lists[listId])
  const { updateListTitle, removeList, addCard } = useBoardStore()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(list?.title || "")
  const [newCardTitle, setNewCardTitle] = useState("")

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: listId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    boxShadow: isDragging ? "0 12px 30px rgba(0,0,0,0.2)" : undefined,
    opacity: isDragging ? 0.85 : 1,
  }

  if (!list) return null

  return (
    <div ref={setNodeRef} style={style} className="list">
      
      {/* Drag Handle Area */}
      <div
        className="list-header"
        {...attributes}
        {...listeners}
      >
        {isEditingTitle ? (
          <input
            className="list-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              if (title.trim()) {
                updateListTitle(listId, title.trim())
              }
              setIsEditingTitle(false)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateListTitle(listId, title.trim())
                setIsEditingTitle(false)
              }
            }}
            autoFocus
          />
        ) : (
          <h3
            className="list-title"
            onClick={(e) => {
              e.stopPropagation() 
              setIsEditingTitle(true)
            }}
          >
            {list.title}
          </h3>
        )}
      </div>

      {/* Cards */}
      <SortableContext
        items={list.cardIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="list-cards">
          {list.cardIds.map((cardId) => (
            <Card key={cardId} cardId={cardId} />
          ))}
        </div>
      </SortableContext>

      {/* Add Card Section */}
      <div className="add-card">
        <input
          placeholder="+ Add a card..."
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newCardTitle.trim()) {
              addCard(listId, newCardTitle.trim())
              setNewCardTitle("")
            }
          }}
        />
        <button
          onClick={() => {
            if (!newCardTitle.trim()) return
            addCard(listId, newCardTitle.trim())
            setNewCardTitle("")
          }}
        >
          <FaPen size={10} /> Add Card
        </button>
      </div>

      {/* Delete List */}
      <button
        className="delete-list"
        onClick={() => removeList(listId)}
      >
       <MdDeleteForever size={15} />  Delete List
      </button>
    </div>
  )
}