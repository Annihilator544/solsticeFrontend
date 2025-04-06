import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useTableData } from "@/store/use-table-data";

export default function DemoPage() {
  const { tableData } = useTableData();
  return (
    <div className="">
      <DataTable columns={columns} data={tableData} />
    </div>
  )
}
