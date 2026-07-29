import Board from "./components/layout/board/Board";
import InboxPortion from "./components/layout/inbox/Inbox";
import SplitPanel from "./components/layout/SplitPanel";
import Nav from "./components/Nav";
import Auth from "./components/Auth";
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

  // Use state for token so the app re-renders when the user logs in
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // loading initial value from backend  
  useEffect(() => {
    const loadData = async () => {
      if (!token) return; // Don't fetch if no token is present
      try {
        const res = await fetch("http://localhost:5000/api/lists", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (!res.ok) {
          console.error("Error fetching lists:", data.message);
          // If token is invalid, log the user out
          if (res.status === 401) {
            localStorage.removeItem("token");
            setToken(null);
          }
          return; // Stop here, don't update state with an error object
        }

        // Properly map the backend 'lists' array into the inbox
        if (data && data.lists) {
          setColumns((prev) => ({
            ...prev,
            // Mapping the backend _id (string) to id. Note: your type says id is number, so we cast if needed.
            inbox: data.lists.map((item: any) => ({
              id: item._id,
              title: item.title
            }))
          }));
        }
      } catch (error) {
        console.log("error in loading the data of lists ", error);
      }
    };
    loadData();
  }, [token]);

  const handleInboxAddCard = async (title: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/lists", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Backend requires boardId, sending a dummy one for now to prevent 400 Bad Request
        body: JSON.stringify({ title, boardId: "000000000000000000000000" })
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to add card:", data.message);
        if (res.status === 401) {
          localStorage.removeItem("token");
          setToken(null);
        }
        return;
      }

      const newCard = { id: data.list._id, title: data.list.title };
      setColumns((prev) => ({ ...prev, inbox: [...prev.inbox, newCard] }));
    } catch (error) {
      console.log("Failed to add card", error);
    }
  };

  const handleUpdateCard = async (id: number | string, title: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/lists/${id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title })
      });
      if (!res.ok) {
        console.error("Failed to update card");
        if (res.status === 401) {
          localStorage.removeItem("token");
          setToken(null);
        }
        return;
      }
      setColumns((prev) => ({ ...prev, inbox: prev.inbox.map((card) => card.id === id ? { ...card, title } : card) }));
    } catch (error) {
      console.log("Failed to update card", error);
    }
  };

  const handleDeleteCard = async (id: number | string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/lists/${id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      if (!res.ok) {
        console.error("Failed to delete card");
        if (res.status === 401) {
          localStorage.removeItem("token");
          setToken(null);
        }
        return;
      }
      setColumns((prev) => ({ ...prev, inbox: prev.inbox.filter((card) => card.id !== id) }));
    } catch (error) {
      console.log("Failed to delete card", error);
    }
  };
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

  // Conditionally render the Auth component if not logged in
  if (!token) {
    return <Auth setToken={setToken} />;
  }

  // ADDED: Parse the user from localStorage. If it doesn't exist, we fallback to null
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ADDED: A function to completely log the user out
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
  };

  return (
    <div className="bg-[#111827] w-screen h-screen flex flex-col">
      {/* ADDED: Pass the user details and the logout function into the Nav component */}
      <Nav user={user} onLogout={handleLogout} />
      <DragDropProvider onDragEnd={handleDragEnd}>
        <SplitPanel
          left={
            <InboxPortion
              cards={columns.inbox}
              onAddCard={handleInboxAddCard}
              onUpdateCard={handleUpdateCard}
              onDeleteCard={handleDeleteCard}
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