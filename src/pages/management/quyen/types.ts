import { Column } from "../../../components/tTable/types";
import {
  SystemActionsOptions,
  SystemFeaturesOptions,
} from "../../../utils/permission-helper";

export const columns: Array<Column> = [
  { id: "display_name", label: "Chức năng", minWidth: 200 },
  { id: "display_quyen", label: "Quyền", minWidth: 100 },
  { id: "actions", label: "Hành động", minWidth: 100, align: "right" },
];

export const columnForms = [
  {
    id: "chuc_nang",
    label: "Chức năng",
    type: "select",
    required: true,
    options: SystemFeaturesOptions,
  },
  {
    id: "quyen",
    label: "Quyền",
    type: "select",
    required: true,
    options: SystemActionsOptions,
  },
];
