"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PaymentInfo = {
  amount: number
  class: string
  date: string
  receiver: string
  subject: string
  type: "debited" | "credited" | "None"
  upi_id: string
  upi_reference: number
}

export const columns: ColumnDef<PaymentInfo>[] = [
    
    {
        accessorKey: "upi_reference",
        header: "UPI Reference",
    },
    {
        accessorKey: "class",
        header: "Class",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "receiver",
        header: "Receiver",
    },
    {
        accessorKey: "subject",
        header: "Subject",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "upi_id",
        header: "UPI ID",
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
        const amount = row.getValue("amount")
        return <span className="text-red-600 font-semibold">{amount as string}</span>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
          const payment = row.original
     
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(payment.upi_reference.toString())}
                >
                  Copy payment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View customer</DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
]
