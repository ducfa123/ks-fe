import { Column } from "../../../components/tTable/types";
import { APIServices } from "../../../utils";

export type NguoiDungUI = {
  _id: string;
  ho_ten: string;
  tai_khoan: string;
  phong_ban: string;
  vai_tro: string;
};

export const columns: Array<Column> = [
  { id: "ho_ten", label: "Họ tên", minWidth: 150 },
  { id: "tai_khoan", label: "Tài khoản", minWidth: 150 },
  { id: "vai_tro_display", label: "Vai trò", minWidth: 150 },
  { id: "so_du_text", label: "Số dư", minWidth: 100, align: "right" },
  { id: "actions", label: "Hành động", minWidth: 200, align: "right" },
];

export const columnForms = [
  {
    id: "vai_tro",
    label: "Vai trò",
    type: "select",
    options: [],
    required: true,
  },
  { id: "tai_khoan", label: "Tài khoản", type: "text", required: true },
  { id: "mat_khau", label: "Mật khẩu", type: "password", required: true },
  {
    id: "confirm_password",
    label: "Xác nhận mật khẩu",
    type: "password",
    required: true,
  },
  { id: "ho_ten", label: "Họ tên", type: "text", required: true },
];
