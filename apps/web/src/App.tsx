import { useState } from "react";
import type { Person } from "@hermes/shared";
import { FinderPage } from "./pages/FinderPage";
import { WriterPage } from "./pages/WriterPage";
import { TrackerPage } from "./pages/TrackerPage";

type Tab = "finder" | "writer" | "tracker";

const TABS: { id: Tab; label: string }[] = [
  { id: "finder", label: "People Finder" },
  { id: "writer", label: "Message Writer" },
  { id: "tracker", label: "Follow-ups" },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("finder");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const onSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setTab("writer");
  };

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-8">
      <header className="mb-8 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Hermes</h1>
        <p className="mt-1 text-gray-400">
          Find people · Write outreach · Never forget follow-up
        </p>
      </header>

      <nav className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              tab === t.id
                ? "bg-sky-600 text-white"
                : "bg-gray-900 text-gray-300 hover:bg-gray-800"
            }`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "finder" && <FinderPage onSelectPerson={onSelectPerson} />}
      {tab === "writer" && <WriterPage selectedPerson={selectedPerson} />}
      {tab === "tracker" && <TrackerPage selectedPerson={selectedPerson} />}
    </div>
  );
}
