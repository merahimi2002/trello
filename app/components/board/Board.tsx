"use client"

import { useState } from "react"
import { useBoardStore } from "@/app/store/board.store"
import List from "@/app/components/list/List"
import "@/app/styles/components/_board.scss"

export default function Board() {
  const { board, updateBoardTitle } = useBoardStore()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(board.title)

  const handleBlur = () => {
    updateBoardTitle(title)
    setIsEditing(false)
  }

  return (
    <div className="board p-4">
      {/* ---------- Board Title ---------- */}
      {isEditing ? (
        <input
          className="board-title-input border p-1 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleBlur()
          }}
          autoFocus
        />
      ) : (
        <h1
          className="board-title text-2xl font-bold cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {board.title}
        </h1>
      )}

      <div className="lists">
        {board.listIds.map((id) => (
          <List key={id} listId={id} />
        ))}
      </div>
    </div>
  )
}