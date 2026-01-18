import React from 'react';
import { Search, Download, RefreshCw } from 'lucide-react';

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  onFilterChange, 
  onExport, 
  onRefresh,
  loading,
  theme 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.subtext} w-5 h-5`} />
        <input
          type="text"
          placeholder="Cari nama, email, departemen..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${theme.input} ${theme.border} border rounded-lg pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
      </div>

      {/* Filter Departemen */}
      <select
        onChange={(e) => onFilterChange('departemen', e.target.value)}
        className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
      >
        <option value="">Semua Departemen</option>
        <option value="IT">IT</option>
        <option value="Marketing">Marketing</option>
        <option value="Finance">Finance</option>
        <option value="Human Resources">Human Resources</option>
        <option value="Operations">Operations</option>
        <option value="Sales">Sales</option>
        <option value="Customer Service">Customer Service</option>
        <option value="Legal">Legal</option>
        <option value="Produksi">Produksi</option>
        <option value="Logistik">Logistik</option>
      </select>

      {/* Filter Status */}
      <select
        onChange={(e) => onFilterChange('status', e.target.value)}
        className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
      >
        <option value="">Semua Status</option>
        <option value="Aktif">Aktif</option>
        <option value="Cuti">Cuti</option>
        <option value="Resign">Resign</option>
      </select>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onRefresh}
          disabled={loading}
          className={`${theme.button} text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
        
        <button
          onClick={onExport}
          className={`${theme.success} text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200`}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;