import { Column } from "../../../components/tTable/types";

export type NguoiDungUI = {
  _id: string;
  ho_ten: string;
  tai_khoan: string;
  phong_ban: string;
  vai_tro: string;
};

export const columns: Array<Column> = [
  { id: "ten", label: "Tên danh mục", minWidth: 150 },
  { id: "mo_ta", label: "Mô tả", minWidth: 150 },
  { id: "actions", label: "Hành động", minWidth: 200, align: "right" },
];

export const columnForms = [
  { id: "ten", label: "Tên danh mục", type: "text", required: true },
  { id: "mo_ta", label: "Mô tả", type: "textarea" },
];
