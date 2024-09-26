import { useState, useEffect } from "react";

export const useCountdown = (initialSeconds: number) => {
  const [countdown, setCountdown] = useState(initialSeconds);
  const [isCooldown, setIsCooldown] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    if (isCooldown) {
      setCountdown(initialSeconds);
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      timer = setTimeout(() => {
        setIsCooldown(false);
      }, initialSeconds * 1000);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [isCooldown, initialSeconds]);

  const startCountdown = () => {
    setIsCooldown(true);
  };

  return { countdown, isCooldown, startCountdown };
};
