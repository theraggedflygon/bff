import * as React from "react";
import Papa from "papaparse";
import { TrialStatus, useTrials } from "@/context/trialContext";

const ProgressBar = ({ openModal }: ProgressBarProps) => {
  const { trials, runName, getInstitutionsByYear } = useTrials();

  const handleDownload = () => {
    const downloadObj: ITrialDownload[] = [];
    trials.forEach((trial) => {
      const downloadTrial: ITrialDownload = {
        "NCT Number": trial.nctID,
        "Primary Location": trial.location.program
          ? trial.location.program
          : "NA",
        "NIH Locations": "",
        City: trial.location.city ? trial.location.city : "NA",
        Country: trial.location.country ? trial.location.country : "NA",
        Start: trial.years.length > 0 ? trial.years[0].year : "NA",
        End:
          trial.years.length > 0
            ? trial.years[trial.years.length - 1].year
            : "NA",
        "Complete NIH Records": trial.complete ? true : false,
        "NIH Start Money": 0,
        "NIH End Money": 0,
        "NIH Total Money": 0,
        "NIH Start Awards": 0,
        "NIH End Awards": 0,
        "NIH Total Awards": 0,
      };

      const locationArray: string[] = [];

      trial.years.forEach((year, idx) => {
        let yearFunds = 0;
        let yearAwards = 0;
        const yearInsts = getInstitutionsByYear(year.year);
        if (yearInsts === null) {
          return;
        }

        year.institutionIds.forEach((instId) => {
          const targetInst = yearInsts.filter((inst) => inst.id === instId);
          if (targetInst.length === 0) {
            return;
          }
          if (!locationArray.includes(targetInst[0].name)) {
            locationArray.push(targetInst[0].name);
          }
          yearFunds += targetInst[0].funding;
          yearAwards += targetInst[0].awards;
        });

        downloadTrial["NIH Total Money"] += yearFunds;
        downloadTrial["NIH Total Awards"] += yearAwards;

        if (idx === 0) {
          downloadTrial["NIH Start Money"] = yearFunds;
          downloadTrial["NIH Start Awards"] = yearAwards;
        }
        if (idx === trial.years.length - 1) {
          downloadTrial["NIH End Money"] = yearFunds;
          downloadTrial["NIH End Awards"] = yearAwards;
        }
      });
      downloadTrial["NIH Locations"] = locationArray.join("|");
      downloadObj.push(downloadTrial);
    });
    const csvStr = Papa.unparse(downloadObj);
    const blob = new Blob([csvStr], { type: "text/csv" });
    const href = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = href;
    downloadLink.download = `${runName}_results.csv`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(href);
  };

  const renderDownloadButton = () => {
    if (completedTrials === trials.length || trials.length === 0) {
      return <div></div>;
    }
    return (
      <button
        className="bg-blue-200 rounded-md p-2 hover:cursor-pointer hover:bg-blue-400"
        onClick={handleDownload}
      >
        Download
      </button>
    );
  };

  const completedTrials = trials
    .map((trial): number =>
      trial.complete === TrialStatus.COMPLETE ||
      trial.complete === TrialStatus.PASSED
        ? 1
        : 0
    )
    .reduce((sum, val) => val + sum, 0);

  if (trials.length === 0) {
    return <div></div>;
  }

  return (
    <div className="flex flex-row items-center pt-6 space-x-2">
      <div>
        {completedTrials} out of {trials.length}{" "}
        {trials.length === 1 ? "Trial Complete " : "Trials Complete "}(
        {Math.round((completedTrials * 100) / trials.length)}%)
      </div>
      <button
        className="bg-blue-200 rounded-md p-2 hover:cursor-pointer hover:bg-blue-400"
        onClick={openModal}
      >
        Details
      </button>
      {renderDownloadButton()}
    </div>
  );
};

export default ProgressBar;

interface ProgressBarProps {
  openModal: () => void;
}

interface ITrialDownload {
  "NCT Number": string;
  "Primary Location": string;
  "NIH Locations": string;
  City: string;
  Country: string;
  Start: number | "NA";
  End: number | "NA";
  "Complete NIH Records": boolean;
  "NIH Start Money": number;
  "NIH End Money": number;
  "NIH Total Money": number;
  "NIH Start Awards": number;
  "NIH End Awards": number;
  "NIH Total Awards": number;
}
