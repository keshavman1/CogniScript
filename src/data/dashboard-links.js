import { ACCOUNT_TYPE } from "../utils/constants";
export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscDashboard",
  },
 
  {
    id: 3,
    name: "My QUIZ",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscVm",
  },
  {
    id: 4,
    name: "Add QUIZ",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscAdd",
  },
  {
    id: 5,
    name: "Uploaded",
    path:  "/dashboard/Uploaded",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscHistory",
  },
 /* {
    id: 5,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  {
    id: 6,
    name: "Your Cart",
    path: "/dashboard/cart",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscHistory",
  }, */
];
