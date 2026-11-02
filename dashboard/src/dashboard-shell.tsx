import { Button } from "@zudev/ui/components/button";
import type { LucideIcon } from "lucide-react";
import { ChevronRight, Menu, X } from "lucide-react";
import { type ReactNode, useState } from "react";

export interface DashboardNavigationItem {
  label: string;
  href?: string;
  section: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export interface DashboardShellProps {
  brandName: string;
  brandDescription: string;
  navigation: DashboardNavigationItem[];
  activeHref: string;
  pageTitle?: string;
  children: ReactNode;
  headerActions?: ReactNode;
  onNavigate?: (href: string) => void;
}

export function DashboardShell({
  brandName,
  brandDescription,
  navigation,
  activeHref,
  pageTitle = "Dashboard",
  children,
  headerActions,
  onNavigate,
}: DashboardShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sections = navigation.reduce<Map<string, DashboardNavigationItem[]>>(
    (groups, item) => {
      const items = groups.get(item.section) ?? [];
      items.push(item);
      groups.set(item.section, items);
      return groups;
    },
    new Map(),
  );

  const navContent = (
    <>
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <div className="grid size-9 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          IT
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{brandName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {brandDescription}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        >
          <X aria-hidden="true" />
        </Button>
      </div>
      <nav
        className="flex-1 space-y-6 overflow-y-auto px-3 py-5"
        aria-label="Dashboard navigation"
      >
        {[...sections.entries()].map(([section, items]) => (
          <div key={section}>
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {section}
            </p>
            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === activeHref;
                const className = `flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${item.disabled ? "cursor-not-allowed opacity-50" : ""}`;

                if (item.disabled || !item.href) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className={className}
                      disabled
                      title={`${item.label} will be available soon`}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="flex-1">{item.label}</span>
                      <span className="text-[10px]">Soon</span>
                    </button>
                  );
                }

                const href = item.href;
                return (
                  <a
                    key={item.label}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={className}
                    onClick={(event) => {
                      setMenuOpen(false);
                      if (
                        onNavigate &&
                        event.button === 0 &&
                        !event.metaKey &&
                        !event.ctrlKey &&
                        !event.shiftKey &&
                        !event.altKey
                      ) {
                        event.preventDefault();
                        onNavigate(href);
                      }
                    }}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/70 p-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-xs font-semibold text-foreground ring-1 ring-border">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Admin</p>
            <p className="truncate text-xs text-muted-foreground">
              Content manager
            </p>
          </div>
          <ChevronRight
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/40 text-foreground md:grid md:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r bg-background md:flex">
        {navContent}
      </aside>
      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/35 md:hidden"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[min(84vw,280px)] flex-col border-r bg-background shadow-xl md:hidden">
            {navContent}
          </aside>
        </>
      ) : null}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu aria-hidden="true" />
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{brandName}</span>
            <ChevronRight
              className="hidden size-3.5 sm:block"
              aria-hidden="true"
            />
            <span className="font-medium text-foreground">{pageTitle}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {headerActions}
            <div className="ml-1 grid size-8 place-items-center rounded-full bg-[#f7e8e8] text-xs font-semibold text-primary">
              AD
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
