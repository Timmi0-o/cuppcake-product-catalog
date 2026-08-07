"use client";

import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | { [key: string]: Serializable }
  | Set<unknown>
  | Map<unknown, unknown>
  | Date;

function replacer(_key: string, value: unknown): Serializable {
  if (value instanceof Set) {
    return { __type: "Set", _values: Array.from(value) };
  }
  if (value instanceof Map) {
    return { __type: "Map", _values: Array.from(value.entries()) };
  }
  if (value instanceof Date) {
    return { __type: "Date", _value: value.toISOString() };
  }
  return value as Serializable;
}

function reviver(_key: string, value: unknown): Serializable {
  if (
    value &&
    typeof value === "object" &&
    "__type" in value &&
    "_values" in value &&
    (value as { __type: string }).__type === "Set"
  ) {
    return new Set((value as { _values: unknown[] })._values);
  }
  if (
    value &&
    typeof value === "object" &&
    "__type" in value &&
    "_values" in value &&
    (value as { __type: string }).__type === "Map"
  ) {
    return new Map((value as { _values: [unknown, unknown][] })._values);
  }
  if (
    value &&
    typeof value === "object" &&
    "__type" in value &&
    "_value" in value &&
    (value as { __type: string }).__type === "Date"
  ) {
    return new Date((value as { _value: string })._value);
  }
  return value as Serializable;
}

export default function useLocalStorage<T extends Serializable>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          return JSON.parse(item, reviver) as T;
        }
      } catch {
        // ignore
      }
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && key) {
        window.localStorage.setItem(key, JSON.stringify(storedValue, replacer));
      }
    } catch {
      // ignore
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
