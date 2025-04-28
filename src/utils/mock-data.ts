import { Product, Combo } from "../pages/Client/Products";

export const mockProducts: Product[] = [
  {
    _id: "6808ae9b5ccf4fc40ad16076",
    ten: "Tài khoản Wondershare Filmora 13 (1 năm - 1000 Credit) - Windows",
    ma_san_pham: "tk-filmora-1y-win",
    hinh_anh: [
      "https://intx-shop.s3.ap-southeast-2.amazonaws.com/2ff08b7d-fdae-45cd-b8d6-45de7472e124.png"
    ],
    mo_ta: "Tài khoản Wondershare Filmora 13 (1 năm - 1000 Credit) - Windows",
    gia: 199000,
    danh_muc: "68088fd7cb6e740225069c72",
    danh_muc_detail: {
      _id: "68088fd7cb6e740225069c72",
      ten: "Học tập"
    }
  },
  {
    _id: "6808af255ccf4fc40ad1607e",
    ten: "ChatGPT (OpenAI) - Tài khoản",
    ma_san_pham: "chatgpt",
    hinh_anh: [
      "https://intx-shop.s3.ap-southeast-2.amazonaws.com/56c42acf-69ca-4d4c-9129-dc2847abd9f1.png"
    ],
    mo_ta: "ChatGPT (OpenAI) - Tài khoản",
    gia: 50000,
    danh_muc: "68088fcfcb6e740225069c6c",
    danh_muc_detail: {
      _id: "68088fcfcb6e740225069c6c",
      ten: "Làm việc"
    }
  },
  {
    _id: "68098f9b0fc45268bb5aed52",
    ten: "Quizlet Plus 1 năm - Nâng cấp chính chủ",
    ma_san_pham: "nang-cap-quizlet-plus-1nam",
    hinh_anh: [
      "https://intx-shop.s3.ap-southeast-2.amazonaws.com/988b783e-91af-4be7-93ff-6cdb3449e6bf.png"
    ],
    mo_ta: "Quizlet Plus 1 năm - Nâng cấp chính chủ",
    gia: 399000,
    danh_muc: "68088fcfcb6e740225069c6c",
    danh_muc_detail: {
      _id: "68088fcfcb6e740225069c6c",
      ten: "Làm việc"
    }
  },
  {
    _id: "680991820fc45268bb5aee8e",
    ten: "Canva Pro 1 năm - Gia hạn chính chủ",
    ma_san_pham: "acc canva-1y",
    hinh_anh: [
      "https://intx-shop.s3.ap-southeast-2.amazonaws.com/0294f274-e1c3-4eca-834a-080f8afca666.png",
      "https://intx-shop.s3.ap-southeast-2.amazonaws.com/1913c999-3fcf-4e18-968a-8bb87b8151ee.png",
      "https://intx-shop.s3.ap-southeast-2.amazonaws.com/afbfaf77-4bc2-43aa-99b8-3643f044dab5.png"
    ],
    mo_ta: "Canva Pro 1 năm - Gia hạn chính chủ",
    gia: 295000,
    danh_muc: "68088fe3cb6e740225069c7e",
    danh_muc_detail: {
      _id: "68088fe3cb6e740225069c7e",
      ten: "Edit Ảnh, video"
    }
  }
];

export const mockCombos: Combo[] = [
  {
    _id: "680a5ef25d58ddee24b14cc3",
    ten: "Gói hỗ trợ nhân viên văn phòng",
    mo_ta: "Hỗ trợ nhân viên văn phòng hoàn thành nhiệm vụ",
    danh_sach_san_pham: [
      "68098f9b0fc45268bb5aed52",
      "6808af255ccf4fc40ad1607e"
    ],
    gia_combo: 499000,
    danh_sach_san_pham_detail: [
      {
        _id: "6808af255ccf4fc40ad1607e",
        ten: "ChatGPT (OpenAI) - Tài khoản",
        ma_san_pham: "chatgpt",
        hinh_anh: [
          "https://intx-shop.s3.ap-southeast-2.amazonaws.com/56c42acf-69ca-4d4c-9129-dc2847abd9f1.png"
        ],
        mo_ta: "ChatGPT (OpenAI) - Tài khoản",
        gia: 50000,
        danh_muc: "68088fcfcb6e740225069c6c",
        danh_muc_detail: {
          _id: "68088fcfcb6e740225069c6c",
          ten: "Làm việc"
        }
      },
      {
        _id: "68098f9b0fc45268bb5aed52",
        ten: "Quizlet Plus 1 năm - Nâng cấp chính chủ",
        ma_san_pham: "nang-cap-quizlet-plus-1nam",
        hinh_anh: [
          "https://intx-shop.s3.ap-southeast-2.amazonaws.com/988b783e-91af-4be7-93ff-6cdb3449e6bf.png"
        ],
        mo_ta: "Quizlet Plus 1 năm - Nâng cấp chính chủ",
        gia: 399000,
        danh_muc: "68088fcfcb6e740225069c6c",
        danh_muc_detail: {
          _id: "68088fcfcb6e740225069c6c",
          ten: "Làm việc"
        }
      }
    ]
  },
  {
    _id: "680b371f3884da83201a0dd0",
    ten: "Combo sản phẩm AI",
    mo_ta: "Bộ sản phẩm AI hỗ trợ công việc và sáng tạo",
    danh_sach_san_pham: [
      "6808af255ccf4fc40ad1607e",
      "680991820fc45268bb5aee8e"
    ],
    gia_combo: 429000,
    danh_sach_san_pham_detail: [
      {
        _id: "6808af255ccf4fc40ad1607e",
        ten: "ChatGPT (OpenAI) - Tài khoản",
        ma_san_pham: "chatgpt",
        hinh_anh: [
          "https://intx-shop.s3.ap-southeast-2.amazonaws.com/56c42acf-69ca-4d4c-9129-dc2847abd9f1.png"
        ],
        mo_ta: "ChatGPT (OpenAI) - Tài khoản",
        gia: 50000,
        danh_muc: "68088fcfcb6e740225069c6c",
        danh_muc_detail: {
          _id: "68088fcfcb6e740225069c6c",
          ten: "Làm việc"
        }
      },
      {
        _id: "680991820fc45268bb5aee8e",
        ten: "Canva Pro 1 năm - Gia hạn chính chủ",
        ma_san_pham: "acc canva-1y",
        hinh_anh: [
          "https://intx-shop.s3.ap-southeast-2.amazonaws.com/0294f274-e1c3-4eca-834a-080f8afca666.png",
          "https://intx-shop.s3.ap-southeast-2.amazonaws.com/1913c999-3fcf-4e18-968a-8bb87b8151ee.png",
          "https://intx-shop.s3.ap-southeast-2.amazonaws.com/afbfaf77-4bc2-43aa-99b8-3643f044dab5.png"
        ],
        mo_ta: "Canva Pro 1 năm - Gia hạn chính chủ",
        gia: 295000,
        danh_muc: "68088fe3cb6e740225069c7e",
        danh_muc_detail: {
          _id: "68088fe3cb6e740225069c7e",
          ten: "Edit Ảnh, video"
        }
      }
    ]
  }
]; 