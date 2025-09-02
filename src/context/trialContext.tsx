import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { nihContext, IInstitution } from "./nihContext";
import { getRenderInstitution } from "@/app/components/institutionList";

export const TrialsContext = createContext<TrialAPI | undefined>(undefined);

export const TrialsProvider = ({ children }: { children: ReactNode }) => {
  const NIHData = useContext(nihContext);

  const [trials, setTrials] = useState<ITrial[]>([]);
  const [aliases, setAliases] = useState<IAlias[]>([]);

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

  const getInstitutionsByTrial = (trialIdx: number) => {
    const allInstitutions: IInstitution[] = [];
    const allInstStrings: string[] = [];

    trials[trialIdx].years.forEach((year) => {
      const yearInstitutions = getInstitutionsByYear(year.year);
      if (yearInstitutions === null) {
        return;
      }
      yearInstitutions.forEach((inst) => {
        const instStr = getRenderInstitution(inst);
        if (!allInstStrings.includes(instStr)) {
          allInstStrings.push(instStr);
          allInstitutions.push(inst);
        }
      });
    });

    return allInstitutions;
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

  useEffect(() => {
    console.log(aliases);
  }, [aliases]);

  const addAlias = (trialIdx: number, nihInst: string) => {
    const trialInst = trials[trialIdx].location.program;
    if (!trialInst) {
      return;
    }
    const newAliases = [...aliases];
    const currentAliases = aliases.filter((alias) => alias.name === trialInst);

    if (currentAliases.length === 0) {
      newAliases.push({ name: trialInst, aliases: [nihInst] });
    } else if (currentAliases[0].aliases.includes(nihInst)) {
      return;
    } else {
      currentAliases[0].aliases.push(nihInst);
    }

    setAliases(newAliases);

    const trialsToUpdate = trials
      .map((trial, idx) => ({
        trial,
        idx,
      }))
      .filter(
        (tuple) =>
          tuple.trial.location.program?.toLowerCase() ===
          trialInst.toLowerCase()
      )
      .map((tuple) => tuple.idx);

    const newTrials = [...trials];
    trialsToUpdate.forEach((trialIdx) => {
      const trial = newTrials[trialIdx];
      trial.years.forEach((yearData) => {
        const yearInst = getInstitutionsByYear(yearData.year);
        if (yearInst === null) {
          return;
        }
        const filteredYearInst = yearInst.filter(
          (inst) => inst.name.toLowerCase() === nihInst.toLowerCase()
        );
        filteredYearInst.forEach((filterInst) => {
          if (!yearData.institutionIds.includes(filterInst.id)) {
            yearData.institutionIds.push(filterInst.id);
          }
        });
      });
    });
    setTrials(newTrials);
  };

  const removeAlias = (trialIdx: number, nihInst: string) => {
    const trialInst = trials[trialIdx].location.program;
    if (!trialInst) {
      return;
    }
    const newAliases = [...aliases];
    const currentAliases = aliases.filter((alias) => alias.name === trialInst);

    if (currentAliases.length === 0) {
      return;
    }

    const removeIdx = currentAliases[0].aliases.indexOf(nihInst);
    console.log(aliases);
    if (removeIdx < 0) {
      return;
    }

    currentAliases[0].aliases.splice(removeIdx, 1);
    setAliases(newAliases);

    const trialsToUpdate = trials
      .map((trial, idx) => ({
        trial,
        idx,
      }))
      .filter(
        (tuple) =>
          tuple.trial.location.program?.toLowerCase() ===
          trialInst.toLowerCase()
      )
      .map((tuple) => tuple.idx);

    const newTrials = [...trials];
    trialsToUpdate.forEach((trialIdx) => {
      const trial = newTrials[trialIdx];
      trial.years.forEach((yearData) => {
        const yearInst = getInstitutionsByYear(yearData.year);
        if (yearInst === null) {
          return;
        }
        const newInstIds: number[] = [];
        yearData.institutionIds.forEach((instId) => {
          const filteredYearInst = yearInst.filter(
            (inst) => inst.id === instId
          );
          if (filteredYearInst.length === 0) {
            return;
          }
          if (
            filteredYearInst[0].name.toLowerCase() !== nihInst.toLowerCase()
          ) {
            newInstIds.push(instId);
          }
          yearData.institutionIds = newInstIds;
        });
      });
    });
    setTrials(newTrials);
  };

  return (
    <TrialsContext.Provider
      value={{
        trials: trials,
        aliases: aliases,
        initializeTrials: initializeTrials,
        addInstitution: addInstitution,
        removeInstitution: removeInstitution,
        addAlias: addAlias,
        removeAlias: removeAlias,
        getInstitutionIdsByTrialAndYear: getInstitutionIdsByTrialAndYear,
        getInstitutionsByYear: getInstitutionsByYear,
        getInstitutionsByTrial: getInstitutionsByTrial,
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

export interface IAlias {
  name: string;
  aliases: string[];
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
  aliases: IAlias[];
  initializeTrials: (newTrials: ITrial[]) => void;
  getInstitutionsByYear: (currentYear: number) => IInstitution[] | null;
  getInstitutionIdsByTrialAndYear: (
    trialIdx: number,
    currentYear: number
  ) => number[] | null;
  getInstitutionsByTrial: (trialIdx: number) => IInstitution[];
  addInstitution: (id: number, trialIdx: number, currentYear: number) => void;
  removeInstitution: (
    id: number,
    trialIdx: number,
    currentYear: number
  ) => void;
  addAlias: (trialIdx: number, nihInst: string) => void;
  removeAlias: (trialIdx: number, nihInst: string) => void;
}
