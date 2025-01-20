import Sidebar from "../components/sidebar"
import regUserData from "../regUserData.json"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  Phone,
  Search,
  User,
} from "lucide-react";
import React from "react";



const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <User className="mr-2" size={16} /> ID
      </span>
    ),
  }),

  columnHelper.accessor("studentno", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
         Student Number
      </span>
    ),
  }),

  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <User className="mr-2" size={16} /> Name
      </span>
    ),
  }),
  columnHelper.accessor("email", {
    id: "email",
    cell: (info) => (
      info.getValue()
    ),
    header: () => (
      <span className="flex items-center"> Email </span>
    ),
  }),
  columnHelper.accessor("status", {
    header: () => (
      <span className="flex items-center"> Status </span>
    ),
    cell: (info) =><span className="italic text-white bg-green-600 p-2 px-3.5 rounded-3xl "> {info.getValue()}</span>
  }),
];


function Users(){

  const [data] = React.useState(() => [...regUserData]);
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [pagination, setPagination] = React.useState({
      pageIndex: 0,
      pageSize: 5,
    });

  const table = useReactTable({
      data,
      columns,
      state: {
        sorting,
        globalFilter,
        pagination, // Use the pagination state here
      },
      initialState: {
        pagination: {
          pageSize: 5,
          pageIndex: 0,
        },
      },
      onSortingChange: setSorting,
      onGlobalFilterChange: setGlobalFilter,
      onPaginationChange: setPagination, // Update pagination handler
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });

  console.log(table.getRowModel());

    return(
        <>
      <Sidebar/>
      <div className ="d-container">
          <div className="flex flex-col min-h-full max-xl:-4xl py-12 px-4 sm:px-6 lg:px-8">
               <div className="mb-4 relative">
                 <input
                   value={globalFilter ?? ""}
                   onChange={(e) => setGlobalFilter(e.target.value)}
                   placeholder="Search..."
                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                 />
                 <Search
                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                   size={20}
                 />
               </div>
         
               <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                 <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-50">
                     {table.getHeaderGroups().map((headerGroup) => (
                       <tr key={headerGroup.id}>
                         {headerGroup.headers.map((header) => (
                           <th
                             key={header.id}
                             className="text-center p-3 px-20 border text-xs font-medium text-blue-800 uppercase tracking-wider "
                           >
                             <div
                               {...{
                                 className: header.column.getCanSort()
                                   ? "cursor-pointer select-none flex items-center"
                                   : "",
                                 onClick: header.column.getToggleSortingHandler(),
                               }}
                             >
                               {flexRender(
                                 header.column.columnDef.header,
                                 header.getContext()
                               )}
                               <ArrowUpDown className="ml-2" size={14} />
                             </div>
                           </th>
                         ))}
                       </tr>
                     ))}
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {table.getRowModel().rows.map((row) => (
                       <tr key={row.id} className="hover:bg-gray-100 cursor-pointer">
                         {row.getVisibleCells().map((cell) => (
                           <td
                             key={cell.id}
                             className=" text-center border px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                           >
                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
                           </td>
                         ))}
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
         
               <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700">
                 <div className="flex items-center mb-4 sm:mb-0">
                   <span className="mr-2">Items per page</span>
                   <select
                     className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                     value={table.getState().pagination.pageSize}
                     onChange={(e) => {
                       table.setPageSize(Number(e.target.value,5));
                     }}
                   >
                     {[5, 10, 20, 30].map((pageSize) => (
                       <option key={pageSize} value={pageSize}>
                         {pageSize}
                       </option>
                     ))}
                   </select>
                 </div>
         
                 <div className="flex items-center space-x-2">
                   <button
                     className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                     onClick={() => table.setPageIndex(0)}
                     disabled={!table.getCanPreviousPage()}
                   >
                     <ChevronsLeft size={20} />
                   </button>
         
                   <button
                     className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                     onClick={() => table.previousPage()}
                     disabled={!table.getCanPreviousPage()}
                   >
                     <ChevronLeft size={20} />
                   </button>
         
                   <span className="flex items-center">
                     <input
                       min={1}
                       max={table.getPageCount()}
                       type="number"
                       value={table.getState().pagination.pageIndex + 1}
                       onChange={(e) => {
                         const page = e.target.value ? Number(e.target.value) - 1 : 0;
                         table.setPageIndex(page);
                       }}
                       className="w-16 p-2 rounded-md border border-gray-300 text-center"
                     />
                     <span className="ml-1">of {table.getPageCount()}</span>
                   </span>
         
                   <button
                     className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                     onClick={() => table.nextPage()}
                     disabled={!table.getCanNextPage()}
                   >
                     <ChevronRight size={20} />
                   </button>
         
                   <button
                     className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                     onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                     disabled={!table.getCanNextPage()}
                   >
                     <ChevronsRight size={20} />
                   </button>
                 </div>
               </div>
             </div>
              
         
             </div>
             
            </>
    
      
    )
}

export default Users