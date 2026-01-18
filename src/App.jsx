import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Plus, Users as UsersIcon, LogOut } from 'lucide-react';
import { useGoogleSheets } from './hooks/useGoogleSheets';
import { getTheme } from './utils/theme';
import { exportToExcel } from './utils/formatters';
import googleSheetsService from './services/googleSheetsService';
import { GOOGLE_CONFIG } from './config/googleConfig';

// Components
import ThemeToggle from './components/ThemeToggle';
import SearchBar from './components/SearchBar';
import EmployeeTable from './components/EmployeeTable';
import EmployeeForm from './components/EmployeeForm';
import DeleteModal from './components/DeleteModal';

function AppContent() {
  const [isDark, setIsDark] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ departemen: '', status: '' });
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const theme = getTheme(isDark);
  const { 
    employees, 
    loading, 
    error, 
    loadEmployees,
    addEmployee, 
    updateEmployee, 
    deleteEmployee,
    generateDummyData 
  } = useGoogleSheets(isSignedIn);

  // Google Login
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('✅ Login success!', tokenResponse);
      setAccessToken(tokenResponse.access_token);
      
      // Get user info
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const userInfo = await userInfoResponse.json();
        setUser(userInfo);
        setIsSignedIn(true);
        
        // Initialize Google Sheets service with token
        await googleSheetsService.initWithToken(tokenResponse.access_token);
      } catch (error) {
        console.error('Error getting user info:', error);
      }
    },
    onError: (error) => {
      console.error('❌ Login failed:', error);
      alert('Login gagal. Coba lagi.');
    },
    scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
  });

  const handleSignOut = () => {
    setIsSignedIn(false);
    setUser(null);
    setAccessToken(null);
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchSearch = 
      emp.namaDepan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.namaBelakang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.departemen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jabatan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDepartemen = !filters.departemen || emp.departemen === filters.departemen;
    const matchStatus = !filters.status || emp.status === filters.status;

    return matchSearch && matchDepartemen && matchStatus;
  });

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, employeeData);
      } else {
        await addEmployee(employeeData);
      }
      setShowForm(false);
      setEditingEmployee(null);
    } catch (error) {
      alert('Gagal menyimpan data: ' + error.message);
    }
  };

  const handleDeleteEmployee = (employee) => {
    setDeletingEmployee(employee);
  };

  const confirmDelete = async () => {
    try {
      await deleteEmployee(deletingEmployee.id);
      setDeletingEmployee(null);
    } catch (error) {
      alert('Gagal menghapus data: ' + error.message);
    }
  };

  const handleExport = () => {
  exportToExcel(filteredEmployees, 'Data-Karyawan.xlsx');
};

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleGenerateDummyData = async () => {
    if (window.confirm('Generate 55 data karyawan dummy? Data ini akan ditambahkan ke Google Sheets.')) {
      try {
        await generateDummyData();
        alert('Berhasil generate 55 data karyawan!');
      } catch (error) {
        alert('Gagal generate data: ' + error.message);
      }
    }
  };

  // Not signed in - Login page
  if (!isSignedIn) {
    return (
      <div className={`${theme.bg} min-h-screen flex items-center justify-center p-4`}>
        <div className={`${theme.card} ${theme.border} border rounded-2xl p-8 max-w-md w-full shadow-2xl`}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <UsersIcon className={`w-16 h-16 ${theme.text}`} />
            </div>
            <h1 className={`${theme.text} text-3xl font-bold mb-2`}>
              Sistem Manajemen Karyawan
            </h1>
            <p className={theme.subtext}>
              Kelola data karyawan dengan Google Sheets
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => login()}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg border border-gray-300 flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Masuk dengan Google
            </button>

            <div className={`${theme.card} ${theme.border} border rounded-lg p-4`}>
              <h3 className={`${theme.text} font-semibold mb-2`}>Fitur:</h3>
              <ul className={`${theme.subtext} text-sm space-y-1`}>
                <li>✓ Tambah, Edit, Hapus Karyawan</li>
                <li>✓ Pencarian & Filter</li>
                <li>✓ Export ke CSV</li>
                <li>✓ Sinkronisasi Real-time dengan Google Sheets</li>
                <li>✓ 50+ Data Karyawan Indonesia</li>
              </ul>
            </div>
          </div>

          <p className={`${theme.subtext} text-xs text-center mt-6`}>
            Data akan disimpan di Google Sheets Anda
          </p>
        </div>
      </div>
    );
  }

  // Signed in - Main app
  return (
    <div className={`${theme.bg} min-h-screen transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`${theme.text} text-3xl font-bold mb-2 flex items-center gap-3`}>
              <UsersIcon className="w-8 h-8" />
              Sistem Manajemen Karyawan
            </h1>
            <p className={theme.subtext}>
              Kelola data karyawan dengan Google Sheets • {user?.name}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} theme={theme} />
            <button
              onClick={handleSignOut}
              className={`${theme.card} ${theme.border} border px-4 py-2 rounded-lg ${theme.text} ${theme.hover} transition-all duration-200 flex items-center gap-2`}
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className={`${theme.card} ${theme.border} border rounded-xl p-4`}>
            <div className={`${theme.subtext} text-sm mb-1`}>Total Karyawan</div>
            <div className={`${theme.text} text-2xl font-bold`}>{employees.length}</div>
          </div>
          <div className={`${theme.card} ${theme.border} border rounded-xl p-4`}>
            <div className={`${theme.subtext} text-sm mb-1`}>Karyawan Aktif</div>
            <div className={`${theme.text} text-2xl font-bold`}>
              {employees.filter(e => e.status === 'Aktif').length}
            </div>
          </div>
          <div className={`${theme.card} ${theme.border} border rounded-xl p-4`}>
            <div className={`${theme.subtext} text-sm mb-1`}>Departemen</div>
            <div className={`${theme.text} text-2xl font-bold`}>
              {new Set(employees.map(e => e.departemen)).size}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={handleAddEmployee}
            className={`${theme.button} text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl`}
          >
            <Plus className="w-5 h-5" />
            Tambah Karyawan
          </button>
          
          {employees.length === 0 && (
            <button
              onClick={handleGenerateDummyData}
              disabled={loading}
              className={`${theme.success} text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50`}
            >
              Generate 55 Data Dummy
            </button>
          )}
        </div>

        {/* Search & Filter */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
          onRefresh={loadEmployees}
          loading={loading}
          theme={theme}
        />

        {/* Table */}
        {loading ? (
          <div className={`${theme.card} ${theme.border} border rounded-xl p-12 text-center`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className={theme.text}>Memuat data...</p>
          </div>
        ) : (
          <EmployeeTable
            employees={filteredEmployees}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
            theme={theme}
          />
        )}

        {/* Form Modal */}
        {showForm && (
          <EmployeeForm
            employee={editingEmployee}
            onSave={handleSaveEmployee}
            onCancel={() => {
              setShowForm(false);
              setEditingEmployee(null);
            }}
            theme={theme}
          />
        )}

        {/* Delete Modal */}
        {deletingEmployee && (
          <DeleteModal
            employee={deletingEmployee}
            onConfirm={confirmDelete}
            onCancel={() => setDeletingEmployee(null)}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CONFIG.CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  );
}

export default App;