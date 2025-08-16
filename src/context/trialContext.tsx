import { useState, createContext, useContext, ReactNode } from "react";
import { nihContext, IInstitution } from "./nihContext";

export const TrialsContext = createContext<TrialAPI | undefined>(undefined);

export const TrialsProvider = ({ children }: { children: ReactNode }) => {
  const NIHData = useContext(nihContext);

  const [trials, setTrials] = useState<ITrial[]>([]);

  const getInstitutionsByYear = (currentYear: number) => {
    const yearMatches = NIHData.filter((year) => year.year === currentYear);
    if (yearMatches.length === 0) {
      return null;
    }
    return yearMatches[0].institutions;
  };

  const getInstitutionIdsByTrialAndYear = (
    trialIdx: number,
    currentYear: number
  ) => {
    const yearMatches = trials[trialIdx].years.filter(
      (year) => year.year === currentYear
    );
    if (yearMatches.length === 0) {
      return null;
    }
    return yearMatches[0].institutionIds;
  };

  const initializeTrials = (newTrials: ITrial[]) => {
    setTrials(newTrials);
  };

  const addInstitution = (
    id: number,
    trialIdx: number,
    currentYear: number
  ) => {
    const newTrials = [...trials];
    const yearIds = getInstitutionIdsByTrialAndYear(trialIdx, currentYear);
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

  const removeInstitution = (
    id: number,
    trialIdx: number,
    currentYear: number
  ) => {
    const newTrials = [...trials];
    const yearIds = getInstitutionIdsByTrialAndYear(trialIdx, currentYear);
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

  return (
    <TrialsContext.Provider
      value={{
        trials: trials,
        initializeTrials: initializeTrials,
        addInstitution: addInstitution,
        removeInstitution: removeInstitution,
        getInstitutionIdsByTrialAndYear: getInstitutionIdsByTrialAndYear,
        getInstitutionsByYear: getInstitutionsByYear,
      }}
    >
      {children}
    </TrialsContext.Provider>
  );
};

export const useTrials = () => {
  const context = useContext(TrialsContext);
  if (!context)
    throw new Error("useTrials hook must be used inside TrialsProvider");
  return context;
};

export interface ITrial {
  nctID: string;
  years: IYear[];
  location: ILocation;
}

export interface IYear {
  year: number;
  institutionIds: number[];
}

export interface ILocation {
  country: string | null;
  city: string | null;
  state: string | null;
  program: string | null;
}

interface TrialAPI {
  trials: ITrial[];
  initializeTrials: (newTrials: ITrial[]) => void;
  getInstitutionsByYear: (currentYear: number) => IInstitution[] | null;
  getInstitutionIdsByTrialAndYear: (
    trialIdx: number,
    currentYear: number
  ) => number[] | null;
  addInstitution: (id: number, trialIdx: number, currentYear: number) => void;
  removeInstitution: (
    id: number,
    trialIdx: number,
    currentYear: number
  ) => void;
}
