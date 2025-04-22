import { ReactNode } from "react";

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
}

export interface Data {
  [key: string]: string | number | ReactNode;
}
