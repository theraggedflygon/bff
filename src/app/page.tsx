"use client";
import LoadFile from "./components/loadFile";
import * as React from "react";
import { useState } from "react";
import TrialMenu from "./components/trialMenu";

export default function Home() {
  const [trials, setTrials] = useState<ITrial[]>([]);

  return (
    <div>
      <div className="text-3xl p-5 text-blue-700">Ben's Funding Finder</div>
      <div className="items-center justify-items-center w-full">
        <div className="w-1/2">
          <LoadFile setTrials={setTrials} />
          <TrialMenu trials={trials} />
        </div>
      </div>
    </div>
  );
}

export interface ITrial {
  nctID: string;
  startYear: number;
  endYear: number;
  country: string | null;
  city: string | null;
  state: string | null;
  program: string | null;
}
