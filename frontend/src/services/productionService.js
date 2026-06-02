import api from './api';

const productionService = {
  // [HttpGet]
  getAllProduction: async () => {
    const response = await api.get('/Production');
    return response.data?.Data || response.data?.data || [];
  },

  // [HttpPost]
  addProductionEntry: async (data) => {
    const response = await api.post('/Production', data);
    return response.data;
  },

  // [HttpPatch("UpdateProductionEntry")]
  updateProduction: async (data) => {
    const response = await api.patch('/Production/UpdateProductionEntry', data);
    return response.data;
  },

  // [HttpDelete("ByJobId")]
  deleteProduction: async (jobId) => {
    let response;
    try {
      response = await api.delete(`/Production/ByJobId`, { params: { jobId } });
      return response.data;
    } catch(err) {
      if(err.response?.status === 405) { 
        // Fallback for Method Not Allowed if route is different
        response = await api.delete(`/Production/ByJobId?jobId=${jobId}`);
        return response.data;
      }
      throw err;
    }
  },

  // ===== NEW ADVANCED ANALYTICS =====
  getOperatorPerformance: async () => {
    const response = await api.get('/Production/operator-performance');
    if (response.status === 204 || !response.data) return [];
    return response.data?.Data || response.data?.data || [];
  },

  getOperatorRanking: async () => {
    const response = await api.get('/Production/operator-ranking');
    return response.data?.Data || response.data?.data || [];
  },

  getTopMachine: async () => {
    const response = await api.get('/Production/top-machine');
    if (response.status === 204 || !response.data) return [];
    return response.data?.Data || response.data?.data || [];
  },

  getDailyReport: async (date) => {
    const response = await api.get(`/Production/daily-report?date=${date}`);
    return response.data?.Data || response.data?.data || [];
  },

  getStatsByMachineAndDate: async (machineCode, fromDate, toDate) => {
    const response = await api.get(`/Production/TotalOkNcCountFromMachineFromTodate`, {
      params: { machineCode, from: fromDate, to: toDate }
    });
    return response.data?.Data || response.data?.data || null;
  },

  getStatsByMachineUserCycle: async (payload) => {
    // payload: { machineCode, employeeId, from, to }
    const response = await api.post('/Production/Production-by-Machine-User-PerCycle', payload);
    return response.data?.Data || response.data?.data || null;
  },

  getProductionByShift: async (shiftName) => {
    const response = await api.get(`/Production/Shift/${shiftName}`);
    return response.data?.Data || response.data?.data || [];
  },

  getProductionById: async (id) => {
    const response = await api.get(`/Production/GetByProductId/${id}`);
    return response.data?.Data || response.data?.data || null;
  },

  // Data endpoints for Dashboard
  getShiftSummary: async () => {
    const response = await api.get('/Production/ShiftSummary');
    return response.data?.data || response.data?.Data || [];
  },
  
  getRoleSummary: async () => {
    const response = await api.get('/Production/RoleSummary');
    return response.data?.Data || response.data?.data || [];
  },

  getMachineUsers: async (machineCode) => {
    const response = await api.post('/Production/MachineUser', { machineCode, employeeId: '' });
    // This API returns explicitly a Data array from the controller
    return response.data?.Data || response.data?.data || [];
  },

  getMachineSummary: async () => {
    const response = await api.get('/Production/machine-summary');
    if (response.status === 204 || !response.data) return [];
    return response.data?.data || response.data?.Data || [];
  },

  getTotalOkCount: async () => {
    const response = await api.get('/Production/TotalOKCount');
    return response.data?.totalOkCount || response.data?.TotalOkCount || 0;
  },

  getTotalNcCount: async () => {
    const response = await api.get('/Production/TotalNcCount');
    // The backend endpoint specifically writes 'TotalOkCount' instead of NcCount due to a typo in C#
    return response.data?.totalOkCount || response.data?.TotalOkCount || response.data?.totalNcCount || 0;
  }
};

export default productionService;
