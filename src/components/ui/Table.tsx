import React from 'react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  emptyMessage?: string;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No records found',
  className = '',
}: TableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl border border-stone-200 bg-white ${className}`}>
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-[#FAF8F2] border-b border-stone-200 text-stone-700 uppercase text-[10px] font-black tracking-wider">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`p-4 font-black ${
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left'
                } ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr key={keyExtractor(row, rowIdx)} className="hover:bg-stone-50/70 transition-colors">
                {columns.map((col, colIdx) => {
                  let content: React.ReactNode = null;
                  if (typeof col.accessor === 'function') {
                    content = col.accessor(row);
                  } else if (col.accessor) {
                    content = String(row[col.accessor] ?? '');
                  }
                  return (
                    <td
                      key={colIdx}
                      className={`p-4 text-stone-700 font-medium ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      } ${col.className || ''}`}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-stone-400 font-medium">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
