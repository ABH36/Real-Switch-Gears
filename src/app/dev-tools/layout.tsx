import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev Tools",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DevToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
