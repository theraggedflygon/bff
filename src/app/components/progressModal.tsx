import { useTrials } from "@/context/trialContext";
import * as React from "react";

const ProgressModal = ({ isOpen, closeModal }: ProgressModalProps) => {
  if (!isOpen) {
    return <div></div>;
  }

  const { trials } = useTrials();

  return (
    <div>
      <div
        className="bg-gray-500 opacity-50 z-10 fixed w-full h-full left-0 top-0"
        onClick={closeModal}
      ></div>
      <div className="bg-gray-200 z-20 fixed left-1/4 w-1/2 rounded-lg p-5">
        <div className="flex flex-row justify-between w-full">
          <div>Trial Progress Tracker</div>
          <button className="bg-red-500 px-1.5 rounded-sm hover:cursor-pointer">
            ×
          </button>
        </div>
        <div className="px-5">
          {trials.map((trial, idx) => (
            <div>
              {idx + 1}. {trial.nctID} - {trial.complete}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;

interface ProgressModalProps {
  isOpen: boolean;
  closeModal: () => void;
}
