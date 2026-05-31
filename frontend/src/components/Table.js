// src/components/Table.js - Reusable Table Component
import React from 'react';

function Table({ columns, data, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                    {row[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => onEdit && onEdit(row)}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(row.id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
