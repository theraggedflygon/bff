import * as React from "react";

const ProgressModal = ({ isOpen }: ProgressModalProps) => {
  if (!isOpen) {
    return <div></div>;
  }

  return (
    <div className="bg-gray-300 z-10">
      <div>Hello World!</div>
    </div>
  );
};

export default ProgressModal;

interface ProgressModalProps {
  isOpen: boolean;
}
