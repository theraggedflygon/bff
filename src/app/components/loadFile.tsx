import * as React from "react";
import { useState } from "react";

const LoadFile = () => {
  const [fileData, setFileData] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        if (readEvent.target?.result) {
          const fileValue = readEvent.target.result as string;
          console.log(fileValue);
          setFileData(fileValue);
        }
      };

      reader.readAsText(e.target.files[0]);
      console.log(fileData);
    }
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

export default LoadFile;
