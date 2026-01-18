import { GOOGLE_CONFIG } from '../config/googleConfig';

class GoogleSheetsService {
  constructor() {
    this.accessToken = null;
    this.isInitialized = false;
  }

  // Initialize with access token
  async initWithToken(accessToken) {
    this.accessToken = accessToken;
    this.isInitialized = true;
  }

  // Get all employees from Google Sheets
  async getAllEmployees() {
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_CONFIG.SHEET_NAME}!A2:N`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch employees');
      }

      const data = await response.json();
      const rows = data.values || [];
      
      return rows.map((row, index) => ({
        id: row[0] || `emp-${index + 1}`,
        namaDepan: row[1] || '',
        namaBelakang: row[2] || '',
        email: row[3] || '',
        telepon: row[4] || '',
        departemen: row[5] || '',
        jabatan: row[6] || '',
        gaji: parseInt(row[7]) || 0,
        tanggalMasuk: row[8] || '',
        status: row[9] || 'Aktif',
        alamat: row[10] || '',
        kota: row[11] || '',
        provinsi: row[12] || '',
        kodePos: row[13] || ''
      }));
    } catch (error) {
      console.error('Error getting employees:', error);
      throw error;
    }
  }

  // Add new employee
  async addEmployee(employee) {
    try {
      const values = [[
        employee.id,
        employee.namaDepan,
        employee.namaBelakang,
        employee.email,
        employee.telepon,
        employee.departemen,
        employee.jabatan,
        employee.gaji,
        employee.tanggalMasuk,
        employee.status,
        employee.alamat,
        employee.kota,
        employee.provinsi,
        employee.kodePos
      ]];

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_CONFIG.SHEET_NAME}!A:N:append?valueInputOption=RAW`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to add employee');
      }

      return employee;
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  }

  // Update employee
  async updateEmployee(employeeId, updatedData) {
    try {
      // First, find the row number
      const allEmployees = await this.getAllEmployees();
      const rowIndex = allEmployees.findIndex(emp => emp.id === employeeId);
      
      if (rowIndex === -1) {
        throw new Error('Employee not found');
      }

      const rowNumber = rowIndex + 2; // +2 because: array is 0-indexed and row 1 is header

      const values = [[
        updatedData.id,
        updatedData.namaDepan,
        updatedData.namaBelakang,
        updatedData.email,
        updatedData.telepon,
        updatedData.departemen,
        updatedData.jabatan,
        updatedData.gaji,
        updatedData.tanggalMasuk,
        updatedData.status,
        updatedData.alamat,
        updatedData.kota,
        updatedData.provinsi,
        updatedData.kodePos
      ]];

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_CONFIG.SHEET_NAME}!A${rowNumber}:N${rowNumber}?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update employee');
      }

      return updatedData;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  // Delete employee
  async deleteEmployee(employeeId) {
    try {
      const allEmployees = await this.getAllEmployees();
      const remainingEmployees = allEmployees.filter(emp => emp.id !== employeeId);
      
      if (remainingEmployees.length === allEmployees.length) {
        throw new Error('Employee not found');
      }

      // Rewrite all employees (this effectively deletes the one we filtered out)
      await this.rewriteAllEmployees(remainingEmployees);

      return employeeId;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  // Helper: Rewrite all employees
  async rewriteAllEmployees(employees) {
    try {
      const values = employees.map(emp => [
        emp.id,
        emp.namaDepan,
        emp.namaBelakang,
        emp.email,
        emp.telepon,
        emp.departemen,
        emp.jabatan,
        emp.gaji,
        emp.tanggalMasuk,
        emp.status,
        emp.alamat,
        emp.kota,
        emp.provinsi,
        emp.kodePos
      ]);

      // Clear all data rows first
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_CONFIG.SHEET_NAME}!A2:N:clear`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Write new data
      if (values.length > 0) {
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_CONFIG.SHEET_NAME}!A2:N?valueInputOption=RAW`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ values })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to rewrite employees');
        }
      }
    } catch (error) {
      console.error('Error rewriting employees:', error);
      throw error;
    }
  }

  // Generate initial dummy data (50+ karyawan Indonesia)
  async generateDummyData() {
    const dummyEmployees = this.generateIndonesianEmployees(55);
    
    try {
      // Add all employees one by one
      for (const employee of dummyEmployees) {
        await this.addEmployee(employee);
      }

      return dummyEmployees;
    } catch (error) {
      console.error('Error generating dummy data:', error);
      throw error;
    }
  }

  // Generate Indonesian employees data
  generateIndonesianEmployees(count) {
    const namaDepan = [
      'Budi', 'Siti', 'Ahmad', 'Dewi', 'Eko', 'Fitri', 'Hadi', 'Indah',
      'Joko', 'Kartika', 'Lestari', 'Made', 'Novi', 'Putri', 'Rahmat',
      'Sari', 'Tono', 'Wati', 'Yudi', 'Zahra', 'Agus', 'Ayu', 'Bambang',
      'Citra', 'Dedi', 'Eka', 'Fajar', 'Gita', 'Hendra', 'Ika'
    ];

    const namaBelakang = [
      'Santoso', 'Wijaya', 'Permana', 'Sari', 'Pratama', 'Kusuma',
      'Hidayat', 'Rahman', 'Utomo', 'Puspita', 'Nugroho', 'Lestari',
      'Wardana', 'Saputra', 'Wibowo', 'Handoko', 'Setiawan', 'Firmansyah'
    ];

    const departemen = [
      'IT', 'Marketing', 'Finance', 'Human Resources', 'Operations',
      'Sales', 'Customer Service', 'Legal', 'Produksi', 'Logistik'
    ];

    const jabatanByDept = {
      'IT': ['Software Developer', 'System Analyst', 'DevOps Engineer', 'UI/UX Designer', 'IT Support'],
      'Marketing': ['Marketing Manager', 'Content Creator', 'Social Media Specialist', 'SEO Specialist'],
      'Finance': ['Akuntan', 'Financial Analyst', 'Kasir', 'Finance Manager'],
      'Human Resources': ['HR Manager', 'Recruiter', 'Training Specialist', 'HR Admin'],
      'Operations': ['Operations Manager', 'Project Manager', 'Quality Control'],
      'Sales': ['Sales Manager', 'Account Executive', 'Sales Representative'],
      'Customer Service': ['CS Manager', 'CS Representative', 'Support Specialist'],
      'Legal': ['Legal Manager', 'Legal Officer', 'Compliance Officer'],
      'Produksi': ['Production Manager', 'Supervisor Produksi', 'Operator Produksi'],
      'Logistik': ['Logistics Manager', 'Warehouse Supervisor', 'Delivery Coordinator']
    };

    const kota = [
      'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar',
      'Palembang', 'Tangerang', 'Bekasi', 'Depok', 'Bogor', 'Malang',
      'Yogyakarta', 'Denpasar', 'Balikpapan', 'Pontianak', 'Manado'
    ];

    const provinsi = {
      'Jakarta': 'DKI Jakarta',
      'Surabaya': 'Jawa Timur',
      'Bandung': 'Jawa Barat',
      'Medan': 'Sumatera Utara',
      'Semarang': 'Jawa Tengah',
      'Makassar': 'Sulawesi Selatan',
      'Palembang': 'Sumatera Selatan',
      'Tangerang': 'Banten',
      'Bekasi': 'Jawa Barat',
      'Depok': 'Jawa Barat',
      'Bogor': 'Jawa Barat',
      'Malang': 'Jawa Timur',
      'Yogyakarta': 'DI Yogyakarta',
      'Denpasar': 'Bali',
      'Balikpapan': 'Kalimantan Timur',
      'Pontianak': 'Kalimantan Barat',
      'Manado': 'Sulawesi Utara'
    };

    const status = ['Aktif', 'Aktif', 'Aktif', 'Aktif', 'Cuti', 'Resign'];

    const employees = [];

    for (let i = 0; i < count; i++) {
      const firstName = namaDepan[Math.floor(Math.random() * namaDepan.length)];
      const lastName = namaBelakang[Math.floor(Math.random() * namaBelakang.length)];
      const dept = departemen[Math.floor(Math.random() * departemen.length)];
      const jabatanList = jabatanByDept[dept];
      const jabatan = jabatanList[Math.floor(Math.random() * jabatanList.length)];
      const city = kota[Math.floor(Math.random() * kota.length)];
      
      const employee = {
        id: `EMP${String(i + 1).padStart(4, '0')}`,
        namaDepan: firstName,
        namaBelakang: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@perusahaan.co.id`,
        telepon: `08${Math.floor(10000000000 + Math.random() * 90000000000)}`.substring(0, 13),
        departemen: dept,
        jabatan: jabatan,
        gaji: Math.floor(5000000 + Math.random() * 20000000),
        tanggalMasuk: this.randomDate(new Date(2018, 0, 1), new Date(2024, 11, 31)),
        status: status[Math.floor(Math.random() * status.length)],
        alamat: `Jl. ${['Sudirman', 'Gatot Subroto', 'Thamrin', 'Kuningan', 'Asia Afrika'][Math.floor(Math.random() * 5)]} No. ${Math.floor(1 + Math.random() * 200)}`,
        kota: city,
        provinsi: provinsi[city],
        kodePos: String(10000 + Math.floor(Math.random() * 90000))
      };

      employees.push(employee);
    }

    return employees;
  }

  randomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  }
}

const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;
