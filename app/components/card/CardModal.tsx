"use client"

import { useState, useEffect, useRef } from "react"
import { useBoardStore } from "@/app/store/board.store"
import type { ID } from "@/app/types/board.types"
import "@/app/styles/components/_cardModal.scss"

interface CardModalProps {
  cardId: ID
  close: () => void
}

export default function CardModal({ cardId, close }: CardModalProps) {
  const card = useBoardStore((state) => state.cards[cardId])
  const addComment = useBoardStore((state) => state.addComment)

  const [commentText, setCommentText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input when modal opens
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [close])

  const handleAddComment = () => {
    if (!commentText.trim()) return

    addComment(cardId, commentText.trim())
    setCommentText("")

    // Re-focus input after adding
    inputRef.current?.focus()
  }

  if (!card) return null

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{card.title}</h2>
          <button className="modal-close-btn" onClick={close}>
            ×
          </button>
        </div>

        {/* Comments Section */}
        <div className="modal-comments-section">
          <h3 className="comments-title">
            Comments {card.comments.length > 0 && `(${card.comments.length})`}
          </h3>

          {card.comments.length === 0 ? (
            <p className="no-comments-yet">No comments yet. Be the first!</p>
          ) : (
            <div className="comments-list">
              {card.comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Comment Form */}
        <div className="add-comment-form">
          <input
            ref={inputRef}
            type="text"
            className="comment-input"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleAddComment()
              }
            }}
          />
          <button
            className="add-comment-btn"
            onClick={handleAddComment}
            disabled={!commentText.trim()}
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  )
}