import { Column } from "../../../components/tTable/types";
export enum LoaiDapAn {
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  DATE = 'date',
}

export enum LoaiCauHoi {
  MULTIPLE_CHOICE = 'Câu hỏi đa lựa chọn',
  SINGLE_CHOICE = 'Câu hỏi đơn lựa chọn',
  LIKERT_SCALE = 'Câu hỏi Likert scale',
  TEXT = 'Câu hỏi tự luận',
  RATING = 'Câu hỏi đánh giá',
}


export interface KhaoSatUI {
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
  cho_phep_tra_loi_nhieu_lan: boolean;
  cho_phep_an_danh: boolean;
  trang_thai: boolean;
  createdAt: string;
  updatedAt: string;
  so_phan_hoi_hien_tai?: number;

  // Các trường thêm vào để hiển thị
  nguoi_tao?: string;
  trang_thai_text?: string;
  thoi_gian_bat_dau_text?: string;
  thoi_gian_ket_thuc_text?: string;
  tieu_de_link?: React.ReactNode;
}

// Phần khảo sát
export interface PhanKhaoSat {
  _id: string;
  ma_khao_sat: string;
  tieu_de: string;
  mo_ta?: string;
  thu_tu: number;
  createdAt: string;
  updatedAt: string;
}

// Câu hỏi
export interface CauHoi {
  _id: string;
  ma_phan: string;
  noi_dung: string;
  loai_cau_hoi: 'radio' | 'checkbox' | 'text' | 'textarea' | 'rating';
  bat_buoc: boolean;
  thu_tu: number;
  dap_an: DapAn[];
  createdAt: string;
  updatedAt: string;
}

// Đáp án
export interface DapAn {
  gia_tri: any;
  loai_dap_an: any;
  _id?: string;
  ma_cau_hoi?: string;
  noi_dung: string;
  thu_tu?: number;
}


export const columns: Array<Column> = [
  { id: "tieu_de_link", label: "Tiêu đề", minWidth: 200 },
  { id: "mo_ta", label: "Mô tả", minWidth: 250 },
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