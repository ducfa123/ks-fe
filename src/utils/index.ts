import { RouteObject } from "react-router-dom";
import { Permission, SystemAction, SystemFeatures } from "../types";

export * as APIServices from "./apis";
export { StoreService } from './storeService';
export { DonViService } from "./apis/don-vi";
export { GioiHanDonViService } from "./apis/gioi-han-don-vi";
export { VungMienService } from "./apis/vung-mien";
export { GioiHanVungMienService } from "./apis/gioi-han";
export { ThongKeService } from './apis/thong-ke';

// Export any other utilities you might need
export * from './common';

export const checkPermisison = (
  permission: Array<Permission>,
  module: SystemFeatures,
  action: Array<SystemAction>
): boolean => {
  let ans: boolean = false;

  for (let index = 0; index < action.length; index++) {
    const _action = action[index];
    if (
      permission?.find(
        (i: Permission) => i.module === module && i.action === _action
      )
    ) {
      ans = true;
      break;
    }
  }

  return ans;
};

export const getPermisisonRouter = (
  permission: Array<Permission>,
  item: any
): RouteObject | null => {
  let ans: RouteObject = item;

  if (item?.module && item?.action && Array.isArray(item?.action)) {
    const ok = checkPermisison(permission, item?.module, item?.action);
    if (!ok) return null;
  }

  const childs: any = [];
  if (Array.isArray(item?.children) && item?.children?.length > 0)
    item?.children.forEach((i: any) => {
      const _item: RouteObject | null = getPermisisonRouter(permission, i);
      if (_item) childs.push(_item);
    });

  if (childs.length)
    ans = {
      ...ans,
      ...{
        children: childs,
      },
    };

  return ans;
};
