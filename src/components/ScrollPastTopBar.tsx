"use client";

import { useEffect } from "react";

// Product detail pages should open with the sticky nav already at the top of
// the viewport (skipping past the non-sticky contact-info TopBar) instead of
// the default scroll-to-top position. On mobile the TopBar is hidden (0
// height), so this is a no-op there.
export default function ScrollPastTopBar() {
  useEffect(() => {
    const height = document.getElementById("top-bar")?.getBoundingClientRect().height ?? 0;
    if (height > 0) window.scrollTo(0, height);
  }, []);

  return null;
}
