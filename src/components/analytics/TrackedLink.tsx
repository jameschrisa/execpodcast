"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track, type EventMap } from "@/lib/analytics";

type Props<E extends keyof EventMap> = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "onClick"> & {
  event: E;
  props: EventMap[E];
  external?: boolean;
  children: ReactNode;
};

// Anchor that sends one PostHog event on click. External links open in a new
// tab; PostHog's beacon transport still delivers the event as the page changes.
export function TrackedLink<E extends keyof EventMap>({ event, props, external, children, ...rest }: Props<E>) {
  return (
    <a
      {...rest}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => track(event, props)}
    >
      {children}
    </a>
  );
}
