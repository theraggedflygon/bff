"use client";
import LoadFile, { ILocation } from "./components/loadFile";
import * as React from "react";
import { useState } from "react";
import TrialMenu from "./components/trialMenu";
import { IInstitution } from "@/context/nihContext";

export default function Home() {
  const [trials, setTrials] = useState<ITrial[]>([]);

  return (
    <div>
      <div className="text-3xl p-5 text-blue-700">Ben's Funding Finder</div>
      <div className="items-center justify-items-center w-full">
        <div className="w-5/6">
          <LoadFile setTrials={setTrials} />
          <TrialMenu trials={trials} setTrials={setTrials} />
        </div>
      </div>
    </div>
  );
}

export interface ITrial {
  nctID: string;
  years: IYear[];
  location: ILocation;
}

interface IYear {
  year: number;
  institutionIds: number[];
}
