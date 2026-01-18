import React, { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatRupiah, formatDate, formatPhone, getStatusColor } from '../utils/formatters';

const EmployeeTable = ({ 
  employees, 
  onEdit, 
  onDelete, 
  theme 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const itemsPerPage = 10;

  // Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = React.useMemo(() => {
    let sortableItems = [...employees];
    
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle numbers
        if (sortConfig.key === 'gaji') {
          aVal = parseInt(aVal);
          bVal = parseInt(bVal);
        }

        // Handle strings
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems;
  }, [employees, sortConfig]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const SortButton = ({ column, children }) => (
    <button
      onClick={() => handleSort(column)}
      className={`${theme.text} font-semibold text-left hover:text-blue-500 transition-colors duration-200 flex items-center gap-1`}
    >
      {children}
      {sortConfig.key === column && (
        <span className="text-xs">
          {sortConfig.direction === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );

  if (employees.length === 0) {
    return (
      <div className={`${theme.card} ${theme.border} border rounded-xl p-12 text-center`}>
        <p className={`${theme.subtext} text-lg`}>
          Belum ada data karyawan. Klik "Tambah Karyawan" untuk memulai.
        </p>
      </div>
    );
  }

  return (
    <div className={`${theme.card} ${theme.border} border rounded-xl overflow-hidden`}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${theme.bg} ${theme.border} border-b`}>
            <tr>
              <th className="px-4 py-3 text-left">
                <SortButton column="id">ID</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton column="namaDepan">Nama</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton column="email">Email</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton column="telepon">Telepon</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton column="departemen">Departemen</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton column="jabatan">Jabatan</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton column="gaji">Gaji</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton column="tanggalMasuk">Tanggal Masuk</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton column="status">Status</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <span className={`${theme.text} font-semibold`}>Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.map((employee) => (
              <tr 
                key={employee.id} 
                className={`${theme.hover} transition-colors duration-150`}
              >
                <td className={`px-4 py-3 ${theme.text} font-mono text-sm`}>
                  {employee.id}
                </td>
                <td className={`px-4 py-3 ${theme.text}`}>
                  <div className="font-medium">
                    {employee.namaDepan} {employee.namaBelakang}
                  </div>
                  <div className={`${theme.subtext} text-sm`}>
                    {employee.kota}
                  </div>
                </td>
                <td className={`px-4 py-3 ${theme.subtext} text-sm`}>
                  {employee.email}
                </td>
                <td className={`px-4 py-3 ${theme.subtext} text-sm`}>
                  {formatPhone(employee.telepon)}
                </td>
                <td className={`px-4 py-3 ${theme.text}`}>
                  {employee.departemen}
                </td>
                <td className={`px-4 py-3 ${theme.subtext} text-sm`}>
                  {employee.jabatan}
                </td>
                <td className={`px-4 py-3 ${theme.text} font-medium`}>
                  {formatRupiah(employee.gaji)}
                </td>
                <td className={`px-4 py-3 ${theme.subtext} text-sm`}>
                  {formatDate(employee.tanggalMasuk)}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(employee)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(employee)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`${theme.bg} ${theme.border} border-t px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className={theme.subtext}>
              Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, sortedEmployees.length)} dari {sortedEmployees.length} karyawan
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${theme.card} ${theme.border} border px-3 py-2 rounded-lg ${theme.hover} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          currentPage === pageNumber
                            ? 'bg-blue-500 text-white'
                            : `${theme.card} ${theme.border} border ${theme.text} ${theme.hover}`
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <span key={pageNumber} className={`px-2 ${theme.subtext}`}>...</span>;
                  }
                  return null;
                })}
              </div>
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${theme.card} ${theme.border} border px-3 py-2 rounded-lg ${theme.hover} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;