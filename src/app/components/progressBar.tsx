import * as React from "react";
import { useTrials } from "@/context/trialContext";

const ProgressBar = ({ openModal }: ProgressBarProps) => {
  const { trials } = useTrials();

  const completedTrials = trials
    .map((trial): number => (trial.complete ? 1 : 0))
    .reduce((sum, val) => val + sum, 0);

  if (trials.length === 0) {
    return <div></div>;
  }

  return (
    <div className="flex flex-row items-center pt-6 space-x-2">
      <div>
        {completedTrials} out of {trials.length}{" "}
        {trials.length === 1 ? "Trial Complete " : "Trials Complete "}(
        {Math.round((completedTrials * 100) / trials.length)}%)
      </div>
      <button
        className="bg-blue-200 rounded-md p-2 hover:cursor-pointer hover:bg-blue-400"
        onClick={openModal}
      >
        Details
      </button>
    </div>
  );
};

export default ProgressBar;

interface ProgressBarProps {
  openModal: () => void;
}
