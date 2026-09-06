import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { useAuth } from "../../../contexts";
import { usePermissions } from "../../../hooks";
import { ADMIN_ROLE_NAMES, hasAdminRole } from "../role";
import type { AdminResource } from "../role";
import {
  ADMIN_ACTIONS,
  ADMIN_RESOURCES,
} from "../constants";
import { cn } from "../../../design/helpers";
import { iconsLib } from "../../../assets";
import { useTranslate, AppLocales } from "../../../locales";

interface IAdminNavItem {
  labelKey: string;
  to: string;
  resource: AdminResource;
  action?: typeof ADMIN_ACTIONS.READ | typeof ADMIN_ACTIONS.CREATE;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  superAdminOnly?: boolean;
}

interface IAdminNavSection {
  id: string;
  labelKey: string;
  items: IAdminNavItem[];
}

interface IAdminSidebarNavProps {
  onNavigate: () => void;
  isSidebarOpen?: boolean;
}

const navSections: IAdminNavSection[] = [
  {
    id: "overview",
    labelKey: AppLocales.Admin.Nav.Sections.Overview,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Analytics,
        to: AppRoutes.client.protected.admin.ANALYTICS,
        resource: ADMIN_RESOURCES.ANALYTICS,
        icon: iconsLib.chartBar,
      },
    ],
  },
  {
    id: "commerce",
    labelKey: AppLocales.Admin.Nav.Sections.Commerce,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Products,
        to: AppRoutes.client.protected.admin.PRODUCTS,
        resource: ADMIN_RESOURCES.PRODUCTS,
        icon: iconsLib.cube,
      },
      {
        labelKey: AppLocales.Admin.Nav.Items.Accesses,
        to: AppRoutes.client.protected.admin.ACCESSES,
        resource: ADMIN_RESOURCES.ACCESSES,
        icon: iconsLib.shieldCheck,
      },
    ],
  },
  {
    id: "communication",
    labelKey: AppLocales.Admin.Nav.Sections.Communication,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Notifications,
        to: AppRoutes.client.protected.admin.NOTIFICATIONS,
        resource: ADMIN_RESOURCES.NOTIFICATIONS,
        icon: iconsLib.bellAlert,
      },
      {
        labelKey: AppLocales.Admin.Nav.Items.ChatRooms,
        to: AppRoutes.client.protected.admin.CHAT_ROOMS,
        resource: ADMIN_RESOURCES.ROOMS,
        icon: iconsLib.chatBubbleLeftRight,
      },
      {
        labelKey: AppLocales.Admin.Nav.Items.ChatMessages,
        to: AppRoutes.client.protected.admin.CHAT_MESSAGES,
        resource: ADMIN_RESOURCES.MESSAGES,
        icon: iconsLib.inboxStack,
      },
    ],
  },
  {
    id: "access",
    labelKey: AppLocales.Admin.Nav.Sections.Iam,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Users,
        to: AppRoutes.client.protected.admin.USERS,
        resource: ADMIN_RESOURCES.USERS,
        icon: iconsLib.userGroup,
        superAdminOnly: true,
      },
      {
        labelKey: AppLocales.Admin.Nav.Items.Roles,
        to: AppRoutes.client.protected.admin.ROLES,
        resource: ADMIN_RESOURCES.ROLES,
        icon: iconsLib.key,
        superAdminOnly: true,
      },
    ],
  },
  {
    id: "media",
    labelKey: AppLocales.Admin.Nav.Sections.Media,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Assets,
        to: AppRoutes.client.protected.admin.ASSETS,
        resource: ADMIN_RESOURCES.ASSETS,
        icon: iconsLib.photo,
      },
    ],
  },
  {
    id: "support",
    labelKey: AppLocales.Admin.Nav.Sections.Support,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Feedback,
        to: AppRoutes.client.protected.admin.FEEDBACK,
        resource: ADMIN_RESOURCES.FEEDBACKS,
        icon: iconsLib.mail,
      },
    ],
  },
  {
    id: "observability",
    labelKey: AppLocales.Admin.Nav.Sections.Observability,
    items: [
      {
        labelKey: AppLocales.Admin.Nav.Items.Logs,
        to: AppRoutes.client.protected.admin.LOGS,
        resource: ADMIN_RESOURCES.CLIENTS,
        icon: iconsLib.document,
      },
    ],
  },
];

