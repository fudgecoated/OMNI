import type { Person } from "@hermes/shared";
import { useContacts } from "../hooks/useContacts";

interface TrackerPageProps {
  selectedPerson: Person | null;
}

export function TrackerPage({ selectedPerson }: TrackerPageProps) {
  const { contacts, due, loading, error, addContact } = useContacts();

  const logSelected = async () => {
    if (!selectedPerson) return;
    await addContact({
      company: selectedPerson.company,
      personName: selectedPerson.name,
      personRole: selectedPerson.role,
      linkedinUrl: selectedPerson.linkedinUrl,
      schoolConnection: selectedPerson.schoolConnection,
    });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Follow-up Tracker</h2>
      <p className="text-sm text-gray-400">
        Contacts are stored locally on the server in{" "}
        <code className="text-xs">apps/server/data/contacts.json</code>.
      </p>

      {selectedPerson && (
        <button
          type="button"
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium hover:bg-emerald-600"
          onClick={() => void logSelected()}
        >
          Log outreach to {selectedPerson.name}
        </button>
      )}

      {loading && <p className="text-sm text-gray-400">Loading…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div>
        <h3 className="mb-2 font-medium text-amber-300">Due for follow-up</h3>
        {due.length === 0 ? (
          <p className="text-sm text-gray-500">None due right now.</p>
        ) : (
          <ul className="space-y-2">
            {due.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-amber-900/50 bg-amber-950/30 p-3 text-sm"
              >
                {c.personName} · {c.company} · follow-up {c.followupDate}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="mb-2 font-medium">All contacts</h3>
        {contacts.length === 0 ? (
          <p className="text-sm text-gray-500">No contacts logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {contacts.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-gray-800 bg-gray-900/60 p-3 text-sm"
              >
                <span className="font-medium">{c.personName}</span> — {c.status}{" "}
                · contacted {c.firstContactDate}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
