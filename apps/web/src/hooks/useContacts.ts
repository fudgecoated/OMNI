import { useCallback, useEffect, useState } from "react";
import type { Contact, CreateContactRequest } from "@hermes/shared";
import { apiFetch } from "../lib/api";

interface ContactsResponse {
  contacts: Contact[];
}

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [due, setDue] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [all, dueRes] = await Promise.all([
        apiFetch<ContactsResponse>("/api/contacts"),
        apiFetch<ContactsResponse>("/api/contacts/due"),
      ]);
      setContacts(all.contacts);
      setDue(dueRes.contacts);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, []);

  const addContact = useCallback(
    async (input: CreateContactRequest) => {
      await apiFetch<Contact>("/api/contacts", {
        method: "POST",
        body: JSON.stringify(input),
      });
      await refresh();
    },
    [refresh]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { contacts, due, loading, error, refresh, addContact };
}
