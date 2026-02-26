"use client"

import { useCallback, useState } from "react"
import { useBoardStore } from "@/app/store/board.store"
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCorners,
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
import Card from "@/app/components/card/Card"
import "@/app/styles/components/_board.scss"

export default function Board() {
  const { board, lists, cards, updateBoardTitle } = useBoardStore()

  const [activeId, setActiveId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(board.title || "My Board")

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    // === Reorder lists ===
    if (board.listIds.includes(activeId)) {
      const oldIndex = board.listIds.indexOf(activeId)
      const newIndex = board.listIds.indexOf(overId)
      if (newIndex < 0) return

      useBoardStore.setState((s) => ({
        board: {
          ...s.board,
          listIds: arrayMove(s.board.listIds, oldIndex, newIndex),
        },
      }))
      return
    }

    // === Move cards ===
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
      const oldIndex = sourceList.cardIds.indexOf(activeId)
      useBoardStore.setState((s) => ({
        lists: {
          ...s.lists,
          [sourceListId]: {
            ...sourceList,
            cardIds: arrayMove(sourceList.cardIds, oldIndex, insertIndex),
          },
        },
      }))
    } else {
      useBoardStore.setState((s) => ({
        lists: {
          ...s.lists,
          [sourceListId]: {
            ...sourceList,
            cardIds: sourceList.cardIds.filter(id => id !== activeId),
          },
          [targetListId]: {
            ...targetList,
            cardIds: [
              ...(targetList?.cardIds || []).slice(0, insertIndex),
              activeId,
              ...(targetList?.cardIds || []).slice(insertIndex),
            ],
          },
        },
      }))
    }
  }, [board.listIds, lists])

  return (
    <div className="board">
      {isEditing ? (
        <input
          value={title}
          className="board-title-input"
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            updateBoardTitle(title)
            setIsEditing(false)
          }}
          autoFocus
        />
      ) : (
        <h1 className="board-title " onClick={() => setIsEditing(true)}>{title}</h1>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
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

        {/* Smart overlay for smooth drag */}
        <DragOverlay dropAnimation={{ duration: 200 }}>
          {activeId
            ? board.listIds.includes(activeId)
              ? <List listId={activeId}  />
              : <Card cardId={activeId} isOverlay />
            : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}