export const AdminSidebarNav: React.FC<IAdminSidebarNavProps> = ({
  onNavigate,
  isSidebarOpen = false,
}) => {
  const t = useTranslate();
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});
  const { currentUser } = useAuth();
  const { can, isLoading } = usePermissions();
  const hasAdminAccess = hasAdminRole(currentUser?.role_names);
  const isSuperAdmin =
    currentUser?.role_names?.includes(ADMIN_ROLE_NAMES.SUPER_ADMIN) ?? false;

  const enabledItems = useMemo(
    () =>
      navSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) =>
            !hasAdminAccess
              ? false
              : item.superAdminOnly
                ? isSuperAdmin
                : isLoading ||
                  can(item.action ?? ADMIN_ACTIONS.READ, item.resource),
          ),
        }))
        .filter((section) => section.items.length > 0),
    [can, hasAdminAccess, isLoading, isSuperAdmin],
  );

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((currentSections) => ({
      ...currentSections,
      [sectionId]: !currentSections[sectionId],
    }));
  };

  return (
    <nav
      className={cn(
        "flex-1 overflow-y-auto py-3",
        isSidebarOpen ? "px-4" : "px-2 lg:px-4",
      )}
    >
      <div
        className={cn("space-y-4", !isSidebarOpen && "space-y-2 lg:space-y-4")}
      >
        {enabledItems.map((section, idx) => {
          const isCollapsed = collapsedSections[section.id] ?? false;

          return (
            <div key={section.id}>
              {!isSidebarOpen && idx > 0 && (
                <div className="my-2 border-t border-base-300/40 lg:hidden" />
              )}
              <button
                type="button"
                aria-expanded={!isCollapsed}
                aria-controls={`admin-nav-section-${section.id}`}
                onClick={() => toggleSection(section.id)}
                className={cn(
                  "mb-2 h-7 w-full items-center justify-between rounded-md px-2 text-caption font-semibold text-base-content opacity-60 transition-colors hover:bg-base-200 hover:opacity-100",
                  isSidebarOpen ? "flex" : "hidden lg:flex",
                )}
              >
                <span>{t(section.labelKey)}</span>
                <iconsLib.chevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isCollapsed ? "-rotate-90" : "rotate-0",
                  )}
                />
              </button>
              <div
                id={`admin-nav-section-${section.id}`}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                  isSidebarOpen
                    ? isCollapsed
                      ? "grid-rows-[0fr] opacity-0"
                      : "grid-rows-[1fr] opacity-100"
                    : isCollapsed
                      ? "grid-rows-[1fr] opacity-100 lg:grid-rows-[0fr] lg:opacity-0"
                      : "grid-rows-[1fr] opacity-100",
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const label = t(item.labelKey);
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={onNavigate}
                          title={label}
                          aria-label={label}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center rounded-md font-medium transition-colors",
                              isSidebarOpen
                                ? "h-11 gap-3 px-3 text-body-m justify-start"
                                : "h-10 w-10 p-0 mx-auto justify-center lg:h-11 lg:w-full lg:px-3 lg:gap-3 lg:justify-start text-body-m",
                              isActive
                                ? "bg-primary text-navy-900 shadow-sm"
                                : "text-base-content opacity-70 hover:bg-base-200 hover:opacity-100",
                            )
                          }
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <span
                            className={
                              isSidebarOpen ? "inline" : "hidden lg:inline"
                            }
                          >
                            {label}
                          </span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
