import { FilterConfig } from "@/components/shared/dataTable/FilterGeneral";
import React from "react";
import { ApiCounter } from "../components/count";

export interface Proprietary {
  id: string;
  name: string;
  number: string;
  rif: string;
}

export interface Grupos {
  id: string;
  id_group: string;
  name_group: string;
  created_at: string;
  proprietary: Proprietary;
  description: string;
  pharmacies: string[];
}

export const columns = [
  {
    header: "Nombre del grupo",
    key: "name_group",
  },
  {
    header: "Farmacias",
    key: "id_group",
    render: (item: Grupos) =>
      React.createElement(ApiCounter, {
        id: item.id_group,
        endpoint: "/admin/Pharmacy/searchpharmacyforgroup",
        queryKey: "pharmacy-count",
      }),
  },
  {
    header: "Dueño",
    key: "proprietary.name",
  },
];

export const FILTER_CONFIG: FilterConfig[] = [
  {
    key: "name_group",
    label: "Nombre Grupo",
    type: "select",
    endpoint: "/admin/PharmacyGroup/groupsPharmacy",
    optionKey: "name_group",
  },
];
