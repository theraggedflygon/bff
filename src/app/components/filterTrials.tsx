import { IInstitution, nihContext } from "@/context/nihContext";
import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { getRenderInstitution, renderMatches } from "./trialYears";

const FilterTrials = ({ trialIdx, year }: FilterTrialsProps) => {
  const [filterText, setFilterText] = useState("");
  const [filteredInstitutions, setFilteredInstitutions] = useState<
    IInstitution[]
  >([]);

  const MAX_INSTITUTIONS = 500;

  const NIHFundingData = useContext(nihContext);

  useEffect(() => {
    setFilterText("");
    const NIHYears = NIHFundingData.filter((ny) => ny.year === year);
    if (NIHYears.length > 0) {
      setFilteredInstitutions(NIHYears[0].institutions);
    }
  }, [trialIdx, year]);

  const handleFilterChange = () => {
    const NIHYears = NIHFundingData.filter((ny) => ny.year === year);
    if (NIHYears.length > 0) {
      setFilteredInstitutions(
        NIHYears[0].institutions.filter((inst) =>
          getRenderInstitution(inst)
            .toLowerCase()
            .includes(filterText.toLowerCase())
        )
      );
      console.log(
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
    } else if (filteredInstitutions.length > MAX_INSTITUTIONS) {
      return (
        <div>
          Your filter matches {filteredInstitutions.length} institutions which
          is more than the maximum allowable ({MAX_INSTITUTIONS}). Please refine
          your search.
        </div>
      );
    } else {
      return renderMatches(filteredInstitutions);
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
