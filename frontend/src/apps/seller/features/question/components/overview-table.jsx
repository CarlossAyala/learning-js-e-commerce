import { useSearchParams } from "react-router-dom";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Button,
  EmptyPlaceholder,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from "@/components";
import { useGetQuestions } from "../queries";
import { OverviewTableAction } from "./overview-table-action";

const { accessor, display } = createColumnHelper();

const columns = [
  accessor("name", {
    header: () => "Product",
    cell: (info) => (
      <div className="flex">
        <span className="max-w-md truncate font-medium">{info.getValue()}</span>
      </div>
    ),
  }),
  accessor("question", {
    header: () => "Question",
    cell: (info) => (
      <div className="flex">
        <span className="max-w-md truncate font-medium">{info.getValue()}</span>
      </div>
    ),
  }),
  display({
    id: "actions",
    cell: (info) => <OverviewTableAction row={info.row} />,
  }),
];

export const OverviewTable = () => {
  const [params, setParams] = useSearchParams();
  const { data, isLoading, isError, error } = useGetQuestions(
    params.toString(),
  );
  const table = useReactTable({
    columns,
    data: data?.rows,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleClearFilters = () => {
    setParams({});
  };

  const hasFilters = params.toString() !== "";

  return (
    <>
      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <EmptyPlaceholder title="Error" description={error.message} />
      ) : (
        <>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : hasFilters ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-48 text-center"
                  >
                    <p>No results.</p>
                    <Button
                      type="button"
                      className="mt-4"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-48 text-center"
                  >
                    You are up to date.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Pagination totalRows={data?.count} />
        </>
      )}
    </>
  );
};
