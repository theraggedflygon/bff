"use client";
import LoadFile from "./components/loadFile";
import * as React from "react";
import TrialMenu from "./components/trialMenu";
import { TrialsProvider } from "@/context/trialContext";
import ProgressBar from "./components/progressBar";

export default function Home() {
  return (
    <div>
      <div className="text-3xl p-5 text-blue-700">Ben's Funding Finder</div>
      <div className="items-center justify-items-center w-full">
        <div className="w-5/6">
          <TrialsProvider>
            <div className="flex flex-row justify-between">
              <LoadFile />
              <ProgressBar />
            </div>
            <TrialMenu />
          </TrialsProvider>
        </div>
      </div>
    </div>
  );
}
