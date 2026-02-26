"use client"

import { useState } from "react"
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

  return (
    <>
      <div className="card" onClick={() => setModalOpen(true)}>
        <div className="card-title">{card.title}</div>
      </div>

      {modalOpen && <CardModal cardId={cardId} close={() => setModalOpen(false)} />}
    </>
  )
}