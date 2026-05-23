import { useCallback, useState } from "react";
import type { CompanySlug, Person } from "@hermes/shared";
import { apiFetch } from "../lib/api";

interface PeopleResponse {
  company: CompanySlug;
  count: number;
  people: Person[];
}

export function useFinder() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (company: CompanySlug, role?: string, school?: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (role) params.set("role", role);
        if (school) params.set("school", school);
        const qs = params.toString();
        const data = await apiFetch<PeopleResponse>(
          `/api/companies/${company}/people${qs ? `?${qs}` : ""}`
        );
        setPeople(data.people);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Search failed");
        setPeople([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { people, loading, error, search };
}
