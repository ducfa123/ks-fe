import {SystemAction, SystemFeatures} from ".";

export type SideMenuItem = {
  url?: string;
  key: string;
  icon?: any;
  children: Array<SideMenuItem>;
  text: string | any;
  module?: SystemFeatures | null;
  action?: Array<SystemAction> | null;
};
