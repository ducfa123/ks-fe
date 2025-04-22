import { Column } from "../../../components/tTable/types";

export type VaiTroUI = {
  _id: string;
  ten: string;
  mo_ta: string;
};

export const columns: Array<Column> = [
  { id: "ten", label: "Tên", minWidth: 200 },
  { id: "mo_ta", label: "Mô tả", minWidth: 150 },
  { id: "actions", label: "Hành động", minWidth: 200, align: "right" },
];

export const columnForms = [
  { id: "ten", label: "Tên vai trò", type: "text", required: true },
  { id: "mo_ta", label: "Mô tả", type: "textarea" },
];
