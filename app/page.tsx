"use client"

import { useEffect } from "react"
import { useBoardStore } from "@/app/store/board.store"
import { initialData } from "@/app/data/data"
import Board from "@/app/components/board/Board"

export default function Home() {
  const setBoardState = useBoardStore((state) => state.setInitialState)

  useEffect(() => {
    setBoardState(initialData)
  }, [setBoardState])

  return <Board />
}