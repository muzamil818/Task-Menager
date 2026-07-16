export interface BoardTaskItem {
  id: number;
  title: string;
}

export interface BoardColumnData {
  id: number;
  title: string;
  tasks: BoardTaskItem[];
}

export interface ColumnsState {
  inbox: BoardTaskItem[];
  board: BoardColumnData[];
}
