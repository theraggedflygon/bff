"use client";
import LoadFile from "./components/loadFile";
import * as React from "react";
import { useState } from "react";

export default function Home() {
  const [trials, setTrials] = useState<ITrial[]>([]);

  return (
    <div>
      <div className="text-3xl p-5">Ben's Funding Finder</div>
      <div className="items-center justify-items-center min-h-screen">
        <div>
          <LoadFile setTrials={setTrials} />
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
