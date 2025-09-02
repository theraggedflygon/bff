import * as React from "react";
import { useState } from "react";
import { IYear, useTrials } from "@/context/trialContext";
import TrialYears from "./trialYears";
import InstitutionList from "./institutionList";

const TrialMenu = () => {
  const [trialIdx, setTrialIdx] = useState(0);
  const [trialIdxField, setTrialIdxField] = useState(1);
  const { trials, getInstitutionsByYear } = useTrials();

  const updateTrialIdx = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIdx = Number(e.target.value);
    if (!Number.isInteger(newIdx) || newIdx <= 0 || newIdx > trials.length) {
      setTrialIdxField(trialIdx + 1);
    } else {
      setTrialIdx(trialIdxField - 1);
    }
  };

  const incrTrialIdx = (diff: number) => {
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

  const renderSelectedInstitutions = (year: IYear) => {
    const institutions = getInstitutionsByYear(year.year);
    if (!institutions) {
      return;
    }
    return (
      <div key={trials[trialIdx].nctID + year.year}>
        {year.year} - {year.institutionIds.length}{" "}
        {year.institutionIds.length === 1 ? "Institution" : "Institutions"}
        <InstitutionList
          institutions={year.institutionIds.map(
            (id) => institutions.filter((inst) => inst.id === id)[0]
          )}
          currentYear={year.year}
          trialIdx={trialIdx}
          highlight={null}
        />
      </div>
    );
  };

  if (trials.length === 0) {
    return;
  }

  return (
    <div className="flex flex-row space-x-2">
      <div className="my-5 p-2 bg-blue-100 rounded-md w-1/2">
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
            onClick={() => incrTrialIdx(-1)}
            disabled={trialIdx === 0}
          >
            {"<"}
          </button>
          <button
            className="bg-gray-300 rounded-md px-3 hover:cursor-pointer hover:bg-gray-500 disabled:bg-gray-400 disabled:hover:cursor-not-allowed"
            onClick={() => incrTrialIdx(1)}
            disabled={trialIdx === trials.length - 1}
          >
            {">"}
          </button>
        </div>
        <div>
          Program:{" "}
          {trials[trialIdx].location.program === null
            ? "N/A"
            : trials[trialIdx].location.program}
        </div>
        <div>
          Country:{" "}
          {trials[trialIdx].location.country === null
            ? "N/A"
            : trials[trialIdx].location.country}
        </div>
        <div>
          City:{" "}
          {trials[trialIdx].location.city === null
            ? "N/A"
            : trials[trialIdx].location.city}
          {trials[trialIdx].location.state === null
            ? ""
            : ", " + trials[trialIdx].location.state}
        </div>
        <div>
          {trials[trialIdx].years.map((year) =>
            renderSelectedInstitutions(year)
          )}
        </div>
      </div>
      <TrialYears trialIdx={trialIdx} />
    </div>
  );
};

export default TrialMenu;
