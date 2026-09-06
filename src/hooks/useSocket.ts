import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { getSocketToast } from "../helpers/socket.helpers";
import SocketService, { ISocketMessage } from "../services/socket.service";
import { ToastTypes } from "../constants";

export interface INotification {
  id: string;
  message: string;
  data: Record<string, unknown>;
  created_at: string;
}

export const useSocket = () => {
  const { token, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    if (isAuthenticated && token) {
      SocketService.connect(token);
    } else {
      SocketService.disconnect();
    }

    const handleNotification = (data: ISocketMessage) => {
      const toast = getSocketToast(data);
      if (!toast) {
        return;
      }

      const notif: INotification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        message: toast.message,
        data: data.data || {},
        created_at: data.created_at || new Date().toISOString(),
      };
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notif.id)) return prev;
        return [notif, ...prev];
      });

      if (toast.kind === ToastTypes.SUCCESS) {
        success(toast.message);
        return;
      }

      if (toast.kind === ToastTypes.ERROR) {
        error(toast.message);
        return;
      }

      info(toast.message);
    };

    SocketService.addListener(handleNotification);

    return () => {
      SocketService.removeListener(handleNotification);
      // Don't disconnect here - let the effect handle it
    };
  }, [token, isAuthenticated, success, error, info]);

  const sendMessage = useCallback(
    (channel: string, message: string, data: Record<string, unknown> = {}) => {
      SocketService.sendMessage(channel, message, data);
    },
    [],
  );

  return {
    notifications,
    isConnected: SocketService.isConnectedToSocket(),
    sendMessage,
    SocketService,
  };
};
