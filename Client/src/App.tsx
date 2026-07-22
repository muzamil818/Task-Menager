import Board from "./components/layout/board/Board";
import InboxPortion from "./components/layout/inbox/Inbox";
import SplitPanel from "./components/layout/SplitPanel";
import Nav from "./components/Nav";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { useEffect, useState } from "react";
import { type ColumnsState, type BoardTaskItem } from "./type";

const App = () => {
  const [columns, setColumns] = useState<ColumnsState>({
    inbox: [],
    board: [
      { id: 1, title: "Today", tasks: [] },
      { id: 2, title: "Tomorrow", tasks: [] },
      { id: 3, title: "This Week", tasks: [] },
    ],
  });

  // loading initial value from backend  
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:5000/lists")
        const data: ColumnsState = await res.json()
        setColumns(data)
      } catch (error) {
        console.log(error)
      }
    }
    loadData();
  }, [])
  const handleInboxAddCard = async (title: string) => {
    try {
      const res = await fetch("http://localhost:5000/lists", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ title })

      })
      const newCard: BoardTaskItem = await res.json()
      setColumns((prev) => ({ ...prev, inbox: [...prev.inbox, newCard] })).catch
    } catch (error) {
      console.log("Failed to add card", error);
    }
  }


  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;

    const cardId = event.operation.source?.id;
    const targetIdStr = event.operation.target?.id;

    if (cardId == null || targetIdStr == null) return;

    setColumns((prev) => {
      let draggedCard: BoardTaskItem | undefined;
      let sourceLocation: "inbox" | number | null = null;

      // Find in inbox
      const inInbox = prev.inbox.find((c) => c.id === cardId);
      if (inInbox) {
        sourceLocation = "inbox";
        draggedCard = inInbox;
      } else {
        // Find in board
        for (const col of prev.board) {
          const inCol = col.tasks.find((c) => c.id === cardId);
          if (inCol) {
            sourceLocation = col.id;
            draggedCard = inCol;
            break;
          }
        }
      }

      if (!draggedCard || sourceLocation === null) return prev;

      // Parse target location
      let targetLocation: "inbox" | number | null = null;
      if (targetIdStr === "inbox") {
        targetLocation = "inbox";
      } else if (typeof targetIdStr === "string" && targetIdStr.startsWith("column-")) {
        targetLocation = parseInt(targetIdStr.split("-")[1], 10);
      }

      if (targetLocation === null) return prev;
      if (sourceLocation === targetLocation) return prev;

      // Remove from source
      let newInbox = prev.inbox;
      let newBoard = prev.board;

      if (sourceLocation === "inbox") {
        newInbox = newInbox.filter((c) => c.id !== cardId);
      } else {
        newBoard = newBoard.map((col) =>
          col.id === sourceLocation
            ? { ...col, tasks: col.tasks.filter((c) => c.id !== cardId) }
            : col
        );
      }

      // Add to target
      if (targetLocation === "inbox") {
        newInbox = [...newInbox, draggedCard];
      } else {
        newBoard = newBoard.map((col) =>
          col.id === targetLocation
            ? { ...col, tasks: [...col.tasks, draggedCard] }
            : col
        );
      }

      return {
        inbox: newInbox,
        board: newBoard,
      };
    });
  };

  return (
    <div className="bg-[#111827] w-screen h-screen flex flex-col">
      <Nav />
      <DragDropProvider onDragEnd={handleDragEnd}>
        <SplitPanel
          left={
            <InboxPortion
              cards={columns.inbox}
              onAddCard={ }
            // setColumns={setColumns}
            />
          }
          right={<Board columns={columns.board} setColumns={setColumns} />}
          initialLeftPercent={25}
        />
      </DragDropProvider>
    </div>
  );
};

export default App;