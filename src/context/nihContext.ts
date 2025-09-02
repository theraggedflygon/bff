import { createContext } from "react";

import nihFundingDataJson from "@/reference/NIH_funding.json";

const nihFundingData = nihFundingDataJson as INIHYear[];

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
