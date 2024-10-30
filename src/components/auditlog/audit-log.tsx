/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useAuditStore from "@/stores/audit.store"

interface IAuditLog {
      _id: string;
      userId: string;
      role: 'CLIENT' | 'AGENT';  // Specifies that the role is either 'CLIENT' or 'AGENT'
      action: string;
      targetId?: string;         // Optional target identifier
      timestamp: Date;
      metadata?: any;            // Optional metadata for additional information
      serviceProviderId: string;
      username: string;
    }
type SortKey = keyof IAuditLog

export default function AuditLogPage() {
      const logs = useAuditStore((state) => state.logs)
      const loading = useAuditStore((state) => state.loading)
      const fetchAuditLogs = useAuditStore((state) => state.fetchAuditLogs)
      
      const [sortKey, setSortKey] = useState("timestamp")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterValue, setFilterValue] = useState("")
  const [roleFilter, setRoleFilter] = useState<"ALL" | "CLIENT" | "AGENT">("ALL")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [visibleColumns, setVisibleColumns] = useState({
    username: true,
    role: true,
    action: true,
    targetId: true,
    timestamp: true,
    serviceProviderId: true,
    metadata: true,

  })

  // Fetch logs on component mount
  useEffect(() => {
    fetchAuditLogs()
  }, [fetchAuditLogs])

  // Sort logs when sortKey or sortOrder changes
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  // Filter logs based on input value
  const handleFilter = (value: string) => {
    setFilterValue(value)
    setCurrentPage(1)
  }

  // Filter logs by role
  const handleRoleFilter = (value: "ALL" | "CLIENT" | "AGENT") => {
    setRoleFilter(value)
    setCurrentPage(1)
  }

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }))
  }

  // Apply sorting and filtering
  const filteredLogs = logs
    .filter((log) => {
      const matchFilter = filterValue
        ? log.username.toLowerCase().includes(filterValue.toLowerCase()) ||
          log.action.toLowerCase().includes(filterValue.toLowerCase()) ||
          log.serviceProviderId.toLowerCase().includes(filterValue.toLowerCase()) ||
          (log.targetId && log.targetId.toLowerCase().includes(filterValue.toLowerCase()))
        : true

      const matchRole = roleFilter === "ALL" || log.role === roleFilter

      return matchFilter && matchRole
    })
    .sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1
      if (a[sortKey] < b[sortKey]) return -1 * order
      if (a[sortKey] > b[sortKey]) return 1 * order
      return 0
    })

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Audit Log</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Filter logs..."
            value={filterValue}
            onChange={(e) => handleFilter(e.target.value)}
            className="max-w-sm"
          />
          <Select value={roleFilter} onValueChange={handleRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="CLIENT">Client</SelectItem>
              <SelectItem value="AGENT">Agent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(visibleColumns).map(([key, value]) => (
              <DropdownMenuCheckboxItem
                key={key}
                className="capitalize"
                checked={value}
                onCheckedChange={() => toggleColumn(key as keyof typeof visibleColumns)}
              >
                {key}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.username && (
                  <TableHead className="w-[200px]">
                    <Button variant="ghost" onClick={() => handleSort("username")}>
                      Username {sortKey === "username" && (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.action && (
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("action")}>
                      Action {sortKey === "action" && (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}
                    </Button>
                  </TableHead>

                )}
                  {visibleColumns.targetId && (
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("targetId")}>
                          Target ID {sortKey === "targetId" && (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}
                        </Button>
                    </TableHead>
                  )}

                  {visibleColumns.timestamp && (
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("timestamp")}>
                          Timestamp {sortKey === "timestamp" && (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}
                        </Button>
                    </TableHead>
                  )}


                  {visibleColumns.serviceProviderId && (
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("serviceProviderId")}>
                          Service Provider ID {sortKey === "serviceProviderId" && (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}
                        </Button>
                    </TableHead>
                  )}

                  {visibleColumns.role && (
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("role")}>
                          Role {sortKey === "role" && (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}
                        </Button>
                    </TableHead>
                  )}

                  {visibleColumns.metadata && (
                        <TableHead>
                              <Button variant="ghost" onClick={() => handleSort("metadata")}>
                              Metadata 
                              </Button>
                        </TableHead>
                  )}

                  


                {/* Repeat for other columns as per visibility */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow key={log._id}>
                  {visibleColumns.username && <TableCell>{log.username}</TableCell>}
                  {visibleColumns.action && <TableCell>{log.action}</TableCell>}
                  {visibleColumns.targetId && <TableCell>{log.targetId}</TableCell>}
                  {visibleColumns.timestamp && <TableCell>{log.timestamp}</TableCell>}
                  {visibleColumns.serviceProviderId && <TableCell>{log.serviceProviderId}</TableCell>}
                  {visibleColumns.role && <TableCell>{log.role}</TableCell>}
                  {visibleColumns.metadata && <TableCell>{JSON.stringify(log.metadata)}</TableCell>}

                  {/* Repeat for other columns as per visibility */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex items-center justify-between space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
          Previous
        </Button>
        <div className="text-center">Page {currentPage} of {Math.ceil(filteredLogs.length / itemsPerPage)}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredLogs.length / itemsPerPage)))}
          disabled={currentPage === Math.ceil(filteredLogs.length / itemsPerPage)}
        >
          Next <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
