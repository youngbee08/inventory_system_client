import React from "react";
import Modal from "./Modal";
import type { Deployment } from "../../lib/interfaces";

interface EditDeploymentDialogProps {
  isOpen: boolean;

  onCancel: () => void;
  deployment: Deployment | null;
}

const EditDeploymentDialog: React.FC<EditDeploymentDialogProps> = ({
  isOpen,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onCancel}>
      <div className=""></div>
    </Modal>
  );
};

export default EditDeploymentDialog;
