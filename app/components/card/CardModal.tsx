"use client"

import { useState } from "react"
import { useBoardStore } from "@/app/store/board.store"
import type { ID } from "@/app/types/board.types"

interface CardModalProps {
  cardId: ID
  close: () => void
}

export default function CardModal({ cardId, close }: CardModalProps) {
  const card = useBoardStore((state) => state.cards[cardId])
  const addComment = useBoardStore((state) => state.addComment)
  const updateCardTitle = useBoardStore((state) => state.updateCardTitle)

  const [title, setTitle] = useState(card.title)
  const [comment, setComment] = useState("")

  const handleAddComment = () => {
    if (!comment.trim()) return
    addComment(cardId, comment.trim()) 
    setComment("")
  }

  return (
    <div className="modal fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded w-96">
        <h2 className="font-bold text-lg mb-2">Edit Card</h2>

        <input
          className="border p-1 w-full mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => updateCardTitle(cardId, title)}
        />

        <h3 className="font-semibold mt-2">Comments</h3>
        <ul className="max-h-40 overflow-y-auto mb-2">
          {card.comments.map((c) => (
            <li key={c.id} className="text-sm border-b py-1">{c.text}</li>
          ))}
        </ul>

        <input
          className="border p-1 w-full mb-2"
          placeholder="Add comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => { if(e.key === "Enter") handleAddComment() }}
        />

        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-2 py-1 rounded"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
          <button
            className="bg-gray-400 text-white px-2 py-1 rounded"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}