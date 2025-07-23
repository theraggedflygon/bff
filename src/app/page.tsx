"use client";
import LoadFile from "./components/loadFile";
import * as React from "react";
import { useState } from "react";

export default function Home() {
  [trials, setTrials] = useState<ITrial[]>([]);

  return (
    <div>
      <div className="text-3xl p-5">Ben's Funding Finder</div>
      <div className="items-center justify-items-center min-h-screen">
        <div>
          <LoadFile />
        </div>
      </div>
    </div>
  );
}

export interface ITrial {
  nctID: string;
  primaryLocation: string;
  startYear: number;
  endYear: number;
}
