import * as React from "react";
import { useState, useEffect } from "react";
import difflib from "difflib";
import { useTrials } from "@/context/trialContext";
import FilterEntry from "./filterTrials";
import InstitutionList from "./institutionList";

const TrialYears = ({ trialIdx }: TrialYearsProps) => {
  const {
    trials,
    getInstitutionsByYear,
    getInstitutionIdsByTrialAndYear,
    getInstitutionsByTrial,
  } = useTrials();

  const [currentYear, setCurrentYear] = useState(0);

  useEffect(() => {
    if (trials[trialIdx].years.length === 1) {
      setCurrentYear(trials[trialIdx].years[0].year);
    } else {
      setCurrentYear(0);
    }
  }, [trialIdx]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (
      !Number.isNaN(e.target.value) &&
      Number.parseInt(e.target.value) !== currentYear &&
      (trials[trialIdx].years.filter(
        (y) => y.year === Number.parseInt(e.target.value)
      ).length > 0 ||
        Number.parseInt(e.target.value) === 0)
    ) {
      setCurrentYear(Number.parseInt(e.target.value));
    }
  };

  const getExactMatches = () => {
    let yearInstitutions;
    if (currentYear === 0) {
      yearInstitutions = getInstitutionsByTrial(trialIdx);
    } else {
      yearInstitutions = getInstitutionsByYear(currentYear);
    }

    if (yearInstitutions !== null) {
      return yearInstitutions.filter(
        (inst) =>
          inst.name.toLowerCase() ===
          trials[trialIdx].location.program?.toLowerCase()
      );
    }
    return [];
  };

  const getNearMatches = () => {
    let yearInstitutions;
    if (currentYear === 0) {
      yearInstitutions = getInstitutionsByTrial(trialIdx);
    } else {
      yearInstitutions = getInstitutionsByYear(currentYear);
    }

    if (yearInstitutions !== null && trials[trialIdx].location.program) {
      const matches = difflib.getCloseMatches(
        trials[trialIdx].location.program.toLowerCase(),
        yearInstitutions.map(
          (inst, idx) => inst.name.toLowerCase() + "-" + idx
        ),
        10,
        0
      );

      const fullMatches = [];
      for (let i = 0; i < matches.length; i++) {
        const chunks = matches[i].split("-");
        const idx = Number.parseInt(chunks[chunks.length - 1]);
        if (Number.isNaN(idx)) {
          return [];
        }
        fullMatches.push(yearInstitutions[idx]);
      }
      return fullMatches;
    }

    return [];
  };

  const exactMatches = getExactMatches();
  const nearMatches = getNearMatches();
  const currentIds = getInstitutionIdsByTrialAndYear(trialIdx, currentYear);

  return (
    <div className="my-5 p-2 bg-blue-100 rounded-md w-1/2">
      <div className="flex flex-row">
        <div>Find Funding for </div>
        <select
          name="year"
          id="year-select"
          className="bg-white rounded-md p-1 ml-2 hover:cursor-pointer"
          onChange={handleSelect}
          value={currentYear}
        >
          <option value={0} key={0}>
            All
          </option>
          {trials[trialIdx].years.map((year) => (
            <option value={year.year} key={year.year}>
              {year.year}
            </option>
          ))}
        </select>
      </div>
      <div>Exact matches for this trial:</div>
      <InstitutionList
        institutions={exactMatches}
        highlight={null}
        currentYear={currentYear}
        trialIdx={trialIdx}
      />
      <div>Nearest matches for this trial:</div>
      <InstitutionList
        institutions={nearMatches}
        highlight={null}
        currentYear={currentYear}
        trialIdx={trialIdx}
      />
      <FilterEntry trialIdx={trialIdx} year={currentYear} />
    </div>
  );
};

export default TrialYears;

interface TrialYearsProps {
  trialIdx: number;
}
