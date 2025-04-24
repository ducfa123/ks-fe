import { Column } from "../../../components/tTable/types";

export type NguoiDungUI = {
  _id: string;
  ho_ten: string;
  tai_khoan: string;
  phong_ban: string;
  vai_tro: string;
};

export const columns: Array<Column> = [
  { id: "ten", label: "Nội dung giảm", minWidth: 150 },
  { id: "ma_code", label: "Mã giảm giá", minWidth: 100 },
  { id: "loai_text", label: "Loại", minWidth: 70 },
  { id: "noi_dung_giam", label: "Giá trị giảm", minWidth: 100 },
  {
    id: "thoi_gian_bat_dau",
    label: "Thời gian bắt đầu",
    minWidth: 100,
    align: "right",
  },
  {
    id: "thoi_gian_ket_thuc",
    label: "Thời gian kết thúc",
    minWidth: 100,
    align: "right",
  },
  { id: "actions", label: "Hành động", minWidth: 150, align: "right" },
];

export const columnForms = [
  { id: "ten", label: "Nội dung giảm", type: "text", required: true },
  { id: "ma_code", label: "Mã giảm giá", type: "text", required: true },
  {
    id: "loai",
    label: "Loại giảm giá",
    type: "select",
    options: [
      {
        value: "giam_phan_tram",
        label: "Giảm phần trăm",
      },
      {
        value: "giam_tien",
        label: "Giảm tiền",
      },
    ],
    required: true,
  },
  {
    id: "giam_phan_tram",
    label: "Giảm phần trăm (%)",
    type: "number",
    required: true,
    condition: (formData) => formData.loai === "giam_phan_tram",
  },
  {
    id: "giam_tien",
    label: "Giảm tiền (VNĐ)",
    type: "currency",
    required: true,
    condition: (formData) => formData.loai === "giam_tien",
  },
  {
    id: "thoi_gian_bat_dau",
    label: "Thời gian bắt đầu",
    type: "date-time",
    required: true,
  },
  {
    id: "thoi_gian_ket_thuc",
    label: "Thời gian kết thúc",
    type: "date-time",
    required: true,
  },
];
