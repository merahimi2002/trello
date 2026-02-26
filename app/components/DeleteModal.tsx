"use client"

import Modal from "@/app/components/Modals"
import "@/app/styles/components/_modals.scss"

interface DeleteModalProps {
    title?: string
    description?: string
    onConfirm: () => void
    onCancel: () => void
}

export default function DeleteModal({
    title = "Delete Item",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    onConfirm,
    onCancel,
}: DeleteModalProps) {
    return (
        <Modal close={onCancel}>
            <div className="delete-modal">
                <h3 className="delete-title">{title}</h3>
                <p className="delete-description">{description}</p>

                <div className="delete-actions">
                    <button className="cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="confirm-btn" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    )
}