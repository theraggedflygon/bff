"use client";
import LoadFile from "./components/loadFile";
import * as React from "react";
import { useState } from "react";
import TrialMenu from "./components/trialMenu";
import { TrialsProvider } from "@/context/trialContext";
import ProgressBar from "./components/progressBar";
import ProgressModal from "./components/progressModal";

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="text-3xl p-5 text-blue-700">{`Ben's Funding Finder`}</div>
      <div className="items-center justify-items-center w-full">
        <div className="w-5/6">
          <TrialsProvider>
            <ProgressModal
              isOpen={showModal}
              closeModal={() => setShowModal(false)}
            />
            <div className="flex flex-row justify-between">
              <LoadFile />
              <ProgressBar openModal={() => setShowModal(true)} />
            </div>
            <TrialMenu />
          </TrialsProvider>
        </div>
      </div>
    </div>
  );
}
