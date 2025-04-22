export const modalStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const containerStyle = {
  minWidth: "300px",
  display: "flex",
  flexDirection: "column",

  padding: "24px 24px 24px 24px",
  alignItems: "flex-start",
  gap: "16px",
  background: "#FFF",

  border: "none",
  borderRadius: "12px",
  boxShadow:
    "0px 20px 24px -4px rgba(16, 24, 40, 0.10), 0px 8px 8px -4px rgba(16, 24, 40, 0.04)",
  outline: "none",
};

export const topModalStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
};

export const titleStyle = {
  color: "#101828",
  fontFamily: "Be Vietnam Pro",
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: "600",
  lineHeight: "28px",
};

export const contentStyle = {
  color: "#475467",
  fontFamily: "Be Vietnam Pro",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: "400",
  lineHeight: "20px",
  marginTop: "10px",
  marginBottom: "15px",
};

export const buttonPanelStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "10px",
};

export const buttonOKStyle = {
  display: "flex",
  padding: "10px 18px",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  borderRadius: "8px",
  border: "1px solid #ff6666",
  background: " #ff6666",
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
  color: " #FFF",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: "24px",
  textTransform: "none",
  fontFamily: "Be Vietnam Pro",

  "&:hover": {
    opacity: "0.9",
    background: " #ff6666",
  },
};

export const buttonCancelStyle = {
  width: "100px",
  display: "flex",
  padding: "10px 18px",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  borderRadius: "8px",
  border: "1px solid #D0D5DD",
  background: "#FFF",
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
  color: "#344054",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: "24px",
  textTransform: "none",
  fontFamily: "Be Vietnam Pro",

  "&:hover": {
    opacity: "0.9",
  },
};
