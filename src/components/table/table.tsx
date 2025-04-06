import { usefilteredData } from "@/store/use-filter-data";
import { columns } from "./columns"
import { DataTable } from "./data-table"

export default function DemoPage() {
  const { filteredData } = usefilteredData();
  return (
    <div className="">
      <DataTable columns={columns} data={filteredData} />
    </div>
  )
}
