import React from "react";
import { Button } from "../button";
import { Dialog } from "./Dialog";

interface IAlertDialogProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  title?: string;
}

export const AlertDialog: React.FC<IAlertDialogProps> = ({
  isOpen,
  message,
  onClose,
  title = "Something went wrong",
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-md"
      footer={<Button onClick={onClose}>OK</Button>}
    >
      <p className="whitespace-pre-wrap text-body-m text-base-content/70">
        {message}
      </p>
    </Dialog>
  );
};
