import { Column } from "../../../components/tTable/types";
import { APIServices } from "../../../utils";

export const columns: Array<Column> = [
  { id: "san_pham_text", label: "Sản phẩm", minWidth: 150 },
  { id: "tai_khoan", label: "Tài khoản", minWidth: 150 },
  { id: "key", label: "Mã xác thực", minWidth: 150 },
  { id: "actions", label: "Hành động", minWidth: 200, align: "right" },
];

export const columnForms = [
  {
    id: "san_pham",
    label: "Sản phẩm",
    type: "select-fetch",
    options: [],
    required: true,
    fetchOptions: async (text: string) => {
      const ans = await APIServices.SanPhamService.getListEntity(1, 10, text);
      const { items } = ans;

      return items.map((i) => {
        return {
          value: i?._id,
          label: i?.ten,
        };
      });
    },
    defaultOptions: (formValue) => {
      return [
        {
          value: formValue?.san_pham_detail?._id,
          label: formValue?.san_pham_detail?.ten,
        },
      ];
    },
  },
  {
    id: "tai_khoan",
    label: "Tài khoản",
    type: "text",
  },
  {
    id: "mat_khau",
    label: "Mật khẩu",
    type: "password",
  },
  {
    id: "key",
    label: "Key",
    type: "text",
  },
  {
    id: "session",
    label: "Session",
    type: "textarea",
  },
  {
    id: "cookie",
    label: "Cookie",
    type: "textarea",
  },
];
