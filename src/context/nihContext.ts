import { createContext } from "react";

const nihFundingData = require("@/reference/NIH_funding.json");

export const nihContext = createContext<INIHYear[]>(nihFundingData);

interface INIHYear {
  year: number;
  institutions: IInstitution[];
}

export interface IInstitution {
  name: string;
  id: number;
  country: string;
  city: string;
  state: string | null;
  funding: number;
  awards: number;
}
