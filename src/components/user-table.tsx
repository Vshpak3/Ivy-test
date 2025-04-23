import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  Row,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { users } from "@/data/users";

export function UserTable() {
  const [data, setData] = useState(users);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    column: string;
    value: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "age",
      header: "Age",
    },
    {
      accessorKey: "nickname",
      header: "Nickname",
    },
    {
      accessorKey: "employee",
      header: "Employee",
      cell: ({ row }: { row: Row<(typeof data)[0]> }) => (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={row.original.employee}
            onChange={(e) => {
              const updatedData = [...data];
              updatedData[row.index] = {
                ...updatedData[row.index],
                employee: e.target.checked,
              };
              setData(updatedData);
            }}
            className="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    setEditingRow(null);
    setEditingCell(null);
  }, [searchTerm]);

  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((_, index) => index));
    }
  };

  const globalFilterFn = (
    row: Row<(typeof data)[0]>,
    _: string,
    filterValue: string
  ) => {
    return Object.values(row.original).some((value) =>
      String(value).toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    state: {
      globalFilter: searchTerm,
    },
    globalFilterFn: globalFilterFn,
  });

  const handleInputChange = (
    rowIndex: number,
    columnId: string,
    value: string
  ) => {
    setEditingCell({ row: rowIndex, column: columnId, value });
  };

  const handleSave = (rowIndex: number) => {
    if (!editingCell) return;
    const updatedData = [...data];
    const cellValue = editingCell.value;
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [editingCell.column]: cellValue,
    };
    setData(updatedData);
    setEditingRow(null);
    setEditingCell(null);
  };

  return (
    <div>
      <div className="mb-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={toggleSelectAll}>
          {selectedRows.length === data.length ? "Deselect All" : "Select All"}
        </Button>
      </div>
      </div>

      <Table className="border border-gray-300">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-gray-300">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="border-r border-gray-300">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, index) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className={`
                cursor-pointer
                hover:bg-muted/50
                ${selectedRows.includes(index) ? 'bg-blue-50' : ''}
                border-b border-gray-300
              `}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="border-r border-gray-300 p-0">
                  {editingRow === row.index ? (
                    <div className="flex gap-2 p-3">
                      <Input
                        value={
                          editingCell?.row === row.index &&
                          editingCell?.column === cell.column.id
                            ? editingCell.value
                            : (cell.getValue() as string)
                        }
                        onChange={(e) =>
                          handleInputChange(
                            row.index,
                            cell.column.id,
                            e.target.value
                          )
                        }
                      />
                      <Button onClick={() => handleSave(row.index)}>
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer p-3"
                      onClick={() => setEditingRow(row.index)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
