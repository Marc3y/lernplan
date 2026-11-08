"use client";

import { useEffect } from "react";

export default function Boot() {
  useEffect(() => {
    import("@/lib/app");
  }, []);
  return null;
}
