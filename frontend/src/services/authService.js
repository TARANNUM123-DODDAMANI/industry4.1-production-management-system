import api from './api';

const authService = {
  login: async (employeeId, password) => {
    // According to backend UserController: [HttpPost("Login")] requires body { employeeId, password }
    const response = await api.post('/User/Login', { employeeId, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({ employeeId: response.data.employeeId, role: response.data.role }));
    }
    return response.data;
  },

  register: async (data) => {
    const response = await api.post('/User/RegisterUser', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
};

export default authService;
