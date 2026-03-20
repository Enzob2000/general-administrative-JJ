import { useApiQuery } from "@/hooks/useApi";
import { RiEdit2Line, RiDeleteBin6Line } from "react-icons/ri";

interface PharmacySubListProps {
  groupId: string;
}

export const PharmacySubList = ({ groupId }: PharmacySubListProps) => {
  const { data, isLoading } = useApiQuery<any[]>(
    ["group-pharmacies", groupId],
    `/admin/Pharmacy/searchpharmacyforgroup/${groupId}`,
  );

  console.log(JSON.stringify(data, null, 2));

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-blue-500">
        <div className="size-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-sm font-medium">
          Cargando farmacias asociadas...
        </span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-4 text-sm text-gray-400 italic">
        No hay farmacias asociadas a este grupo.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm mt-2 mb-4">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="py-3 px-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider">
                Nombre de la Farmacia
              </th>
              <th className="py-3 px-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider">
                Código Sanitario
              </th>
              <th className="py-3 px-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider">
                RIF
              </th>
              <th className="py-3 px-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((pharmacy) => (
              <tr
                key={pharmacy.id_pharmacy ?? pharmacy.name}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-3 px-4 font-semibold text-gray-800">
                  {pharmacy.name}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {pharmacy.health_code}
                </td>
                <td className="py-3 px-4 text-gray-600">{pharmacy.rif}</td>
                {/* <td className="py-3 px-4 text-right space-x-2">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <RiEdit2Line size={16} />
                  </button>
                  <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <RiDeleteBin6Line size={16} />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista para Mobile (Cards) */}
      <div className="md:hidden divide-y divide-gray-100">
        {data.map((pharmacy) => (
          <div key={pharmacy.id_pharmacy} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-gray-800">
                  {pharmacy.name}
                </h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                  RIF: {pharmacy.rif}
                </p>
              </div>
              {/* <div className="flex gap-2">
                <button className="p-2 text-blue-600 bg-blue-50 rounded-xl transition-all active:scale-90">
                  <RiEdit2Line size={18} />
                </button>
                <button className="p-2 text-red-500 bg-red-50 rounded-xl transition-all active:scale-90">
                  <RiDeleteBin6Line size={18} />
                </button>
              </div> */}
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">
                Código Sanitario:
              </span>
              <span className="text-gray-800 font-bold">
                {pharmacy.health_code}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
