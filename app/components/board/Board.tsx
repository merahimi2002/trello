"use client"

import { useCallback, useState } from "react"
import { useBoardStore } from "@/app/store/board.store"
import {
  DndContext,
  DragEndEvent,
  pointerWithin,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import List from "@/app/components/list/List"
import "@/app/styles/components/_board.scss"

export default function Board() {
  const { board, lists, updateBoardTitle } = useBoardStore()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(board.title || "My Board")

  // Custom sensor to prevent accidental drag on small movements
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // drag only starts after moving the pointer 5px
      },
    })
  )

  const handleBlur = () => {
    updateBoardTitle(title.trim())
    setIsEditing(false)
  }

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    // Case 1: Reordering lists (columns)
    if (board.listIds.includes(activeId)) {
      const oldIndex = board.listIds.indexOf(activeId)
      const newIndex = board.listIds.indexOf(overId)
      if (newIndex < 0) return

      const newListIds = arrayMove(board.listIds, oldIndex, newIndex)

      useBoardStore.setState((s) => ({
        board: { ...s.board, listIds: newListIds },
      }))
      return
    }

    // Case 2: Moving a card
    let sourceListId: string | undefined
    for (const [lid, l] of Object.entries(lists)) {
      if (l.cardIds.includes(activeId)) {
        sourceListId = lid
        break
      }
    }
    if (!sourceListId) return

    let targetListId = overId
    let insertIndex = lists[targetListId]?.cardIds?.length ?? 0

    // Dropped on another card → find its list and position
    if (!board.listIds.includes(overId)) {
      for (const [lid, l] of Object.entries(lists)) {
        const idx = l.cardIds.indexOf(overId)
        if (idx !== -1) {
          targetListId = lid
          insertIndex = idx
          break
        }
      }
    }

    const sourceList = lists[sourceListId]
    const targetList = lists[targetListId]

    if (sourceListId === targetListId) {
      // Reorder inside the same list
      const oldIndex = sourceList.cardIds.indexOf(activeId)
      if (oldIndex === insertIndex) return

      const newCardIds = arrayMove(sourceList.cardIds, oldIndex, insertIndex)

      useBoardStore.setState((s) => ({
        lists: {
          ...s.lists,
          [sourceListId]: { ...sourceList, cardIds: newCardIds },
        },
      }))
    } else {
      // Move card to another list
      const newSourceIds = sourceList.cardIds.filter(id => id !== activeId)

      const newTargetIds = [...(targetList?.cardIds || [])]
      newTargetIds.splice(insertIndex, 0, activeId)

      useBoardStore.setState((s) => ({
        lists: {
          ...s.lists,
          [sourceListId]: { ...sourceList, cardIds: newSourceIds },
          [targetListId]: { ...(targetList || { title: "", cardIds: [] }), cardIds: newTargetIds },
        },
      }))
    }
  }, [board.listIds, lists])

  return (
    <div className="board">
      {/* Board title */}
      {isEditing ? (
        <input
          className="board-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && handleBlur()}
          autoFocus
        />
      ) : (
        <h1 className="board-title" onClick={() => setIsEditing(true)}>
          {title}
        </h1>
      )}

      {/* Drag & drop root */}
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={board.listIds}
          strategy={horizontalListSortingStrategy}
        >
          <div className="board-lists">
            {board.listIds.map((id) => (
              <List key={id} listId={id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}