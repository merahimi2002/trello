"use client"

import { useState, useRef, useEffect } from "react"
import { useBoardStore } from "@/app/store/board.store"
import type { ID } from "@/app/types/board.types"
import Modal from "@/app/components/Modals"
import "@/app/styles/components/_comment.scss"

interface CommentProps {
  cardId: ID
  close: () => void
}

export default function Comment({ cardId, close }: CommentProps) {
  const card = useBoardStore((state) => state.cards[cardId])
  const addComment = useBoardStore((state) => state.addComment)

  const [commentText, setCommentText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleAddComment = () => {
    if (!commentText.trim()) return
    addComment(cardId, commentText.trim())
    setCommentText("")
    inputRef.current?.focus()
  }

  if (!card) return null

  return (
    <Modal close={close}>
      {/* Header */}
      <div className="modal-header">
        <h2 className="modal-title">{card.title}</h2>
        <button className="modal-close-btn" onClick={close}>×</button>
      </div>

      {/* Comments */}
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
    </Modal>
  )
}