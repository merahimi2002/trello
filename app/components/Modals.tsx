"use client"

import { ReactNode, useEffect } from "react"
import "@/app/styles/components/_modals.scss"

interface ModalOverlayProps {
    children: ReactNode
    close: () => void
}

export default function ModalOverlay({ children, close }: ModalOverlayProps) {
    // Close modal on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") close()
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [close])

    return (
        <div className="modal-overlay" onClick={close}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}