import React from 'react';
import { clsx } from 'clsx';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  hideOnMobile?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function Table<T>({ 
  data, 
  columns, 
  loading = false, 
  emptyMessage = 'No data available',
  className 
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-2"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded mb-1"></div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={clsx('overflow-x-auto', className)}>
      <div className="min-w-full">
        {/* Desktop Table */}
        <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={clsx(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.hideOnMobile && 'hidden lg:table-cell'
                  )}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td 
                    key={String(column.key)} 
                    className={clsx(
                      'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                      column.hideOnMobile && 'hidden lg:table-cell'
                    )}
                  >
                    {column.render 
                      ? column.render(item[column.key], item)
                      : String(item[column.key])
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card Layout */}
        <div className="sm:hidden space-y-4">
          {data.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              {columns.filter(col => !col.hideOnMobile).map((column) => (
                <div key={String(column.key)} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm font-medium text-gray-500 w-1/3">
                    {column.label}
                  </span>
                  <span className="text-sm text-gray-900 w-2/3 text-right">
                    {column.render 
                      ? column.render(item[column.key], item)
                      : String(item[column.key])
                    }
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}