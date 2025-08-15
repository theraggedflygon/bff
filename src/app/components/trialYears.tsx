import * as React from "react";
import { useState, useEffect, useContext } from "react";
import difflib from "difflib";
import { ITrial } from "../page";
import { IInstitution, nihContext } from "@/context/nihContext";
import FilterEntry from "./filterTrials";

const TrialYears = ({ trials, trialIdx, setTrials }: TrialYearsProps) => {
  const [currentYear, setCurrentYear] = useState(
    trials[trialIdx].years[0].year
  );

  const NIHData = useContext(nihContext);

  useEffect(() => {
    if (trials[trialIdx].years.length > 0) {
      setCurrentYear(trials[trialIdx].years[0].year);
    }
  }, [trialIdx]);

  const getInstitutionsByYear = () => {
    const yearMatches = NIHData.filter((year) => year.year === currentYear);
    if (yearMatches.length === 0) {
      return null;
    }
    return yearMatches[0].institutions;
  };

  const getInstitutionIdsByTrialAndYear = () => {
    const yearMatches = trials[trialIdx].years.filter(
      (year) => year.year === currentYear
    );
    if (yearMatches.length === 0) {
      return null;
    }
    return yearMatches[0].institutionIds;
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (
      !Number.isNaN(e.target.value) &&
      Number.parseInt(e.target.value) !== currentYear &&
      trials[trialIdx].years.filter(
        (y) => y.year === Number.parseInt(e.target.value)
      ).length > 0
    ) {
      setCurrentYear(Number.parseInt(e.target.value));
    }
  };

  const getExactMatches = () => {
    const yearInstitutions = getInstitutionsByYear();
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
    const yearInstitutions = getInstitutionsByYear();
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

  const addInstitution = (id: number) => {
    const newTrials = [...trials];
    const yearIds = getInstitutionIdsByTrialAndYear();
    if (yearIds === null) {
      return;
    }
    if (yearIds.includes(id)) {
      return;
    }
    newTrials[trialIdx].years
      .filter((ty) => ty.year === currentYear)[0]
      .institutionIds.push(id);
    setTrials(newTrials);
  };

  const removeInstitution = (id: number) => {
    const newTrials = [...trials];
    const yearIds = getInstitutionIdsByTrialAndYear();
    if (yearIds === null) {
      return;
    }
    const removeIdx = yearIds.indexOf(id);
    if (removeIdx < 0) {
      return;
    }
    newTrials[trialIdx].years
      .filter((ty) => ty.year === currentYear)[0]
      .institutionIds.splice(removeIdx, 1);

    setTrials(newTrials);
  };

  const renderMatchDiv = (
    idx: number,
    institution: IInstitution,
    highlight: string | null = null
  ) => {
    const institutionString = getRenderInstitution(institution);
    if (highlight === null) {
      return (
        <div className="mr-auto">{`${idx + 1}. ${institutionString}`}</div>
      );
    } else {
      const highlightIndex = institutionString
        .toLowerCase()
        .indexOf(highlight.toLowerCase());
      const preHighlightStr = institutionString.slice(0, highlightIndex);
      const highlightStr = institutionString.slice(
        highlightIndex,
        highlightIndex + highlight.length
      );
      const postHighlightStr = institutionString.slice(
        highlightIndex + highlight.length
      );
      return (
        <div className="whitespace-pre-wrap mr-auto">
          <span>
            {preHighlightStr}
            <span className="bg-yellow-300">{highlightStr}</span>
            {postHighlightStr}
          </span>
        </div>
      );
    }
  };

  const renderMatches = (
    matches: IInstitution[],
    highlight: string | null = null
  ) => {
    const currentIds = getInstitutionIdsByTrialAndYear();

    return (
      <div className="px-2">
        {matches.map((match, idx) => {
          if (currentIds?.includes(match.id)) {
            return (
              <div
                key={idx}
                className="flex flex-row py-1 hover:bg-blue-500 px-2 rounded-lg "
              >
                {renderMatchDiv(idx, match, highlight)}
                <button
                  className="bg-red-500 px-1.5 rounded-sm hover:cursor-pointer mx-1"
                  onClick={() => removeInstitution(match.id)}
                >
                  ×
                </button>
                <button className="bg-red-500 px-1.5 rounded-sm hover:cursor-pointer">
                  ××
                </button>
              </div>
            );
          }
          return (
            <div
              key={idx}
              className="flex flex-row py-1 hover:bg-blue-500 px-2 rounded-lg "
            >
              {renderMatchDiv(idx, match, highlight)}
              <button
                className="bg-green-500 px-1.5 rounded-sm hover:cursor-pointer mx-1"
                onClick={() => addInstitution(match.id)}
              >
                +
              </button>
              <button className="bg-green-500 px-1.5 rounded-sm hover:cursor-pointer">
                ++
              </button>
            </div>
          );
        })}
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
          className="bg-white rounded-md p-1 ml-2 hover:cursor-pointer"
          onChange={handleSelect}
          value={currentYear}
        >
          {trials[trialIdx].years.map((year) => (
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
      <FilterEntry
        trialIdx={trialIdx}
        year={currentYear}
        renderMatches={renderMatches}
      />
    </div>
  );
};

export const getRenderInstitution = (institution: IInstitution): string => {
  return `${institution.name} (${institution.city}, ${
    institution.state
      ? institution.state + ", " + institution.country
      : institution.country
  })`;
};

export default TrialYears;

interface TrialYearsProps {
  trials: ITrial[];
  trialIdx: number;
  setTrials: React.Dispatch<React.SetStateAction<ITrial[]>>;
}
