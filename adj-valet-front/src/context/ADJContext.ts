import { createContext } from "react";
import { ADJ } from "../types/ADJ";

export default createContext<ADJ | undefined>(undefined);