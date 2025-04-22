import React, { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationContextProps {
  success: (message: string) => void;
  error: (message: string) => void;
  notify: (message: string) => void;
  warning: (message: string) => void;
}

export const NotificationContext = createContext<
  NotificationContextProps | undefined
>(undefined);

export const useNotifier = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifier must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("info");

  const showNotification = (message: string, type: NotificationType) => {
    setMessage(message);
    setType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const contextValue: NotificationContextProps = {
    success: (message) => showNotification(message, "success"),
    error: (message) => showNotification(message, "error"),
    notify: (message) => showNotification(message, "info"),
    warning: (message) => showNotification(message, "warning"),
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Slide}
      >
        <Alert
          severity={type}
          sx={{ width: "100%", fontSize: "1rem", fontWeight: 500 }}
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
