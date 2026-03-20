import {
  HiHome,
  HiOutlineTag,
  HiOutlineShoppingBag,
  HiOutlinePlusCircle,
  HiOutlineCube,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineUserGroup,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { ReactElement } from "react";

export interface MenuItem {
  name: string;
  icon: ReactElement;
  href: string;
  //  Agregado para aquellas opciones con opciones anidadas
  children?: MenuItem[];
}

const iconSize = 22;

export const MENU_ITEMS: MenuItem[] = [
  { name: "Panel General", icon: <HiHome size={iconSize} />, href: "/panel" },
  { name: "Estado", icon: <HiOutlineTag size={iconSize} />, href: "/estado" },
  {
    name: "Ordenes",
    icon: <HiOutlineShoppingBag size={iconSize} />,
    href: "/ordenes",
  },
  {
    name: "Negocios",
    icon: <HiOutlinePlusCircle size={iconSize} />,
    href: "/negocios",
    children: [
      {
        name: "Negocios",
        icon: <HiOutlinePlusCircle size={iconSize} />,
        href: "/negocios",
      },
      {
        name: "Grupos",
        icon: <HiOutlineUserGroup size={iconSize} />,
        href: "/grupos",
      },
    ],
  },
  {
    name: "Productos",
    icon: <HiOutlineCube size={iconSize} />,
    href: "/productos",
  },
  {
    name: "Reportes",
    icon: <HiOutlineChartBar size={iconSize} />,
    href: "/reportes",
  },
  {
    name: "Usuarios",
    icon: <HiOutlineUsers size={iconSize} />,
    href: "/usuarios",
  },
  {
    name: "Usuarios de Grupo",
    icon: <HiOutlineUserCircle size={iconSize} />,
    href: "/usuarios-grupo",
  },
  {
    name: "Gestión de Precios",
    icon: <HiOutlineTag size={iconSize} />,
    href: "/precios",
  },
  {
    name: "Configuración",
    icon: <HiOutlineCog size={iconSize} />,
    href: "/configuracion",
  },
];
