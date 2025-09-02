import * as React from "react";
import { IInstitution } from "@/context/nihContext";
import { useTrials } from "@/context/trialContext";

const InstitutionList = ({
  institutions,
  highlight,
  trialIdx,
  currentYear,
}: InstitutionListProps) => {
  const {
    addInstitution,
    removeInstitution,
    getInstitutionIdsByTrialAndYear,
    addAlias,
    removeAlias,
  } = useTrials();

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

  const { trials, aliases } = useTrials();

  const filteredAliases = trials[trialIdx].location.program
    ? aliases.filter(
        (alias) =>
          alias.name.toLowerCase() ===
          trials[trialIdx].location.program?.toLowerCase()
      )
    : [];
  const trialAliases: string[] =
    filteredAliases.length > 0
      ? filteredAliases[0].aliases.map((alias) => alias.toLowerCase())
      : [];

  if (currentYear === 0) {
    return (
      <div className="px-2">
        {institutions.map((inst, idx) => {
          if (trialAliases.includes(inst.name.toLowerCase())) {
            return (
              <div
                key={idx}
                className="flex flex-row py-1 hover:bg-blue-500 px-2 rounded-lg "
              >
                {renderMatchDiv(idx, inst, highlight)}
                <button
                  className="bg-red-500 px-1.5 rounded-sm hover:cursor-pointer"
                  onClick={() => removeAlias(trialIdx, inst.name)}
                >
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
              {renderMatchDiv(idx, inst, highlight)}
              <button
                className="bg-green-500 px-1.5 rounded-sm hover:cursor-pointer"
                onClick={() => addAlias(trialIdx, inst.name)}
              >
                ++
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  const currentIds = getInstitutionIdsByTrialAndYear(trialIdx, currentYear);

  if (currentIds === null) {
    return <div></div>;
  }

  return (
    <div className="px-2">
      {institutions.map((inst, idx) => {
        if (currentIds.includes(inst.id)) {
          return (
            <div
              key={idx}
              className="flex flex-row py-1 hover:bg-blue-500 px-2 rounded-lg "
            >
              {renderMatchDiv(idx, inst, highlight)}
              <button
                className="bg-red-500 px-1.5 rounded-sm hover:cursor-pointer mx-1"
                onClick={() =>
                  removeInstitution(inst.id, trialIdx, currentYear)
                }
              >
                ×
              </button>
              <button
                className="bg-red-500 px-1.5 rounded-sm hover:cursor-pointer"
                onClick={() => removeAlias(trialIdx, inst.name)}
              >
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
            {renderMatchDiv(idx, inst, highlight)}
            <button
              className="bg-green-500 px-1.5 rounded-sm hover:cursor-pointer mx-1"
              onClick={() => addInstitution(inst.id, trialIdx, currentYear)}
            >
              +
            </button>
            <button
              className="bg-green-500 px-1.5 rounded-sm hover:cursor-pointer"
              onClick={() => addAlias(trialIdx, inst.name)}
            >
              ++
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default InstitutionList;

export const getRenderInstitution = (institution: IInstitution): string => {
  return `${institution.name} (${institution.city}, ${
    institution.state
      ? institution.state + ", " + institution.country
      : institution.country
  })`;
};

interface InstitutionListProps {
  institutions: IInstitution[];
  highlight: string | null;
  trialIdx: number;
  currentYear: number;
}
