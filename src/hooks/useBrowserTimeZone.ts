import { useCallback, useEffect, useState } from "react";
import { getBrowserTimeZone, getLocalUtcOffset } from "../helpers";

export interface IBrowserTimeZone {
  timeZone: string;
  utcOffset: string;
}

const resolveTimeZone = (): IBrowserTimeZone => ({
  timeZone: getBrowserTimeZone(),
  utcOffset: getLocalUtcOffset(),
});

export const useBrowserTimeZone = (): IBrowserTimeZone => {
  const [value, setValue] = useState(resolveTimeZone);
  const refresh = useCallback(() => setValue(resolveTimeZone()), []);

  useEffect(() => {
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [refresh]);

  return value;
};
