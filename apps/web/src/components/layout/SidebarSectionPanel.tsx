import type { ReactNode } from "react";

export function SidebarSectionPanel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="hermes-sidebar-panel">
      <p className="hermes-sidebar-panel__title">{title}</p>
      {description && <p className="hermes-sidebar-panel__desc">{description}</p>}
      {children}
    </div>
  );
}
