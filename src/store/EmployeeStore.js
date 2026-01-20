// src/store/EmployeeStore.js - Fixed for Actual API Response Structure
import { create } from "zustand";
import axios from "axios";
import { message } from "antd";

const BaseURL = "http://localhost:3000/api/v1";

const EmployeeStore = create((set, get) => ({
  // Dashboard Data
  dashboardData: null,
  loading: false,
  error: null,

  // Employee List Data
  employees: [],
  totalEmployees: 0,
  currentPage: 1,
  pageSize: 10,
  
  // Filters
  filters: {
    search: '',
    department: '',
    status: '',
    archived: false,
    sortBy: 'joiningDate',
    order: 'desc',
    dateRange: []
  },

  // Form Data
  EmployeeFormData: {
    employeeID: '',
    name: '',
    department: '',
    role: '',
    status: 'Active',
    joiningDate: '',
    performanceScore: 70,
    isArchived: false,
    image: null
  },

  // Form Methods
  EmployeeFormChange: (name, value) => {
    set((state) => ({
      EmployeeFormData: {
        ...state.EmployeeFormData,
        [name]: value,
      },
    }));
  },

  // File Change Method
  EmployeeFileChange: (file) => {
    set((state) => ({
      EmployeeFormData: {
        ...state.EmployeeFormData,
        image: file,
      },
    }));
  },

  // Reset Form
  resetEmployeeForm: () => {
    set({
      EmployeeFormData: {
        employeeID: '',
        name: '',
        department: '',
        role: '',
        status: 'Active',
        joiningDate: '',
        performanceScore: 70,
        isArchived: false,
        image: null
      }
    });
  },

  // ========== API METHODS ==========

  // Fetch Dashboard Data
  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("accesstoken");
      
      if (!token) {
        throw new Error("No access token found");
      }

      console.log('Fetching dashboard data...');
      
      const [summaryRes, recentRes, deptRes, topRes, perfRes] = await Promise.all([
        axios.get(`${BaseURL}/employees/dashboard/summary`, {
          headers: { accesstoken: token }
        }),
        axios.get(`${BaseURL}/employees/recent/list?limit=5`, {
          headers: { accesstoken: token }
        }),
        axios.get(`${BaseURL}/employees/dashboard/department-wise`, {
          headers: { accesstoken: token }
        }),
        axios.get(`${BaseURL}/employees/dashboard/top-performers`, {
          headers: { accesstoken: token }
        }),
        axios.get(`${BaseURL}/employees/performance/stats`, {
          headers: { accesstoken: token }
        })
      ]);

      console.log('Raw API Responses:', {
        summaryRes: summaryRes.data,
        recentRes: recentRes.data,
        deptRes: deptRes.data,
        topRes: topRes.data,
        perfRes: perfRes.data
      });

      // Extract data based on actual response structure
      // Check the raw response to see what fields are available
      const extractEmployees = (responseData) => {
        console.log('Extracting employees from:', responseData);
        // Try different possible response structures
        if (Array.isArray(responseData.employees)) {
          return responseData.employees;
        }
        if (Array.isArray(responseData.data)) {
          return responseData.data;
        }
        if (Array.isArray(responseData.results)) {
          return responseData.results;
        }
        return [];
      };

      const extractStats = (responseData) => {
        console.log('Extracting stats from:', responseData);
        if (responseData.data && typeof responseData.data === 'object' && !Array.isArray(responseData.data)) {
          return responseData.data;
        }
        if (responseData.stats) {
          return responseData.stats;
        }
        // If the response itself is the stats object
        if (responseData.totalEmployees !== undefined) {
          return responseData;
        }
        return {};
      };

      const dashboardData = {
        summary: extractStats(summaryRes.data),
        recentEmployees: extractEmployees(recentRes.data),
        departmentStats: extractEmployees(deptRes.data),
        topPerformers: extractEmployees(topRes.data),
        performanceStats: extractStats(perfRes.data)
      };

      console.log('Processed Dashboard Data:', dashboardData);

      set({
        dashboardData,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load dashboard data';
      set({ 
        error: errorMsg,
        loading: false,
        dashboardData: null
      });
      message.error(errorMsg);
    }
  },

  // Fetch Employees with Filters
  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("accesstoken");
      
      if (!token) {
        throw new Error("No access token found");
      }

      const { filters, currentPage, pageSize } = get();
      
      const params = {
        page: currentPage,
        limit: pageSize,
        ...filters,
        archived: filters.archived ? 'true' : 'false'
      };

      // Remove undefined or empty values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined || params[key] === null) {
          delete params[key];
        }
      });

      // Add search if exists
      if (filters.search) {
        params.search = filters.search;
      }

      // Add date range if exists
      if (filters.dateRange && filters.dateRange.length === 2) {
        params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
        params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
      }

      console.log('Fetching employees with params:', params);

      const response = await axios.get(`${BaseURL}/employees`, {
        headers: { accesstoken: token },
        params
      });

      console.log('Employees response:', response.data);

      // Handle different response structures
      const employeesData = response.data?.employees || response.data?.data || [];
      const total = response.data?.total || response.data?.count || employeesData.length;

      set({
        employees: employeesData,
        totalEmployees: total,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Employees fetch error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load employees';
      set({ 
        error: errorMsg,
        loading: false 
      });
      message.error(errorMsg);
    }
  },

  // Create Employee
  createEmployee: async (formData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("accesstoken");
      
      if (!token) {
        throw new Error("No access token found");
      }

      // Create FormData for file upload
      const formDataObj = new FormData();
      
      // Append all fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key] instanceof File) {
          formDataObj.append(key, formData[key]);
        } else if (key === 'joiningDate' && formData[key]) {
          // Handle dayjs object or date string
          const date = formData[key].$d ? formData[key].$d : new Date(formData[key]);
          formDataObj.append(key, date.toISOString().split('T')[0]);
        } else if (key === 'performanceScore') {
          formDataObj.append(key, Number(formData[key]));
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataObj.append(key, formData[key]);
        }
      });

      console.log('Creating employee with formData');

      const response = await axios.post(
        `${BaseURL}/employees/create`,
        formDataObj,
        {
          headers: { 
            accesstoken: token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        message.success('Employee created successfully!');
        // Refresh the employee list
        await get().fetchEmployees();
        // Reset form
        get().resetEmployeeForm();
        set({ loading: false });
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Create employee error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to create employee';
      set({ 
        error: errorMsg,
        loading: false 
      });
      message.error(errorMsg);
      return false;
    }
  },

  // Update Employee - FIXED VERSION
  updateEmployee: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("accesstoken");
      
      if (!token) {
        throw new Error("No access token found");
      }

      // Check if there's a new image file to upload
      const hasNewImage = formData.image instanceof File;
      
      let response;
      
      if (hasNewImage) {
        // If uploading new image, use FormData
        const formDataObj = new FormData();
        
        Object.keys(formData).forEach(key => {
          if (key === 'image' && formData[key] instanceof File) {
            formDataObj.append(key, formData[key]);
          } else if (key === 'joiningDate' && formData[key]) {
            // Handle dayjs object or date string
            const date = formData[key].$d ? formData[key].$d : new Date(formData[key]);
            formDataObj.append(key, date.toISOString().split('T')[0]);
          } else if (key === 'performanceScore') {
            // Ensure performanceScore is a number
            formDataObj.append(key, Number(formData[key]));
          } else if (formData[key] !== null && formData[key] !== undefined) {
            formDataObj.append(key, formData[key]);
          }
        });

        console.log('Updating employee with new image (FormData)');

        response = await axios.put(
          `${BaseURL}/employees/update/${id}`,
          formDataObj,
          {
            headers: { 
              accesstoken: token,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // If no new image, send JSON
        const jsonData = {
          employeeID: formData.employeeID,
          name: formData.name,
          department: formData.department,
          role: formData.role,
          status: formData.status,
          performanceScore: Number(formData.performanceScore),
          isArchived: formData.isArchived
        };

        // Handle joining date
        if (formData.joiningDate) {
          const date = formData.joiningDate.$d ? formData.joiningDate.$d : new Date(formData.joiningDate);
          jsonData.joiningDate = date.toISOString().split('T')[0];
        }

        // Keep existing image URL if provided
        if (formData.image && typeof formData.image === 'string') {
          jsonData.image = formData.image;
        }

        console.log('Updating employee without new image (JSON):', jsonData);

        response = await axios.put(
          `${BaseURL}/employees/update/${id}`,
          jsonData,
          {
            headers: { 
              accesstoken: token,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      console.log('Update response:', response.data);

      if (response.data.success) {
        message.success('Employee updated successfully!');
        // Refresh the employee list
        await get().fetchEmployees();
        set({ loading: false });
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to update employee');
      }
    } catch (error) {
      console.error('Update employee error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update employee';
      set({ 
        error: errorMsg,
        loading: false 
      });
      message.error(errorMsg);
      return false;
    }
  },

  // Archive Employee (Soft Delete)
  archiveEmployee: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("accesstoken");
      
      if (!token) {
        throw new Error("No access token found");
      }

      console.log('Archiving employee:', id);
      
      const response = await axios.patch(
        `${BaseURL}/employees/${id}/archive`,
        {},
        { headers: { accesstoken: token } }
      );

      if (response.data.success) {
        message.success('Employee status updated successfully!');
        // Refresh the employee list
        await get().fetchEmployees();
        set({ loading: false });
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to update employee status');
      }
    } catch (error) {
      console.error('Archive employee error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update employee status';
      set({ 
        error: errorMsg,
        loading: false 
      });
      message.error(errorMsg);
      return false;
    }
  },

  // Delete Employee (Permanent)
  deleteEmployee: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("accesstoken");
      
      if (!token) {
        throw new Error("No access token found");
      }

      console.log('Deleting employee:', id);
      
      const response = await axios.delete(
        `${BaseURL}/employees/${id}`,
        { headers: { accesstoken: token } }
      );

      if (response.data.success) {
        message.success('Employee deleted successfully!');
        // Refresh the employee list
        await get().fetchEmployees();
        set({ loading: false });
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Delete employee error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete employee';
      set({ 
        error: errorMsg,
        loading: false 
      });
      message.error(errorMsg);
      return false;
    }
  },

  // Filter Methods
  searchEmployees: (searchTerm) => {
    const { filters } = get();
    set({
      filters: { ...filters, search: searchTerm },
      currentPage: 1
    });
    // Trigger fetch after state update
    setTimeout(() => {
      get().fetchEmployees();
    }, 0);
  },

  updateFilter: (field, value) => {
    const { filters } = get();
    set({
      filters: { ...filters, [field]: value },
      currentPage: 1
    });
    setTimeout(() => {
      get().fetchEmployees();
    }, 0);
  },

  updatePagination: (page, pageSize) => {
    set({
      currentPage: page,
      pageSize: pageSize
    });
    get().fetchEmployees();
  },

  clearFilters: () => {
    set({
      filters: {
        search: '',
        department: '',
        status: '',
        archived: false,
        sortBy: 'joiningDate',
        order: 'desc',
        dateRange: []
      },
      currentPage: 1
    });
    get().fetchEmployees();
  },

  // Debounced Search
  debouncedSearch: null,
  searchWithDebounce: (searchTerm) => {
    const store = get();
    
    if (store.debouncedSearch) {
      clearTimeout(store.debouncedSearch);
    }

    const timeout = setTimeout(() => {
      store.searchEmployees(searchTerm);
    }, 500);

    set({ debouncedSearch: timeout });
  }
}));

export default EmployeeStore;