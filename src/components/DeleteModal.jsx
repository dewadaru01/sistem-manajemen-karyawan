import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({ employee, onConfirm, onCancel, theme }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${theme.card} rounded-xl max-w-md w-full p-6 shadow-2xl`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className={`${theme.text} text-xl font-bold mb-2`}>
              Hapus Karyawan?
            </h3>
            <p className={theme.subtext}>
              Apakah Anda yakin ingin menghapus karyawan{' '}
              <span className="font-semibold">
                {employee.namaDepan} {employee.namaBelakang}
              </span>
              ? Data yang sudah dihapus tidak dapat dikembalikan.
            </p>
          </div>
          <button
            onClick={onCancel}
            className={`${theme.hover} p-1 rounded`}
          >
            <X className={`w-5 h-5 ${theme.subtext}`} />
          </button>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className={`flex-1 ${theme.card} ${theme.border} border ${theme.text} px-4 py-2 rounded-lg font-medium ${theme.hover} transition-all duration-200`}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 ${theme.danger} text-white px-4 py-2 rounded-lg font-medium transition-all duration-200`}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;