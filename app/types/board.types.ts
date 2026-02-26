export type ID = string

export interface Comment {
  id: ID
  text: string
  createdAt: number
}

export interface Card {
  id: ID
  title: string
  comments: Comment[]
}

export interface List {
  id: ID
  title: string
  cardIds: ID[]
}

export interface Board {
  id: ID
  title: string
  listIds: ID[]
}

export interface BoardState {
  board: Board
  lists: Record<ID, List>
  cards: Record<ID, Card>
}