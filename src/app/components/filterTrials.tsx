import { IInstitution, nihContext } from "@/context/nihContext";
import * as React from "react";
import { useState, useEffect, useContext } from "react";
import InstitutionList, { getRenderInstitution } from "./institutionList";

const FilterTrials = ({ trialIdx, year }: FilterTrialsProps) => {
  const [filterText, setFilterText] = useState("");
  const [displayFilterText, setDisplayFilterText] = useState("");
  const [filteredInstitutions, setFilteredInstitutions] = useState<
    IInstitution[]
  >([]);

  const MAX_INSTITUTIONS = 500;

  const NIHFundingData = useContext(nihContext);

  useEffect(() => {
    setFilterText("");
    setDisplayFilterText("");
    const NIHYears = NIHFundingData.filter((ny) => ny.year === year);
    if (NIHYears.length > 0) {
      setFilteredInstitutions(NIHYears[0].institutions);
    }
  }, [trialIdx, year]);

  const handleFilterChange = () => {
    setDisplayFilterText(filterText);
    const NIHYears = NIHFundingData.filter((ny) => ny.year === year);
    if (NIHYears.length > 0) {
      setFilteredInstitutions(
        NIHYears[0].institutions.filter((inst) =>
          getRenderInstitution(inst)
            .toLowerCase()
            .includes(filterText.toLowerCase())
        )
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleFilterChange();
    }
  };

  const renderFilteredTrials = () => {
    const yearInstitutions = NIHFundingData.filter((ny) => ny.year === year)[0]
      .institutions;

    if (filteredInstitutions.length === yearInstitutions.length) {
      return <div></div>;
    } else if (filteredInstitutions.length === 0) {
      return (
        <div className="pl-2">
          No results found for your filter. Please verify spelling and any
          punctuation.
        </div>
      );
    } else if (filteredInstitutions.length > MAX_INSTITUTIONS) {
      return (
        <div className="pl-2">
          Your filter matches {filteredInstitutions.length} institutions which
          is more than the maximum allowable ({MAX_INSTITUTIONS}). Please refine
          your search.
        </div>
      );
    } else {
      return (
        <InstitutionList
          institutions={filteredInstitutions}
          highlight={displayFilterText}
          currentYear={year}
          trialIdx={trialIdx}
        />
      );
    }
  };

  return (
    <div>
      <div>Search all institutions:</div>
      <div>
        <input
          type="text"
          className="bg-white rounded-md mr-2 px-2 w-2/3"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className="bg-white rounded-md p-0.5 hover:cursor-pointer hover:bg-gray-200"
          onClick={handleFilterChange}
        >
          Search
        </button>
      </div>
      <div>{renderFilteredTrials()}</div>
    </div>
  );
};

export default FilterTrials;

interface FilterTrialsProps {
  trialIdx: number;
  year: number;
}
