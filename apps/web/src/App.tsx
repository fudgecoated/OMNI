import { HermesSidebar } from "./components/layout/HermesSidebar";
import { WorkspacePage } from "./components/pages/WorkspacePage";

export default function App() {
  return (
    <div className="vl-shell">
      <HermesSidebar />
      <main className="vl-shell__main">
        <WorkspacePage />
      </main>
    </div>
  );
}
