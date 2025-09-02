import { ITrial, TrialStatus, useTrials } from "@/context/trialContext";
import * as React from "react";

const ProgressModal = ({ isOpen, closeModal }: ProgressModalProps) => {
  const { trials } = useTrials();

  const completedTrials = trials
    .map((trial): number =>
      trial.complete === TrialStatus.COMPLETE ||
      trial.complete === TrialStatus.PASSED
        ? 1
        : 0
    )
    .reduce((sum, val) => val + sum, 0);

  const renderStatusIcon = (trial: ITrial) => {
    if (trial.complete === TrialStatus.COMPLETE) {
      return (
        <div className="bg-green-500 w-4 h-4 rounded-[50%] mt-0.75 mx-1 flex justify-center items-center text-white leading-4">
          ✓
        </div>
      );
    } else if (trial.complete === TrialStatus.PASSED) {
      return (
        <div className="bg-gray-500 w-4 h-4 rounded-[50%] mt-0.75 mx-1 flex justify-center items-center text-white leading-4">
          ✓
        </div>
      );
    } else if (
      trial.years
        .map((year): number => (year.institutionIds.length > 0 ? 1 : 0))
        .reduce((acc, val) => acc + val, 0) !== 0
    ) {
      return (
        <div className="bg-yellow-400 w-4 h-4 rounded-[50%] mt-0.75 mx-1 flex justify-center items-center text-white">
          ⏱
        </div>
      );
    } else {
      return (
        <div className="bg-red-500 w-4 h-4 rounded-[50%] mt-0.75 mx-1 flex justify-center items-center text-white">
          ×
        </div>
      );
    }
  };

  if (!isOpen) {
    return <div></div>;
  }

  return (
    <div>
      <div
        className="bg-gray-500 opacity-50 z-10 fixed w-full h-full left-0 top-0"
        onClick={closeModal}
      ></div>
      <div className="bg-gray-200 z-20 absolute left-1/4 top-5 w-1/2 rounded-lg p-5">
        <div className="flex flex-row justify-between w-full">
          <div>
            Trial Progress Tracker - Overall Progress: {completedTrials} out of{" "}
            {trials.length} (
            {Math.round((completedTrials * 100) / trials.length)}%)
          </div>
          <button
            className="bg-red-300 px-2.5 py-1 rounded-sm hover:cursor-pointer hover:bg-red-500"
            onClick={closeModal}
          >
            ×
          </button>
        </div>
        <div className="px-5">
          {trials.map((trial, idx) => (
            <div key={trial.nctID} className="flex flex-row">
              {idx + 1}. {trial.nctID} {renderStatusIcon(trial)}
              {trial.years
                .map((year): number => (year.institutionIds.length > 0 ? 1 : 0))
                .reduce((acc, val) => acc + val, 0)}{" "}
              out of {trial.years.length}
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
