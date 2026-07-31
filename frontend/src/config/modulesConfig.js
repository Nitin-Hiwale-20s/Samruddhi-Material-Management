import {
  LayoutDashboard,
  Route,
  Wrench,
  Package,
  HardHat,
  Cable,
  ClipboardList,
  ListChecks,
  BarChart3,
  Users,
} from "lucide-react";

// Central config: field definitions + icon + color for every operational module.
// To add a new module: add an entry here + add it to backend ALLOWED_MODULES
// (backend/models/genericModel.js) + add a route/menu item in App.jsx / Sidebar.jsx.

const modulesConfig = {
  lanes: {
    title: "Lanes",
    endpoint: "lanes",
    icon: Route,
    color: "blue",
    fields: [
      { name: "laneNo", label: "Lane No", type: "text", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "type", label: "Type", type: "text" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Under Maintenance"] },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  equipment: {
    title: "Equipment",
    endpoint: "equipment",
    icon: Wrench,
    color: "orange",
    fields: [
      { name: "equipmentName", label: "Equipment Name", type: "text", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "serialNo", label: "Serial No", type: "text" },
      { name: "quantity", label: "Quantity", type: "number" },
      { name: "location", label: "Location", type: "text" },
      { name: "status", label: "Status", type: "select", options: ["Working", "Faulty", "Under Repair", "Retired"] },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  inventory: {
    title: "Inventory",
    endpoint: "inventory",
    icon: Package,
    color: "green",
    fields: [
      { name: "itemName", label: "Item Name", type: "text", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "quantity", label: "Quantity", type: "number", required: true },
      { name: "unit", label: "Unit", type: "text" },
      { name: "minStockLevel", label: "Min Stock Level", type: "number" },
      { name: "location", label: "Store / Location", type: "text" },
      { name: "supplier", label: "Supplier", type: "text" },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  installations: {
    title: "Installations",
    endpoint: "installations",
    icon: HardHat,
    color: "purple",
    fields: [
      { name: "installationName", label: "Installation Name", type: "text", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "installedBy", label: "Installed By", type: "text" },
      { name: "installationDate", label: "Installation Date", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["Planned", "In Progress", "Completed"] },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  cabletracking: {
    title: "Cable Tracking",
    endpoint: "cabletracking",
    icon: Cable,
    color: "indigo",
    fields: [
      { name: "cableId", label: "Cable ID", type: "text", required: true },
      { name: "cableType", label: "Cable Type", type: "text" },
      { name: "fromPoint", label: "From Point", type: "text" },
      { name: "toPoint", label: "To Point", type: "text" },
      { name: "lengthMeters", label: "Length (m)", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Damaged", "Under Repair"] },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  dailylogs: {
    title: "Daily Logs",
    endpoint: "dailylogs",
    icon: ClipboardList,
    color: "teal",
    fields: [
      { name: "logDate", label: "Date", type: "date", required: true },
      { name: "shift", label: "Shift", type: "select", options: ["Morning", "Afternoon", "Night"] },
      { name: "reportedBy", label: "Reported By", type: "text" },
      { name: "activity", label: "Activity", type: "textarea", required: true },
      { name: "issuesFound", label: "Issues Found", type: "textarea" },
    ],
  },
  workstatus: {
    title: "Work Status",
    endpoint: "workstatus",
    icon: ListChecks,
    color: "red",
    fields: [
      { name: "taskName", label: "Task Name", type: "text", required: true },
      { name: "assignedTo", label: "Assigned To", type: "text" },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "dueDate", label: "Due Date", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["Pending", "In Progress", "Completed", "Delayed"] },
      { name: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High"] },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
};

export const dashboardIcon = LayoutDashboard;
export const reportsIcon = BarChart3;
export const usersIcon = Users;

export default modulesConfig;
