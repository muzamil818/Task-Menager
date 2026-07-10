
import Board from "./components/layout/Board"
import InboxCard from "./components/layout/InboxCard"
import Nav from "./components/Nav"

const App = () => {
  return (

    <div className="bg-[#111827] w-screen h-screen">
      <Nav />
      <div className="flex justify-between  ">
        <InboxCard />
        <Board />
      </div>

    </div>

  )
}

export default App