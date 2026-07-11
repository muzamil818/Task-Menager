
import Board from "./components/layout/Board"
import InboxPortion from "./components/layout/Inbox"
import Nav from "./components/Nav"

const App = () => {
  return (

    <div className="bg-[#111827] w-screen h-screen">
      <Nav />
      <div className="flex justify-between  ">
        <InboxPortion />
        <Board />
      </div>

    </div>

  )
}

export default App