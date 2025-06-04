import { Column } from "../../../components/tTable/types";
import { APIServices } from "../../../utils";

export type KhaoSatUI = {
  _id: string;
  tieu_de: string;
  mo_ta: string;
  ma_nguoi_tao: {
    _id: string;
    ten_nguoi_dung: string;
  };
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  gioi_han_phan_hoi: number;
  so_phan_hoi_hien_tai: number;
  cho_phep_tra_loi_nhieu_lan: boolean;
  cho_phep_an_danh: boolean;
  trang_thai: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export const columns: Array<Column> = [
  { id: "tieu_de", label: "Tiêu đề", minWidth: 200 },
  { id: "mo_ta", label: "Mô tả", minWidth: 250 },
  // Thêm trường người tạo
  { id: "nguoi_tao", label: "Người tạo", minWidth: 120 },
  { id: "thoi_gian_bat_dau_text", label: "Thời gian bắt đầu", minWidth: 150 },
  { id: "thoi_gian_ket_thuc_text", label: "Thời gian kết thúc", minWidth: 150 },
  { id: "gioi_han_phan_hoi", label: "Giới hạn phản hồi", minWidth: 130 },
  { id: "trang_thai_text", label: "Trạng thái", minWidth: 120 },
  { id: "actions", label: "Hành động", minWidth: 150, align: "right" },
];

export const columnForms = [
  { id: "_id", label: "ID", type: "hidden" },
  { 
    id: "tieu_de", 
    label: "Tiêu đề", 
    type: "text", 
    required: true,
    maxLength: 500,
    validation: {
      required: "Tiêu đề không được để trống"
    }
  },
  { 
    id: "mo_ta", 
    label: "Mô tả", 
    type: "textarea", 
    required: false 
  },
  { 
    id: "thoi_gian_bat_dau", 
    label: "Thời gian bắt đầu", 
    type: "date-time",
    required: true,
    validation: {
      required: "Thời gian bắt đầu không được để trống"
    }
  },
  { 
    id: "thoi_gian_ket_thuc", 
    label: "Thời gian kết thúc", 
    type: "date-time",
    required: true,
    validation: {
      required: "Thời gian kết thúc không được để trống"
    }
  },
  { 
    id: "gioi_han_phan_hoi", 
    label: "Giới hạn phản hồi", 
    type: "number", 
    required: false,
    min: 0,
    defaultValue: 0,
    helperText: "Số 0 nghĩa là không giới hạn"
  },
  // Thay đổi từ checkbox sang switch và tên trường theo API
  { 
    id: "cho_phep_tra_loi_nhieu_lan", 
    label: "Cho phép trả lời nhiều lần", 
    type: "switch", 
    required: false,
    defaultValue: false
  },
  { 
    id: "cho_phep_an_danh", 
    label: "Cho phép ẩn danh", 
    type: "switch", 
    required: false,
    defaultValue: false
  },
  // Thay đổi từ các trạng thái sang active/inactive theo API
  {
    id: "trang_thai",
    label: "Trạng thái",
    type: "select",
    options: [
      { value: "active", label: "Hoạt động" },
      { value: "inactive", label: "Không hoạt động" }
    ],
    required: true,
    defaultValue: "active",
    validation: {
      required: "Trạng thái không được để trống"
    }
  },
];