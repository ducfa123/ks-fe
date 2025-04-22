export const mainContainerStyle = {
  width: "240px",
  background: "white",
  display: "flex",
  flexDirection: "column",
  // position: "fixed",
  height: "100vh",
  position: "relative",
  // overflow: "auto",
};

export const menuContainerStyle = {
  padding: "10px",
  overflow: "auto",
  background: "#FFF",
};

export const menuItemBaseStyle = {
  display: "flex",
  padding: "15px",
  alignItems: "center",
  gap: "5px",
  alignSelf: "stretch",
  borderRadius: "5px",
  fontSize: "13px",
  fontStyle: "normal",
  fontWeight: "450",
  cursor: "pointer",
  fontFamily: "Be Vietnam Pro",

  "&:hover": {
    background: "#f2f2f2",
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

  "&:hover": {
    background: "#EFF6FE",
    color: "#098DEE",
    fontWeight: "500",
  },
};

export const selectParentItem = {
  ...menuItemBaseStyle,
  ...{
    color: "#001628",
  },

  "&:hover": {
    color: "#001628",
  },
};

export const logoTitle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px",
  fontSize: "20px",
  fontWeight: "bold",
  marginTop: "15px",
  fontFamily: "Be Vietnam Pro",
};

export const collapseContainerStyle = {
  zIndex: "1 !important",
  width: "100px",
  background: "white",
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  position: "relative",
};

export const collapseLogoTitle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px",
  fontSize: "15px",
  fontWeight: "bold",
  marginTop: "15px",
  fontFamily: "Be Vietnam Pro",
};

export const menuCollapseContainerStyle = {
  padding: "10px",
  overflow: "auto",
  background: "#FFF",
};

export const iconCollapseStyle = {
  position: "absolute",
  right: "-15px",
  top: "calc(50% - 15px)",
  cursor: "pointer",
  height: "30px",
  width: "30px",
  borderRadius: "50%",
  border: "1px solid #f2f2f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "white",

  "&:hover": {
    background: "#f2f2f2",
  },
};
