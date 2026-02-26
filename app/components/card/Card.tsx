"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useBoardStore } from "@/app/store/board.store"
import type { ID } from "@/app/types/board.types"
import CardModal from "./CardModal"
import "@/app/styles/components/_card.scss"

interface CardProps {
  cardId: ID
}

export default function Card({ cardId }: CardProps) {
  const card = useBoardStore((state) => state.cards[cardId])
  const [modalOpen, setModalOpen] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cardId })

  const dragStyle = {
    transform: CSS.Transform.toString(transform)
      ? `${CSS.Transform.toString(transform)} rotate(${isDragging ? '2deg' : '0deg'}) scale(${isDragging ? 1.05 : 1})`
      : undefined,
    transition: transition || 'transform 0.18s ease, opacity 0.18s ease, box-shadow 0.18s ease',
  }

  if (!card) return null

  return (
    <>
      <div
        ref={setNodeRef}
        style={dragStyle}
        className={`card ${isDragging ? "card--dragging" : ""}`}
        {...attributes}
        {...listeners}
        onClick={(e) => {
          if (isDragging) return
          e.stopPropagation()
          setModalOpen(true)
        }}
      >
        <div className="card__title">{card.title}</div>

        {card.comments?.length > 0 && (
          <div className="card__comments-count">
            {card.comments.length} comment{card.comments.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {modalOpen && <CardModal cardId={cardId} close={() => setModalOpen(false)} />}
    </>
  )
}