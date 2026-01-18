import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const EmployeeForm = ({ employee, onSave, onCancel, theme }) => {
  const [formData, setFormData] = useState({
    namaDepan: '',
    namaBelakang: '',
    email: '',
    telepon: '',
    departemen: '',
    jabatan: '',
    gaji: '',
    tanggalMasuk: '',
    status: 'Aktif',
    alamat: '',
    kota: '',
    provinsi: '',
    kodePos: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Reset jabatan when departemen changes
    if (name === 'departemen') {
      setFormData(prev => ({ ...prev, jabatan: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.namaDepan.trim()) newErrors.namaDepan = 'Nama depan wajib diisi';
    if (!formData.namaBelakang.trim()) newErrors.namaBelakang = 'Nama belakang wajib diisi';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Phone validation
    if (!formData.telepon.trim()) {
      newErrors.telepon = 'Telepon wajib diisi';
    } else if (!/^08\d{8,11}$/.test(formData.telepon.replace(/\D/g, ''))) {
      newErrors.telepon = 'Format telepon tidak valid (contoh: 081234567890)';
    }

    if (!formData.departemen) newErrors.departemen = 'Departemen wajib dipilih';
    if (!formData.jabatan) newErrors.jabatan = 'Jabatan wajib dipilih';
    
    if (!formData.gaji) {
      newErrors.gaji = 'Gaji wajib diisi';
    } else if (isNaN(formData.gaji) || parseInt(formData.gaji) < 0) {
      newErrors.gaji = 'Gaji harus berupa angka positif';
    }

    if (!formData.tanggalMasuk) newErrors.tanggalMasuk = 'Tanggal masuk wajib diisi';
    if (!formData.alamat.trim()) newErrors.alamat = 'Alamat wajib diisi';
    if (!formData.kota.trim()) newErrors.kota = 'Kota wajib diisi';
    if (!formData.provinsi.trim()) newErrors.provinsi = 'Provinsi wajib diisi';
    if (!formData.kodePos.trim()) newErrors.kodePos = 'Kode pos wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSave({
        ...formData,
        gaji: parseInt(formData.gaji)
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className={`${theme.card} rounded-xl max-w-4xl w-full my-8 shadow-2xl`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 ${theme.border} border-b`}>
          <h2 className={`${theme.text} text-2xl font-bold`}>
            {employee ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
          </h2>
          <button
            onClick={onCancel}
            className={`${theme.hover} p-2 rounded-lg transition-all duration-200`}
          >
            <X className={`w-6 h-6 ${theme.text}`} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Depan */}
            <div>
              <label className={`block ${theme.text} font-medium mb-2`}>
                Nama Depan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="namaDepan"
                value={formData.namaDepan}
                onChange={handleChange}
                className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.namaDepan ? 'border-red-500' : ''
                }`}
                placeholder="Budi"
              />
              {errors.namaDepan && (
                <p className="text-red-500 text-sm mt-1">{errors.namaDepan}</p>
              )}
            </div>

            {/* Nama Belakang */}
            <div>
              <label className={`block ${theme.text} font-medium mb-2`}>
                Nama Belakang <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="namaBelakang"
                value={formData.namaBelakang}
                onChange={handleChange}
                className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.namaBelakang ? 'border-red-500' : ''
                }`}
                placeholder="Santoso"
              />
              {errors.namaBelakang && (
                <p className="text-red-500 text-sm mt-1">{errors.namaBelakang}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={`block ${theme.text} font-medium mb-2`}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : ''
                }`}
                placeholder="budi.santoso@perusahaan.co.id"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Telepon */}
            <div>
              <label className={`block ${theme.text} font-medium mb-2`}>
                Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.telepon ? 'border-red-500' : ''
                }`}
                placeholder="081234567890"
              />
              {errors.telepon && (
                <p className="text-red-500 text-sm mt-1">{errors.telepon}</p>
              )}
            </div>

            {/* Departemen */}
            <div>
              <label className={`block ${theme.text} font-medium mb-2`}>
                Departemen <span className="text-red-500">*</span>
              </label>
              <select
                name="departemen"
                value={formData.departemen}
                onChange={handleChange}
                className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.departemen ? 'border-red-500' : ''
                }`}
              >
                <option value="">Pilih Departemen</option>
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
              {errors.departemen && (
                <p className="text-red-500 text-sm mt-1">{errors.departemen}</p>
              )}
            </div>

            {/* Jabatan */}
            <div>
              <label className={`block ${theme.text} font-medium mb-2`}>
                Jabatan <span className="text-red-500">*</span>
              </label>
              <select
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                disabled={!formData.departemen}
                className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 ${
                  errors.jabatan ? 'border-red-500' : ''
                }`}
              >
                <option value="">Pilih Jabatan</option>
                {formData.departemen && jabatanByDept[formData.departemen]?.map(jabatan => (
                  <option key={jabatan} value={jabatan}>{jabatan}</option>
                ))}
              </select>
              {errors.jabatan && (
                <p className="text-red-500 text-sm mt-1">{errors.jabatan}</p>
              )}
            </div>

            {/* Gaji */}
            <div>
              <label className={`block ${theme.text} font-medium mb-2`}>
                Gaji (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="gaji"
                value={formData.gaji}
                onChange={handleChange}
                className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.gaji ? 'border-red-500' : ''
                }`}
                placeholder="5000000"
              />
              {errors.gaji && (
                <p className="text-red-500 text-sm mt-1">{errors.gaji}</p>
              )}
            </div>

            {/* Tanggal Masuk */}
            <div>
              <label className={`block ${theme.text} font-medium mb-2`}>
                Tanggal Masuk <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggalMasuk"
                value={formData.tanggalMasuk}
                onChange={handleChange}
                className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.tanggalMasuk ? 'border-red-500' : ''
                }`}
              />
              {errors.tanggalMasuk && (
                <p className="text-red-500 text-sm mt-1">{errors.tanggalMasuk}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className={`block ${theme.text} font-medium mb-2`}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="Aktif">Aktif</option>
                <option value="Cuti">Cuti</option>
                <option value="Resign">Resign</option>
              </select>
            </div>

            {/* Alamat */}
            <div className="md:col-span-2">
              <label className={`block ${theme.text} font-medium mb-2`}>
                Alamat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.alamat ? 'border-red-500' : ''
                }`}
                placeholder="Jl. Sudirman No. 123"
              />
              {errors.alamat && (
                <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>
              )}
            </div>

            {/* Kota */}
            <div>
              <label className={`block ${theme.text} font-medium mb-2`}>
                Kota <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="kota"
                value={formData.kota}
                onChange={handleChange}
                className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.kota ? 'border-red-500' : ''
                }`}
                placeholder="Jakarta"
              />
              {errors.kota && (
                <p className="text-red-500 text-sm mt-1">{errors.kota}</p>
              )}
            </div>

            {/* Provinsi */}
            <div>
              <label className={`block ${theme.text} font-medium mb-2`}>
                Provinsi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="provinsi"
                value={formData.provinsi}
                onChange={handleChange}
                className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.provinsi ? 'border-red-500' : ''
                }`}
                placeholder="DKI Jakarta"
              />
              {errors.provinsi && (
                <p className="text-red-500 text-sm mt-1">{errors.provinsi}</p>
              )}
            </div>

            {/* Kode Pos */}
            <div>
              <label className={`block ${theme.text} font-medium mb-2`}>
                Kode Pos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="kodePos"
                value={formData.kodePos}
                onChange={handleChange}
                className={`${theme.input} ${theme.border} border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.kodePos ? 'border-red-500' : ''
                }`}
                placeholder="12345"
              />
              {errors.kodePos && (
                <p className="text-red-500 text-sm mt-1">{errors.kodePos}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 ${theme.card} ${theme.border} border ${theme.text} px-6 py-3 rounded-lg font-medium ${theme.hover} transition-all duration-200`}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`flex-1 ${theme.button} text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200`}
            >
              <Save className="w-5 h-5" />
              {employee ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;