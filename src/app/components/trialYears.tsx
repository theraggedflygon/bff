import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { ITrial } from "../page";
import { IInstitution, nihContext } from "@/context/nihContext";

const difflib = require("difflib");

const TrialYears = ({ trial, trialIdx }: TrialYearsProps) => {
  const [currentYear, setCurrentYear] = useState(trial.years[0].year);
  const NIHData = useContext(nihContext);

  useEffect(() => {
    if (trial.years.length > 0) {
      setCurrentYear(trial.years[0].year);
    }
  }, [trialIdx]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (
      !Number.isNaN(e.target.value) &&
      Number.parseInt(e.target.value) !== currentYear &&
      trial.years.filter((y) => y.year === Number.parseInt(e.target.value))
        .length > 0
    ) {
      setCurrentYear(Number.parseInt(e.target.value));
    }
  };

  const getExactMatches = () => {
    const yearInstitutions = NIHData.filter((val) => val.year === currentYear);
    if (yearInstitutions.length > 0) {
      return yearInstitutions[0].institutions.filter(
        (inst) =>
          inst.name.toLowerCase() === trial.location.program?.toLowerCase()
      );
    }
    return [];
  };

  const getNearMatches = () => {
    const yearInstitutions = NIHData.filter((val) => val.year === currentYear);
    if (yearInstitutions.length > 0 && trial.location.program) {
      const matches = difflib.getCloseMatches(
        trial.location.program.toLowerCase(),
        yearInstitutions[0].institutions.map(
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
        fullMatches.push(yearInstitutions[0].institutions[idx]);
      }
      return fullMatches;
    }

    return [];
  };

  const renderMatches = (matches: IInstitution[]) => {
    return (
      <div className="px-2">
        {matches.map((match, idx) => (
          <div
            key={idx}
            className="flex flex-row py-1 hover:bg-blue-500 px-2 rounded-lg "
          >
            <div className="mr-auto">{`${idx + 1}. ${match.name} (${
              match.city
            }, ${
              match.state ? match.state + ", " + match.country : match.country
            })`}</div>
            <button className="bg-green-500 px-1.5 rounded-sm hover:cursor-pointer">
              +
            </button>
          </div>
        ))}
      </div>
    );
  };

  const exactMatches = getExactMatches();
  const nearMatches = getNearMatches();

  return (
    <div className="my-5 p-2 bg-blue-100 rounded-md w-1/2">
      <div className="flex flex-row">
        <div>Find Funding for </div>
        <select
          name="year"
          id="year-select"
          className="bg-white rounded-md p-1 ml-2"
          onChange={handleSelect}
          value={currentYear}
        >
          {trial.years.map((year) => (
            <option value={year.year} key={year.year}>
              {year.year}
            </option>
          ))}
        </select>
      </div>
      <div>Exact matches for this trial:</div>
      <div>{renderMatches(exactMatches)}</div>
      <div>Nearest matches for this trial:</div>
      <div>{renderMatches(nearMatches)}</div>
    </div>
  );
};

export default TrialYears;

interface TrialYearsProps {
  trial: ITrial;
  trialIdx: number;
}
