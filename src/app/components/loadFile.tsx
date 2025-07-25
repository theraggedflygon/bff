import * as React from "react";
// @ts-ignore
import Papa from "papaparse";
import { start } from "repl";
import { ITrial } from "../page";

const state2Abbreviation = require("../../reference/stateAbbreviations.json");

const LoadFile = ({ setTrials }: LoadFileProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        if (readEvent.target?.result) {
          const fileValue = readEvent.target.result as string;
          parseTrials(fileValue);
        }
      };

      reader.readAsText(e.target.files[0]);
    }
  };

  const parseTrials = (data: string) => {
    const rows = Papa.parse(data).data;
    if (rows.length === 0) {
      return;
    }

    const headers = rows[0];
    const nctIdIdx = headers.indexOf("NCT Number");
    const locationsIdx = headers.indexOf("Locations");
    const startIdx = headers.indexOf("Start_Year");
    const endIdx = headers.indexOf("Ending_Year");

    if (nctIdIdx < 0 || locationsIdx < 0 || startIdx < 0 || endIdx < 0) {
      return;
    }

    const fileTrials: ITrial[] = [];
    for (let i = 1; i < rows.length; i++) {
      const newTrial: ITrial = {
        nctID: rows[i][nctIdIdx],
        startYear: rows[i][startIdx],
        endYear: rows[i][endIdx],
        country: null,
        state: null,
        city: null,
        program: null,
      };

      const primaryLocationStr = rows[i][locationsIdx].split("|")[0];
      if (primaryLocationStr !== "N/A" && primaryLocationStr !== "") {
        const { country, state, city, program } =
          parseLocation(primaryLocationStr);
        newTrial.country = country;
        newTrial.state = state;
        newTrial.city = city;
        newTrial.program = program;
      }
      fileTrials.push(newTrial);
    }

    setTrials(fileTrials);
  };

  const parseLocation = (location: string): ILocation => {
    const locationChunks = location.split(",");
    const country = locationChunks[locationChunks.length - 1].trim();
    let city: string | null = null;
    let state: string | null = null;
    let chunkIdx = 2;
    let currentChunk;
    while (chunkIdx <= locationChunks.length) {
      currentChunk = locationChunks[locationChunks.length - chunkIdx].trim();
      if (city !== null) {
        return {
          country: country,
          city: city,
          state: state,
          program: locationChunks
            .slice(0, locationChunks.length - chunkIdx)
            .join()
            .trim(),
        };
      } else if (/\d/.test(currentChunk)) {
        chunkIdx++;
      } else if (
        state === null &&
        (country.toLowerCase() === "united states" ||
          country.toLowerCase() === "canada") &&
        Object.keys(state2Abbreviation).includes(currentChunk)
      ) {
        state = state2Abbreviation[currentChunk];
        chunkIdx++;
      } else {
        city = currentChunk;
      }
    }
    return {
      country: country,
      city: city,
      state: state,
      program: null,
    };
  };

  return (
    <div className="flex flex-col">
      <label>Upload a file containing clinical trial information:</label>
      <input
        type="file"
        accept=".csv"
        className="file:bg-blue-200 file:rounded-lg file:p-2 hover:file:cursor-pointer hover:file:bg-blue-400"
        onChange={handleChange}
      />
    </div>
  );
};

interface LoadFileProps {
  setTrials: (trials: ITrial[]) => void;
}

interface ILocation {
  country: string | null;
  city: string | null;
  state: string | null;
  program: string | null;
}

export default LoadFile;
