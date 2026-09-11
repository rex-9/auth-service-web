import { useEffect, useState } from "react";
import { useLoading } from "../../../contexts/LoadingContext";

interface ILoadResult<T> {
  success: boolean;
  record?: T;
  error?: string;
}

export const useAdminDetail = <T>(
  id: string | undefined,
  load: (id: string) => Promise<ILoadResult<T>>,
) => {
  const { setLoading } = useLoading();
  const [record, setRecord] = useState<T | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let active = true;
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await load(id);
        if (!active) return;
        if (result.success && result.record) setRecord(result.record);
        else setError(result.error || "Unable to load this record");
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load this record",
        );
      } finally {
        if (active) setLoading(false);
      }
    };
    void run();
    return () => {
      active = false;
      setLoading(false);
    };
  }, [id, load, setLoading]);

  return { record, error };
};
