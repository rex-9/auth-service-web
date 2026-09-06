import { Checkbox } from "../../../design/components/form/Checkbox";
import { iconsLib } from "../../../assets";
import { cn } from "../../../design/helpers";
import { SORT_ORDERS, type TSortOrder } from "../../../hooks/useSort";

export interface IAdminTableColumn<T> {
  key: string;
  header: string;
  render: (record: T) => React.ReactNode;
  className?: string;
  sortKey?: string;
}

export interface IAdminTableProps<T> {
  columns: IAdminTableColumn<T>[];
  records: T[];
  getRowKey: (record: T) => string;
  sortBy?: string;
  sortOrder?: TSortOrder;
  onSort?: (sortKey: string) => void;
  selectable?: boolean;
  selectedRowKeys?: string[];
  onSelectRow?: (key: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
}

const AdminTableHead: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <thead>{children}</thead>;

const AdminTableRow: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <tr className={cn("border-base-300", className)}>{children}</tr>
);

const AdminTableHeaderCell: React.FC<{
  children: React.ReactNode;
  className?: string;
  sortKey?: string;
  currentSortBy?: string;
  currentSortOrder?: TSortOrder;
  onSort?: (sortKey: string) => void;
}> = ({
  children,
  className,
  sortKey,
  currentSortBy,
  currentSortOrder = SORT_ORDERS.DESC,
  onSort,
}) => {
  const isSorted = sortKey && currentSortBy === sortKey;

  const renderSortIcon = () => {
    if (!sortKey) return null;

    if (isSorted) {
      if (currentSortOrder === SORT_ORDERS.ASC) {
        const Icon = iconsLib.chevronUp;
        return (
          <Icon
            className="h-4 w-4 text-primary shrink-0 transition-transform"
            aria-hidden="true"
          />
        );
      }
      const Icon = iconsLib.chevronDown;
      return (
        <Icon
          className="h-4 w-4 text-primary shrink-0 transition-transform"
          aria-hidden="true"
        />
      );
    }

    const Icon = iconsLib.chevronUpDown;
    return (
      <Icon
        className="h-4 w-4 text-base-content opacity-30 group-hover:opacity-70 shrink-0 transition-opacity"
        aria-hidden="true"
      />
    );
  };

  return (
    <th
      className={cn(
        "bg-base-200 text-body-s font-semibold text-base-content",
        className,
      )}
    >
      {sortKey && onSort ? (
        <button
          type="button"
          onClick={() => onSort(sortKey)}
          className={cn(
            "group inline-flex items-center gap-1.5 cursor-pointer select-none rounded hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            className?.includes("text-center") && "justify-center",
            className?.includes("text-right") && "justify-end",
          )}
          title={`Sort by ${typeof children === "string" ? children : sortKey}`}
        >
          <span>{children}</span>
          {renderSortIcon()}
        </button>
      ) : (
        children
      )}
    </th>
  );
};

const AdminTableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => <td className={className}>{children}</td>;

export function AdminTable<T>({
  columns,
  records,
  getRowKey,
  sortBy,
  sortOrder,
  onSort,
  selectable = false,
  selectedRowKeys = [],
  onSelectRow,
  onSelectAll,
}: IAdminTableProps<T>) {
  const allSelected =
    selectable &&
    records.length > 0 &&
    records.every((record) => selectedRowKeys.includes(getRowKey(record)));

  return (
    <div className="overflow-hidden rounded-md border border-base-300 bg-base-100">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <AdminTableHead>
            <AdminTableRow>
              {selectable && (
                <th className="bg-base-200 w-12 text-center px-3">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={!!allSelected}
                      onChange={(e) => onSelectAll?.(e.target.checked)}
                      aria-label="Select all rows"
                    />
                  </div>
                </th>
              )}
              {columns.map((column) => (
                <AdminTableHeaderCell
                  key={column.key}
                  className={column.className}
                  sortKey={column.sortKey}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                >
                  {column.header}
                </AdminTableHeaderCell>
              ))}
            </AdminTableRow>
          </AdminTableHead>
          <tbody>
            {records.map((record) => {
              const rowKey = getRowKey(record);
              const isSelected = selectable && selectedRowKeys.includes(rowKey);

              return (
                <AdminTableRow
                  key={rowKey}
                  className={cn(
                    "transition-colors",
                    isSelected && "bg-primary/5",
                  )}
                >
                  {selectable && (
                    <td className="w-12 text-center px-3">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={!!isSelected}
                          onChange={(e) =>
                            onSelectRow?.(rowKey, e.target.checked)
                          }
                          aria-label={`Select row ${rowKey}`}
                        />
                      </div>
                    </td>
                  )}
                  {columns.map((column) => (
                    <AdminTableCell
                      key={column.key}
                      className={column.className}
                    >
                      {column.render(record)}
                    </AdminTableCell>
                  ))}
                </AdminTableRow>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
