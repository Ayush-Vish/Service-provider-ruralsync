import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuditStore from "@/stores/audit.store";
import { Skeleton } from "@/components/ui/skeleton";

interface IAuditLog {
  _id: string;
  userId: string;
  role: "CLIENT" | "AGENT";
  action: string;
  targetId?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  serviceProviderId: string;
  username: string;
}

type SortKey = keyof IAuditLog;

function getActionColor(action: string) {
  if (action.includes('CREATE') || action.includes('ADD')) {
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
  }
  if (action.includes('UPDATE') || action.includes('EDIT')) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  }
  if (action.includes('DELETE') || action.includes('REMOVE')) {
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
}

export default function AuditLogsPage() {
  const logs = useAuditStore((state) => state.logs);
  const loading = useAuditStore((state) => state.loading);
  const fetchAuditLogs = useAuditStore((state) => state.fetchAuditLogs);

  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterValue, setFilterValue] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "CLIENT" | "AGENT">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [visibleColumns, setVisibleColumns] = useState({
    username: true,
    role: true,
    action: true,
    targetId: true,
    timestamp: true,
    serviceProviderId: false,
    metadata: false,
  });

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleFilter = (value: string) => {
    setFilterValue(value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (value: "ALL" | "CLIENT" | "AGENT") => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const filteredLogs = logs
    .filter((log) => {
      const matchFilter = filterValue
        ? log.username?.toLowerCase().includes(filterValue.toLowerCase()) ||
          log.action?.toLowerCase().includes(filterValue.toLowerCase()) ||
          log.serviceProviderId?.toLowerCase().includes(filterValue.toLowerCase()) ||
          (log.targetId && log.targetId.toLowerCase().includes(filterValue.toLowerCase()))
        : true;

      const matchRole = roleFilter === "ALL" || log.role === roleFilter;

      return matchFilter && matchRole;
    })
    .sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      if (a[sortKey] < b[sortKey]) return -1 * order;
      if (a[sortKey] > b[sortKey]) return 1 * order;
      return 0;
    });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortButton = ({ sortKeyName, children }: { sortKeyName: SortKey; children: React.ReactNode }) => (
    <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => handleSort(sortKeyName)}>
      {children}
      {sortKey === sortKeyName && (
        sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
      )}
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Track all activities and changes in your organization
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Logs</p>
                <p className="text-2xl font-bold">{logs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Client Actions</p>
                <p className="text-2xl font-bold">{logs.filter(l => l.role === 'CLIENT').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agent Actions</p>
                <p className="text-2xl font-bold">{logs.filter(l => l.role === 'AGENT').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={filterValue}
              onChange={(e) => handleFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={handleRoleFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
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
            <Button variant="outline" className="gap-2">
              Columns
              <ChevronDown className="h-4 w-4" />
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
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-1">No logs found</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                {filterValue || roleFilter !== 'ALL'
                  ? "Try adjusting your filters" 
                  : "Activity logs will appear here"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {visibleColumns.username && (
                      <TableHead>
                        <SortButton sortKeyName="username">Username</SortButton>
                      </TableHead>
                    )}
                    {visibleColumns.role && (
                      <TableHead>
                        <SortButton sortKeyName="role">Role</SortButton>
                      </TableHead>
                    )}
                    {visibleColumns.action && (
                      <TableHead>
                        <SortButton sortKeyName="action">Action</SortButton>
                      </TableHead>
                    )}
                    {visibleColumns.targetId && (
                      <TableHead>Target ID</TableHead>
                    )}
                    {visibleColumns.timestamp && (
                      <TableHead>
                        <SortButton sortKeyName="timestamp">Timestamp</SortButton>
                      </TableHead>
                    )}
                    {visibleColumns.serviceProviderId && (
                      <TableHead>Service Provider</TableHead>
                    )}
                    {visibleColumns.metadata && (
                      <TableHead>Metadata</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.map((log) => (
                    <TableRow key={log._id}>
                      {visibleColumns.username && (
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-semibold text-sm">
                                {log.username?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <span className="font-medium">{log.username}</span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.role && (
                        <TableCell>
                          <Badge variant={log.role === 'CLIENT' ? 'default' : 'secondary'}>
                            {log.role}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.action && (
                        <TableCell>
                          <Badge className={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.targetId && (
                        <TableCell>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {log.targetId || '-'}
                          </code>
                        </TableCell>
                      )}
                      {visibleColumns.timestamp && (
                        <TableCell className="text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                      )}
                      {visibleColumns.serviceProviderId && (
                        <TableCell>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {log.serviceProviderId}
                          </code>
                        </TableCell>
                      )}
                      {visibleColumns.metadata && (
                        <TableCell>
                          {log.metadata ? (
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {JSON.stringify(log.metadata).substring(0, 50)}...
                            </code>
                          ) : '-'}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of{' '}
            {filteredLogs.length} entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    className="w-8"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
