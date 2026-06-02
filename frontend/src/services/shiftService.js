import api from './api';

const shiftService = {
  // [HttpGet("GetAllShift")]
  getAllShifts: async () => {
    const response = await api.get('/Shift/GetAllShift');
    return response.data?.Data || response.data?.data || [];
  },

  // [HttpGet("{id}")] - Get shift by ID
  getShiftById: async (id) => {
    const response = await api.get(`/Shift/${id}`);
    return response.data?.Data || response.data?.data || null;
  },

  // [HttpGet("ShiftWithSchedule")] - Full schedule with times
  getShiftWithSchedule: async () => {
    const response = await api.get('/Shift/ShiftWithSchedule');
    return response.data?.Data || response.data?.data || response.data || [];
  },

  // [HttpGet("GetShiftName")] - Just shift names (for dropdowns)
  getShiftNames: async () => {
    const response = await api.get('/Shift/GetShiftName');
    return response.data?.Data || response.data?.data || response.data || [];
  },

  // [HttpPost("AddShift")]
  addShift: async (data) => {
    const response = await api.post('/Shift/AddShift', data);
    return response.data;
  },

  // [HttpPatch] - Full shift update
  updateShiftFull: async (dto) => {
    const response = await api.patch('/Shift', dto);
    return response.data;
  },

  // [HttpPatch("UpdateShiftStartTime")] - Only update start time
  updateShift: async (id, startTime) => {
    const response = await api.patch('/Shift/UpdateShiftStartTime', { id, startTime });
    return response.data;
  },

  // [HttpDelete]
  deleteShift: async (id) => {
    const response = await api.delete(`/Shift?Id=${id}`);
    return response.data;
  }
};

export default shiftService;
