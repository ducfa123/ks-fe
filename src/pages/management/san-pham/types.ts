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
  { id: "ma_san_pham", label: "Mã sản phẩm", minWidth: 100 },
  { id: "ten", label: "Tên sản phẩm", minWidth: 150 },
  { id: "danh_muc_text", label: "Danh mục", minWidth: 150 },
  { id: "gia_text", label: "Giá sản phẩm", minWidth: 150 },
  { id: "hinh_anh_show", label: "Hình ảnh", minWidth: 150 },
  { id: "actions", label: "Hành động", minWidth: 200, align: "right" },
];

export const columnForms = [
  { id: "ma_san_pham", label: "Mã sản phẩm", type: "text", required: true },
  { id: "ten", label: "Tên sản phẩm", type: "text", required: true },
  {
    id: "danh_muc",
    label: "Danh mục",
    type: "select-fetch",
    options: [],
    required: true,
    fetchOptions: async (text: string) => {
      const ans = await APIServices.DanhMucSanPhamService.getListEntity(
        1,
        10,
        text
      );
      const { items } = ans;

      return items.map((i) => {
        return {
          value: i?._id,
          label: i?.ten,
        };
      });
    },
    defaultOptions: (formValue) => [
      {
        value: formValue?.danh_muc_detail?._id,
        label: formValue?.danh_muc_detail?.ten || "",
      },
    ],
  },
  { id: "mo_ta", label: "Mô tả", type: "textarea" },
  { id: "gia", label: "Giá", type: "currency", required: true },
  {
    id: "hinh_anh",
    label: "Hình ảnh",
    type: "images",
    condition: (formData) => {
      if (
        formData?.hinh_anh &&
        Array.isArray(formData?.hinh_anh) &&
        formData?.hinh_anh.length > 0
      )
        return true;
      return false;
    },
  },
  {
    id: "files",
    label: "Thêm hình ảnh",
    type: "files",
    required: true,
    accept: ".jpeg,.jpg,.png",
  },
];
