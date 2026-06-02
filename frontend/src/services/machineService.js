import api from './api';

const machineService = {
  // [HttpGet("GetAllMachinesStatus")]
  getAllMachines: async () => {
    const response = await api.get('/Machine/GetAllMachinesStatus');
    return response.data?.data || response.data?.Data || [];
  },

  // [HttpGet("GetById/{id}")]
  getMachineById: async (id) => {
    const response = await api.get(`/Machine/GetById/${id}`);
    return response.data?.data || response.data?.Data || null;
  },

  // [HttpGet("GetCode")] - Returns machines with code + name
  getMachineCodes: async () => {
    const response = await api.get('/Machine/GetCode');
    return response.data?.data || response.data?.Data || [];
  },

  // [HttpGet("GetMName")] - Returns machine names
  getMachineNames: async () => {
    const response = await api.get('/Machine/GetMName');
    return response.data?.data || response.data?.Data || [];
  },

  // [HttpPost] (AddMachine)
  addMachine: async (data) => {
    const response = await api.post('/Machine', data);
    return response.data;
  },

  // [HttpPatch] (UpdateMachine)
  updateMachine: async (data) => {
    const response = await api.patch('/Machine', data);
    return response.data;
  },

  // [HttpDelete] (DeleteMachine)
  deleteMachine: async (id) => {
    const response = await api.delete(`/Machine?id=${id}`);
    return response.data;
  },

  // [HttpPost("Adduser")] - Assign an operator to a machine
  assignOperator: async (dto) => {
    const response = await api.post('/Machine/Adduser', dto);
    return response.data;
  },

  // [HttpPost("Login")] - Machine terminal login
  machineTerminalLogin: async (dto) => {
    const response = await api.post('/Machine/Login', dto);
    return response.data;
  }
};

export default machineService;
