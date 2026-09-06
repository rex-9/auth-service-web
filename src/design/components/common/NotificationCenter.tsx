// src/design/components/common/NotificationCenter.tsx

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { iconsLib } from "../../../assets";
import { AppLocales, translate } from "../../../locales";
import {
  IUserNotification,
  NotificationController,
  NotificationFilter,
  NOTIFICATION_FILTERS,
} from "../../../modules/notification";
import socketService, { ISocketMessage } from "../../../services/socket.service";
import { Button } from "../button";
import { Dropdown, DropdownSizes } from "../form/Dropdown";
import { ButtonTypes, ButtonVariants, ComponentSizes } from "../../constants";
import { cn } from "../../helpers";
import { formatDateTime } from "../../../helpers/date.helper";
import type { IApiPagination } from "../../../models";

export interface INotificationCenterProps {
  className?: string;
}

export const NotificationCenter: React.FC<INotificationCenterProps> = ({
  className,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<IUserNotification[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [filter, setFilter] = useState<NotificationFilter>(NOTIFICATION_FILTERS.ALL);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch unread count for badge
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await NotificationController.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, []);

  // Fetch paginated notifications
  const fetchNotifications = useCallback(
    async (page: number = 1, currentFilter: NotificationFilter = filter) => {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const result = await NotificationController.getNotifications({
          page,
          limit: 20,
          filter: currentFilter,
        });

        setNotifications((prev) =>
          page === 1 ? result.records : [...prev, ...result.records],
        );
        setPagination(result.pagination);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [filter],
  );

  // Initial load of unread count
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // When opening or filter changing, load notifications
  useEffect(() => {
    if (isOpen) {
      fetchNotifications(1, filter);
      fetchUnreadCount();
    }
  }, [isOpen, filter, fetchNotifications, fetchUnreadCount]);

  // Handle outside click & Esc key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Real-time Action Cable socket listener
  useEffect(() => {
    const handleSocketMessage = (msg: ISocketMessage) => {
      // If message is an in-app notification payload
      const raw = (msg as any).data || msg;
      const notificationId = raw.id || (msg as any).id;
      const title = raw.title || msg.message;

      if (notificationId && title) {
        const newNotification: IUserNotification = {
          id: notificationId,
          title: title,
          message: raw.message || "",
          link: raw.link || null,
          data: raw.data || {},
          read: false,
          read_at: null,
          notification_id: raw.notification_id || null,
          created_at: raw.created_at || new Date().toISOString(),
        };

        setUnreadCount((prev) => prev + 1);

        setNotifications((prev) => {
          // Prevent duplicates
          if (prev.some((n) => n.id === newNotification.id)) return prev;
          if (filter === NOTIFICATION_FILTERS.READ) return prev;
          return [newNotification, ...prev];
        });
      }
    };

    socketService.addListener(handleSocketMessage);
    return () => {
      socketService.removeListener(handleSocketMessage);
    };
  }, [filter]);

  // Mark single as read & navigate if link exists
  const handleItemClick = async (item: IUserNotification) => {
    if (!item.read) {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === item.id ? { ...n, read: true, read_at: new Date().toISOString() } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await NotificationController.markAsRead(item.id);
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }

    if (item.link) {
      setIsOpen(false);
      navigate(item.link);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true, read_at: new Date().toISOString() })),
    );
    setUnreadCount(0);

    try {
      await NotificationController.markAllAsRead();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      fetchUnreadCount();
    }
  };

  // Delete an individual notification
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    const target = notifications.find((n) => n.id === id);
    // Optimistic removal
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (target && !target.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      await NotificationController.deleteNotification(id);
    } catch (err) {
      console.error("Failed to delete notification:", err);
      fetchNotifications(1, filter);
    }
  };

  // Filter options for Dropdown
  const filterOptions = [
    { value: NOTIFICATION_FILTERS.ALL, label: translate(AppLocales.Notifications.FilterAll) },
    { value: NOTIFICATION_FILTERS.UNREAD, label: translate(AppLocales.Notifications.FilterUnread) },
    { value: NOTIFICATION_FILTERS.READ, label: translate(AppLocales.Notifications.FilterRead) },
  ];

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {/* Bell Trigger Button */}
      <Button
        type={ButtonTypes.BUTTON}
        variant={ButtonVariants.TERTIARY}
        size={ComponentSizes.SM}
        className="relative h-10 w-10 p-0 inline-flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={translate(AppLocales.Notifications.Title)}
        title={translate(AppLocales.Notifications.Title)}
      >
        <iconsLib.bell className="h-5 w-5 text-base-content/80 hover:text-base-content transition-colors" />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-base-100 animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={translate(AppLocales.Notifications.Title)}
          className={cn(
            "absolute right-0 top-12 z-50 mt-1 w-84 sm:w-96 rounded-2xl border border-base-300 bg-base-100 shadow-2xl overflow-hidden flex flex-col font-primary",
            "max-h-[85vh] animate-in fade-in-0 zoom-in-95 duration-150",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-base-200 px-4 py-3 bg-base-100/90 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <h3 className="text-body-m font-bold text-base-content">
                {translate(AppLocales.Notifications.Title)}
              </h3>
              {unreadCount > 0 && (
                <span className="badge badge-primary badge-sm font-semibold">
                  {unreadCount} {translate(AppLocales.Notifications.FilterUnread).toLowerCase()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="text-caption text-primary hover:text-primary-focus transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  title={translate(AppLocales.Notifications.MarkAllRead)}
                >
                  <iconsLib.checkr className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {translate(AppLocales.Notifications.MarkAllRead)}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="px-4 py-2 border-b border-base-200 bg-base-200/40 flex items-center justify-between gap-2">
            <span className="text-caption font-medium text-base-content/60">
              Filter:
            </span>
            <div className="w-32">
              <Dropdown
                options={filterOptions}
                value={filter}
                onValueChange={(val) => setFilter(val as NotificationFilter)}
                size={DropdownSizes.SM}
                className="w-full text-caption"
              />
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-base-200/60 min-h-[160px] max-h-[460px]">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse items-start">
                    <div className="w-2 h-2 rounded-full bg-base-300 mt-2 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-base-300 rounded w-3/4" />
                      <div className="h-3 bg-base-200 rounded w-full" />
                      <div className="h-2.5 bg-base-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-base-content/60">
                <iconsLib.bell className="w-10 h-10 mb-2 stroke-1 opacity-40 text-base-content" />
                <p className="font-semibold text-body-s text-base-content/80">
                  {filter === NOTIFICATION_FILTERS.UNREAD
                    ? translate(AppLocales.Notifications.EmptyUnread)
                    : filter === NOTIFICATION_FILTERS.READ
                      ? translate(AppLocales.Notifications.EmptyRead)
                      : translate(AppLocales.Notifications.EmptyAll)}
                </p>
                <p className="text-caption text-base-content/50 mt-1 max-w-[240px]">
                  {translate(AppLocales.Notifications.EmptyDesc)}
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer text-left select-none",
                    item.read
                      ? "hover:bg-base-200/50 bg-base-100"
                      : "bg-primary/5 hover:bg-primary/10",
                  )}
                >
                  {/* Unread dot indicator */}
                  <div className="pt-1.5 shrink-0">
                    <span
                      className={cn(
                        "block w-2 h-2 rounded-full transition-colors",
                        item.read ? "bg-transparent" : "bg-primary shadow-sm",
                      )}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <h4
                      className={cn(
                        "text-body-s line-clamp-1",
                        item.read
                          ? "font-medium text-base-content/80"
                          : "font-bold text-base-content",
                      )}
                    >
                      {item.title}
                    </h4>
                    <p className="text-caption text-base-content/70 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.message}
                    </p>
                    <span className="text-[11px] text-base-content/40 mt-1.5 block">
                      {formatDateTime(item.created_at)}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item.id)}
                    className="absolute right-2.5 top-3 p-1.5 rounded-lg text-base-content/40 hover:text-error hover:bg-base-200/80 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    title={translate(AppLocales.Notifications.Delete)}
                    aria-label={translate(AppLocales.Notifications.Delete)}
                  >
                    <iconsLib.trash className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}

            {/* Load More Button */}
            {pagination?.next_page && (
              <div className="p-3 text-center border-t border-base-200 bg-base-100">
                <button
                  type="button"
                  disabled={isLoadingMore}
                  onClick={() => fetchNotifications((pagination.current_page || 1) + 1, filter)}
                  className="text-body-s font-medium text-primary hover:text-primary-focus transition-colors disabled:opacity-50 cursor-pointer py-1 px-3 rounded-lg hover:bg-primary/10"
                >
                  {isLoadingMore
                    ? translate(AppLocales.Notifications.Loading)
                    : translate(AppLocales.Notifications.LoadMore)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
