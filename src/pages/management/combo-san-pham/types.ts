import { Column } from "../../../components/tTable/types";
import { APIServices } from "../../../utils";

export const columns: Array<Column> = [
  { id: "ten", label: "Tên combo", minWidth: 150 },
  { id: "san_pham_text", label: "Danh sách sản phẩm", minWidth: 150 },
  { id: "gia_combo_text", label: "Giá combo", minWidth: 150 },
  { id: "mo_ta", label: "Mô tả", minWidth: 150 },
  { id: "trang_thai_text", label: "Trạng thái", minWidth: 150 },
  { id: "actions", label: "Hành động", minWidth: 200, align: "right" },
];

export const columnForms = [
  { id: "ten", label: "Tên sản phẩm", type: "text", required: true },
  { id: "mo_ta", label: "Mô tả", type: "textarea" },
  { id: "gia_combo", label: "Giá", type: "currency", require: true },
  {
    id: "active",
    label: "Trạng thái",
    type: "radio",
    require: true,
    options: [
      {
        value: true,
        label: "Đang cung cấp",
      },
      {
        value: false,
        label: "Tạm thời chưa cung cấp",
      },
    ],
  },
  {
    id: "danh_sach_san_pham",
    label: "Danh sách sản phẩm",
    options: [],
    type: "multi-select-fetch",
    require: true,
    fetchOptions: async (input) => {
      const ans = await APIServices.SanPhamService.getListEntity(1, 10, input);
      const { items } = ans;
      console.log({ items });
      return items.map((item) => ({
        value: item._id,
        label: item.ten,
      }));
    },
    defaultOptions: (formValue) => {
      // Lấy SP danh mục mặc định
      return (
        formValue?.danh_sach_san_pham_detail?.map((item) => ({
          value: item._id,
          label: item.ten,
        })) ?? []
      );
    },
  },
];
