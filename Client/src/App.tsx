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
        // 1. Load Inbox Lists
        const resInbox = await fetch("http://localhost:5000/api/lists?boardId=000000000000000000000000", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataInbox = await resInbox.json();

        if (!resInbox.ok) {
          console.error("Error fetching inbox lists:", dataInbox.message);
          if (resInbox.status === 401) {
            localStorage.removeItem("token");
            setToken(null);
          }
          return;
        }

        const inboxCards = dataInbox.lists ? dataInbox.lists.map((item: any) => ({
          id: item._id,
          title: item.title
        })) : [];

        // 2. Load Board Lists (and their cards)
        const boardId = "111111111111111111111111"; // Dummy board ID for the main Board
        const resBoard = await fetch(`http://localhost:5000/api/lists?boardId=${boardId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataBoard = await resBoard.json();
        
        let boardLists = dataBoard.lists || [];
        const requiredTitles = ["Today", "Tomorrow", "This Week"];
        
        // Initialize missing board lists
        for (const title of requiredTitles) {
          if (!boardLists.find((l: any) => l.title === title)) {
             const resCreate = await fetch("http://localhost:5000/api/lists", {
               method: "POST",
               headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
               body: JSON.stringify({ title, boardId })
             });
             const newListData = await resCreate.json();
             if (resCreate.ok) {
               boardLists.push(newListData.list);
             }
          }
        }

        // Sort them to match the required order
        boardLists.sort((a: any, b: any) => requiredTitles.indexOf(a.title) - requiredTitles.indexOf(b.title));

        // 3. Load Cards for each Board List
        const boardColumns = await Promise.all(boardLists.map(async (list: any) => {
           const resCards = await fetch(`http://localhost:5000/api/cards/${list._id}`, {
             headers: { Authorization: `Bearer ${token}` }
           });
           const dataCards = await resCards.json();
           return {
             id: list._id,
             title: list.title,
             tasks: dataCards.cards ? dataCards.cards.map((c: any) => ({
               id: c._id,
               title: c.title
             })) : []
           };
        }));

        setColumns({
          inbox: inboxCards,
          board: boardColumns
        });

      } catch (error) {
        console.log("error in loading the data ", error);
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

  const handleBoardAddTask = async (listId: string | number, title: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/cards", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, listId })
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to add board task:", data.message);
        return;
      }

      setColumns((prev) => ({
        ...prev,
        board: prev.board.map((col) =>
          col.id === listId
            ? { ...col, tasks: [...col.tasks, { id: data.card._id, title: data.card.title }] }
            : col
        )
      }));
    } catch (error) {
      console.log("Failed to add board task", error);
    }
  };

  const handleBoardUpdateTask = async (listId: string | number, taskId: string | number, title: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cards/${taskId}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title })
      });
      if (!res.ok) return console.error("Failed to update board task");

      setColumns((prev) => ({
        ...prev,
        board: prev.board.map((col) =>
          col.id === listId
            ? {
                ...col,
                tasks: col.tasks.map((t) => (t.id === taskId ? { ...t, title } : t))
              }
            : col
        )
      }));
    } catch (error) {
      console.log("Failed to update board task", error);
    }
  };

  const handleBoardDeleteTask = async (listId: string | number, taskId: string | number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cards/${taskId}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      if (!res.ok) return console.error("Failed to delete board task");

      setColumns((prev) => ({
        ...prev,
        board: prev.board.map((col) =>
          col.id === listId
            ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
            : col
        )
      }));
    } catch (error) {
      console.log("Failed to delete board task", error);
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

    // Parse source and target before setState so we can use them for the API call
    let sourceLocation: "inbox" | string | number | null = null;
    let targetLocation: "inbox" | string | number | null = null;

    // Determine source
    const currentColumns = columns;
    if (currentColumns.inbox.find((c) => c.id === cardId)) {
      sourceLocation = "inbox";
    } else {
      for (const col of currentColumns.board) {
        if (col.tasks.find((c) => c.id === cardId)) {
          sourceLocation = col.id;
          break;
        }
      }
    }

    // Determine target
    if (targetIdStr === "inbox") {
      targetLocation = "inbox";
    } else if (typeof targetIdStr === "string" && targetIdStr.startsWith("column-")) {
      targetLocation = targetIdStr.substring(7);
    }

    if (sourceLocation === null || targetLocation === null) return;
    if (sourceLocation === targetLocation) return;

    // Update local state
    setColumns((prev) => {
      let draggedCard: BoardTaskItem | undefined;

      const inInbox = prev.inbox.find((c) => c.id === cardId);
      if (inInbox) {
        draggedCard = inInbox;
      } else {
        for (const col of prev.board) {
          const inCol = col.tasks.find((c) => c.id === cardId);
          if (inCol) {
            draggedCard = inCol;
            break;
          }
        }
      }

      if (!draggedCard) return prev;

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

    // Persist the move to the backend
    const draggedTitle = columns.inbox.find((c) => c.id === cardId)?.title
      || columns.board.flatMap((col) => col.tasks).find((c) => c.id === cardId)?.title
      || "";

    if (sourceLocation === "inbox" && targetLocation !== "inbox") {
      // Inbox → Board: Create a new Card in the target board column, then delete the old List
      fetch("http://localhost:5000/api/cards", {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: draggedTitle, listId: targetLocation }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.card) {
            // Update the local state with the real backend ID
            setColumns((prev) => ({
              ...prev,
              board: prev.board.map((col) =>
                col.id === targetLocation
                  ? {
                      ...col,
                      tasks: col.tasks.map((t) =>
                        t.id === cardId ? { ...t, id: data.card._id } : t
                      ),
                    }
                  : col
              ),
            }));
          }
        })
        .catch((err) => console.error("Failed to create card from inbox drag:", err));

      // Delete the old List from inbox
      fetch(`http://localhost:5000/api/lists/${cardId}`, {
        method: "DELETE",
        headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
      }).catch((err) => console.error("Failed to delete inbox list after drag:", err));

    } else if (sourceLocation !== "inbox" && targetLocation === "inbox") {
      // Board → Inbox: Create a new List in the inbox, then delete the old Card
      fetch("http://localhost:5000/api/lists", {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: draggedTitle, boardId: "000000000000000000000000" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.list) {
            // Update the local state with the real backend ID
            setColumns((prev) => ({
              ...prev,
              inbox: prev.inbox.map((item) =>
                item.id === cardId ? { ...item, id: data.list._id } : item
              ),
            }));
          }
        })
        .catch((err) => console.error("Failed to create list from board drag:", err));

      // Delete the old Card from the board
      fetch(`http://localhost:5000/api/cards/${cardId}`, {
        method: "DELETE",
        headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
      }).catch((err) => console.error("Failed to delete card after drag:", err));

    } else if (sourceLocation !== "inbox" && targetLocation !== "inbox") {
      // Board → Board: Just move the card to the new list
      fetch(`http://localhost:5000/api/cards/${cardId}/move`, {
        method: "PUT",
        headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ listId: targetLocation }),
      }).catch((err) => console.error("Failed to persist card move:", err));
    }
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
          right={
            <Board 
              columns={columns.board} 
              onAddCard={handleBoardAddTask}
              onUpdateCard={handleBoardUpdateTask}
              onDeleteCard={handleBoardDeleteTask}
            />
          }
          initialLeftPercent={25}
        />
      </DragDropProvider>
    </div>
  );
};

export default App;