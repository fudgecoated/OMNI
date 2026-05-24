import { useCallback, useState } from "react";
import type { StudentProfile } from "@hermes/shared";
import { apiFetch } from "../lib/api";
import { useProfileStore } from "../stores/profileStore";

interface IngestResponse {
  profileUpdates: Partial<StudentProfile>;
  profile: StudentProfile;
  contextMarkdown: string;
}

export function useProfileIngest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ingest = useCallback(async () => {
    const state = useProfileStore.getState();
    const profile =
      state.isEditing && state.draftProfile ? state.draftProfile : state.profile;
    const { links, files } = state.sources;

    if (links.length === 0 && files.length === 0) {
      setError("Add at least one link or file.");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<IngestResponse>("/api/profile/ingest", {
        method: "POST",
        body: JSON.stringify({
          profile,
          links,
          files: files.map(({ name, text }) => ({ name, text })),
        }),
      });

      const merged = data.profile;
      state.setProfile(merged);
      state.setContextMarkdown(data.contextMarkdown);
      return data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Import failed";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { ingest, loading, error, clearError: () => setError(null) };
}
