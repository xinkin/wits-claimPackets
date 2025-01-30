import React, { useState, useEffect } from "react";

export const usePersistentState = (key: string, initialValue: any) => {
  const [value, setValue] = useState(() => {
    // Only access localStorage if window is defined (client-side)
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);
      if (storedValue === "undefined") return initialValue;
      return storedValue !== null ? JSON.parse(storedValue) : initialValue;
    }
    return initialValue;
  });

  useEffect(() => {
    // Only access localStorage if window is defined (client-side)
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};
