import api from './api';

const userService = {
  // [HttpGet("GetAllUsersStatus")]
  getAllUsers: async () => {
    const response = await api.get('/User/GetAllUsersStatus');
    return response.data?.Data || response.data?.data || [];
  },

  // [HttpGet] - All users basic
  getAllUsersFull: async () => {
    const response = await api.get('/User');
    return response.data?.Data || response.data?.data || [];
  },

  // [HttpGet("GetById{employeeId}")]
  getUserById: async (employeeId) => {
    const response = await api.get(`/User/GetById${employeeId}`);
    return response.data?.Data || response.data?.data || null;
  },

  // [HttpGet("active")]
  getActiveUsers: async () => {
    const response = await api.get('/User/active');
    return response.data?.Data || response.data?.data || [];
  },

  // [HttpGet("GetUserByRole")]
  getUsersByRole: async (role) => {
    const response = await api.get(`/User/GetUserByRole?role=${role}`);
    return response.data?.Data || response.data?.data || [];
  },

  // [HttpPatch("UpdateUser")]
  updateUser: async (id, data) => {
    const response = await api.patch('/User/UpdateUser', { id, ...data });
    return response.data;
  },

  // [HttpPatch("ResetPassward")] - DTO: { EmployeeId, oldPassward, newPassward }
  resetPassword: async (employeeId, oldPassward, newPassward) => {
    const response = await api.patch('/User/ResetPassward', { EmployeeId: employeeId, oldPassward, newPassward });
    return response.data;
  },

  // [HttpPatch("ForgetPassward")] - DTO: { EmployeeId, key, newPassward }
  forgotPassword: async (employeeId, key, newPassward) => {
    const response = await api.patch('/User/ForgetPassward', { EmployeeId: employeeId, key, newPassward });
    return response.data;
  },

  // [HttpDelete("DeleteUser")]
  deleteUser: async (employeeId) => {
    const response = await api.delete(`/User/DeleteUser?employeeId=${employeeId}`);
    return response.data;
  }
};

export default userService;
