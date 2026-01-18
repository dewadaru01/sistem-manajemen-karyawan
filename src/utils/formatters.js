import * as XLSX from 'xlsx';

// Format Rupiah
export const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format tanggal Indonesia
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
};

// Format nomor telepon
export const formatPhone = (phone) => {
  if (!phone) return '-';
  
  // Format: 0812-3456-7890
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})$/);
  
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  
  return phone;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Get status badge color
export const getStatusColor = (status) => {
  switch (status) {
    case 'Aktif':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'Cuti':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Resign':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};


// Export to Excel with proper formatting
export const exportToExcel = (data, filename = 'Data-Karyawan.xlsx') => {
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk di-export');
    return;
  }

  // Prepare data for Excel (convert to array of arrays)
  const excelData = [
    // Header row - exact same as Google Sheets
    ['ID', 'Nama Depan', 'Nama Belakang', 'Email', 'Telepon', 'Departemen', 'Jabatan', 'Gaji', 'Tanggal Masuk', 'Status', 'Alamat', 'Kota', 'Provinsi', 'Kode Pos'],
    // Data rows
    ...data.map(emp => [
      emp.id,
      emp.namaDepan,
      emp.namaBelakang,
      emp.email,
      emp.telepon,
      emp.departemen,
      emp.jabatan,
      emp.gaji, // Keep as number
      emp.tanggalMasuk,
      emp.status,
      emp.alamat,
      emp.kota,
      emp.provinsi,
      emp.kodePos
    ])
  ];

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // Set column widths (to match Google Sheets)
  ws['!cols'] = [
    { wch: 10 },  // ID
    { wch: 15 },  // Nama Depan
    { wch: 15 },  // Nama Belakang
    { wch: 30 },  // Email
    { wch: 15 },  // Telepon
    { wch: 18 },  // Departemen
    { wch: 25 },  // Jabatan
    { wch: 15 },  // Gaji
    { wch: 15 },  // Tanggal Masuk
    { wch: 10 },  // Status
    { wch: 30 },  // Alamat
    { wch: 15 },  // Kota
    { wch: 20 },  // Provinsi
    { wch: 10 }   // Kode Pos
  ];

  // Format header row (bold + background color)
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!ws[cellAddress]) continue;
    
    ws[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "4A90E2" } },
      alignment: { horizontal: "center", vertical: "center" }
    };
  }

  // Format Gaji column as currency (Rupiah)
  const gajiColumnIndex = 7; // Column H (0-indexed = 7)
  for (let row = 1; row <= range.e.r; row++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: gajiColumnIndex });
    if (ws[cellAddress]) {
      ws[cellAddress].z = '#,##0'; // Number format with thousand separator
    }
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Data Karyawan');

  // Generate Excel file and trigger download
  XLSX.writeFile(wb, filename);
};