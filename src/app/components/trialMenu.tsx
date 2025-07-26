import * as React from "react";
import { useState } from "react";
import { ITrial } from "../page";

const TrialMenu = ({ trials }: TrialMenuProps) => {
  const [trialIdx, setTrialIdx] = useState(0);
  const [trialIdxField, setTrialIdxField] = useState(1);

  const updateTrialIdx = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIdx = Number(e.target.value);
    if (!Number.isInteger(newIdx) || newIdx <= 0 || newIdx > trials.length) {
      setTrialIdxField(trialIdx + 1);
    } else {
      setTrialIdx(trialIdxField - 1);
    }
  };

  const IncrTrialIdx = (diff: number) => {
    if (trialIdx + diff >= 0 && trialIdx + diff < trials.length) {
      setTrialIdx(trialIdx + diff);
      setTrialIdxField(trialIdxField + diff);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!Number.isInteger(Number(e.target.value))) {
      return;
    }
    setTrialIdxField(Number(e.target.value));
  };

  if (trials.length === 0) {
    return;
  }

  return (
    <div className="my-5 p-2 bg-blue-100 rounded-md">
      <div className="font-bold text-lg flex flex-row">
        <div>
          <a
            className="hover:underline hover:cursor-pointer"
            target="_blank"
            href={`https://www.clinicaltrials.gov/study/${trials[trialIdx].nctID}`}
          >
            {trials[trialIdx].nctID}
          </a>
          {" ("}
        </div>
        <input
          type="text"
          className="w-15 bg-white rounded-md text-right mr-2 px-2"
          value={trialIdxField}
          onChange={handleChange}
          onBlur={updateTrialIdx}
        />
        <div>{" of " + trials.length + ")"}</div>
        <button
          className="bg-gray-300 rounded-md px-3 mx-2 hover:cursor-pointer hover:bg-gray-500 disabled:bg-gray-400 disabled:hover:cursor-not-allowed"
          onClick={() => IncrTrialIdx(-1)}
          disabled={trialIdx === 0}
        >
          {"<"}
        </button>
        <button
          className="bg-gray-300 rounded-md px-3 hover:cursor-pointer hover:bg-gray-500 disabled:bg-gray-400 disabled:hover:cursor-not-allowed"
          onClick={() => IncrTrialIdx(1)}
          disabled={trialIdx === trials.length - 1}
        >
          {">"}
        </button>
      </div>
      <div>
        Program:{" "}
        {trials[trialIdx].program === null ? "N/A" : trials[trialIdx].program}
      </div>
      <div>
        Country:{" "}
        {trials[trialIdx].country === null ? "N/A" : trials[trialIdx].country}
      </div>
      <div>
        City: {trials[trialIdx].city === null ? "N/A" : trials[trialIdx].city}
        {trials[trialIdx].state === null ? "" : ", " + trials[trialIdx].state}
      </div>
    </div>
  );
};

interface TrialMenuProps {
  trials: ITrial[];
}

export default TrialMenu;
