import { useState, useEffect, useCallback } from 'react';
import googleSheetsService from '../services/googleSheetsService';

export const useGoogleSheets = (isSignedIn) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load employees
  const loadEmployees = useCallback(async () => {
    if (!isSignedIn) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await googleSheetsService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError('Gagal memuat data karyawan: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  // Add employee
  const addEmployee = async (employeeData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Generate ID
      const newId = `EMP${String(employees.length + 1).padStart(4, '0')}`;
      const newEmployee = { ...employeeData, id: newId };
      
      await googleSheetsService.addEmployee(newEmployee);
      await loadEmployees(); // Reload data
      
      return newEmployee;
    } catch (err) {
      setError('Gagal menambah karyawan: ' + err.message);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update employee
  const updateEmployee = async (id, employeeData) => {
    setLoading(true);
    setError(null);
    
    try {
      await googleSheetsService.updateEmployee(id, employeeData);
      await loadEmployees(); // Reload data
    } catch (err) {
      setError('Gagal mengupdate karyawan: ' + err.message);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete employee
  const deleteEmployee = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await googleSheetsService.deleteEmployee(id);
      await loadEmployees(); // Reload data
    } catch (err) {
      setError('Gagal menghapus karyawan: ' + err.message);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generate dummy data
  const generateDummyData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await googleSheetsService.generateDummyData();
      await loadEmployees(); // Reload data
    } catch (err) {
      setError('Gagal generate dummy data: ' + err.message);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load on mount and when signed in
  useEffect(() => {
    if (isSignedIn) {
      loadEmployees();
    }
  }, [isSignedIn, loadEmployees]);

  return {
    employees,
    loading,
    error,
    loadEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    generateDummyData
  };
};