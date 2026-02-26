"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useBoardStore } from "@/app/store/board.store"
import "@/app/styles/components/_card.scss"

interface CardProps {
  cardId: string
  isOverlay?: boolean
}

export default function Card({ cardId, isOverlay = false }: CardProps) {
  const card = useBoardStore((state) => state.cards[cardId])
  const [open, setOpen] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: cardId,
    disabled: isOverlay,
  })

  if (!card) return null

  const style = isOverlay
    ? {
        transform: "rotate(4deg) scale(1.05)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
      }
    : {
        transform: CSS.Transform.toString(transform),
        transition: transition || "transform 200ms ease",
        opacity: isDragging ? 0.4 : 1, 
      }

  return (
    <div
      ref={!isOverlay ? setNodeRef : undefined}
      style={style}
      className="card"
      {...(!isOverlay ? attributes : {})}
      {...(!isOverlay ? listeners : {})}
      onClick={(e) => {
        if (isDragging) return
        e.stopPropagation()
        setOpen(true)
      }}
    >
      {card.title}
    </div>
  )
}