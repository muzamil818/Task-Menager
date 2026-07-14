import Board from "./components/layout/board/Board";
import InboxPortion from "./components/layout/inbox/Inbox";
import SplitPanel from "./components/layout/SplitPanel";
import Nav from "./components/Nav";

const App = () => {
  return (
    <div className="bg-[#111827] w-screen h-screen flex flex-col">
      <Nav />
      <SplitPanel
        left={<InboxPortion />}
        right={<Board />}
        initialLeftPercent={25}
      />
    </div>
  );
};

export default App