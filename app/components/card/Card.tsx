"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useBoardStore } from "@/app/store/board.store"
import { FaRegComments } from "react-icons/fa"
import "@/app/styles/components/_card.scss"
import CardModal from "./CardModal"

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

  // Always show the number of comments (even 0)
  const commentCount = card.comments?.length ?? 0

  return (
    <>
      <div
        ref={!isOverlay ? setNodeRef : undefined}
        style={style}
        className={`card ${isDragging ? "dragging" : ""} ${isOverlay ? "overlay-card" : ""}`}
        {...(!isOverlay ? attributes : {})}
        {...(!isOverlay ? listeners : {})}
      >
        {/* Card title – clicking on the title does nothing */}
        <div className="card-title">{card.title}</div>

        {/* Comment icon – only this section is clickable */}
        <div
          className="card-comments-indicator"
          onClick={(e) => {
            e.stopPropagation()
            if (!isDragging && !isOverlay) {
              setOpen(true)
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`View ${commentCount} comments`}
        >
          <span className="comment-icon">
            <FaRegComments />
          </span>
          <span className="comment-count">{commentCount}</span>
        </div>
      </div>

      {/* modals */}
      {open && <CardModal cardId={cardId} close={() => setOpen(false)} />}
    </>
  )
}