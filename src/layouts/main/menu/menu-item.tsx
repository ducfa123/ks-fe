import { FC, useState } from "react";
import { SideMenuItem } from "../../../types";

import * as styles from "./styles";
import { Box, Collapse } from "@mui/material";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import { checkPermisison } from "../../../utils";

type MenuItemProps = {
  item: SideMenuItem;
  keyRender: string;
  level: number;
};

export const MenuItemView: FC<MenuItemProps> = ({ item, keyRender, level }) => {
  const navigate = useNavigate();
  const [collapse, setCollapse] = useState<boolean>(
    window.location.href.includes(item.key)
  );

  const { permission } = useAppSelector((state) => state.auth);

  const _style = window.location.href.includes(item.key)
    ? styles.selectedItem
    : styles.menuItemStyle;

  const isSelect = window.location.href.includes(item.key) ? true : false;

  if (item.module && item.action && Array.isArray(item.action)) {
    const canVisible: boolean = checkPermisison(
      permission,
      item.module,
      item.action
    );

    if (!canVisible) return null;
  }

  if (item.children.length === 0) {
    if (level === 0)
      return (
        <Box key={keyRender} sx={_style} onClick={() => navigate(item.url)}>
          {item.icon}
          <Box> {item.text}</Box>
        </Box>
      );

    if (level > 0)
      return (
        <Box key={keyRender} sx={_style} onClick={() => navigate(item.url)}>
          <Box
            sx={{
              height: "5px",
              width: "5px",
              borderRadius: "50%",
              marginRight: "5px",
              backgroundColor: isSelect ? "#098DEE" : "#191919",
            }}
          ></Box>
          <Box> {item.text}</Box>
        </Box>
      );
  }

  const _styleParent = window.location.href.includes(item.key)
    ? styles.selectParentItem
    : styles.menuItemStyle;

  const checkChild = item.children
    .map((item: SideMenuItem, i: number) => {
      if (item.module && item.action && Array.isArray(item.action)) {
        const canVisible: boolean = checkPermisison(
          permission,
          item.module,
          item.action
        );

        if (!canVisible) return null;
      }

      return item.text;
    })
    .filter((i) => i);

  if (checkChild && Array.isArray(checkChild) && checkChild.length === 0)
    return null;

  const selectParent = window.location.href.includes(item.key) ? true : false;

  return (
    <>
      <Box
        key={keyRender}
        sx={_styleParent}
        onClick={() => setCollapse(!collapse)}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "5px",
            alignItems: "center",
            fontWeight: selectParent ? "bold" : "400",
            // justifyContent: "center",
          }}
        >
          {item.icon} <Box>{item.text}</Box>
        </div>
        {collapse === false ? <FaAngleDown /> : <FaAngleUp />}
      </Box>
      <Box sx={{ marginLeft: "20px" }}>
        <Collapse in={collapse}>
          {item.children.map((item: SideMenuItem, i: number) => {
            return (
              <MenuItemView
                item={item}
                keyRender={`menu-${i}`}
                level={level + 1}
              />
            );
          })}
        </Collapse>
      </Box>
    </>
  );
};
