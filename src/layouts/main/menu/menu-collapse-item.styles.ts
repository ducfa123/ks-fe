export const menuItemBaseStyle = {
  display: "flex",
  flexDirection: "column", // Changed to column for vertical layout
  padding: "10px",
  alignItems: "center", // Center items
  justifyContent: "center",
  gap: "5px",
  borderRadius: "5px",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: "450",
  cursor: "pointer",
  fontFamily: "Be Vietnam Pro",
  position: "relative", // For submenu positioning

  "&:hover": {
    background: "#f2f2f2",
    "& .submenu": {
      display: "block",
    },
  },
};

export const menuItemStyle = {
  ...menuItemBaseStyle,
  ...{
    background: "#FFF",
    color: "#191919",
  },
};

export const selectedItem = {
  ...menuItemBaseStyle,
  ...{
    background: "#EFF6FE",
    color: "#098DEE",
    fontWeight: "500",
  },
};
