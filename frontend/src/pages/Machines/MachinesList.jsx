import React, { useEffect, useState } from 'react';
import machineService from '../../services/machineService';
import userService from '../../services/userService';
import { Plus, Trash2, Edit, X, Eye, UserPlus } from 'lucide-react';

const MachinesList = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: '', machineCode: '', machineName: '', isActive: true, employeesWorking: 0 });

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewMachine, setViewMachine] = useState(null);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignData, setAssignData] = useState({ machineCode: '', employeeId: '', password: '', role: 'Operator' });
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => { loadMachines(); }, []);

  const loadMachines = async () => {
    try {
      setLoading(true);
      const data = await machineService.getAllMachines();
      setMachines(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this machine?')) return;
    try {
      await machineService.deleteMachine(id);
      loadMachines();
    } catch (err) {
      alert('Error deleting machine');
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData({ id: '', machineCode: '', machineName: '', isActive: true, employeesWorking: 0 });
    setShowModal(true);
  };

  const handleOpenEdit = (m) => {
    setIsEditMode(true);
    setFormData({ ...m });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await machineService.updateMachine(formData);
      } else {
        await machineService.addMachine(formData);
      }
      setShowModal(false);
      loadMachines();
    } catch (err) {
      alert(isEditMode ? 'Error updating machine' : 'Error creating machine');
    }
  };

  const openView = async (id) => {
    try {
      const data = await machineService.getMachineById(id);
      setViewMachine(data);
      setShowViewModal(true);
    } catch (err) {
      alert('Could not load machine details');
    }
  };

  const openAssign = async (machineCode) => {
    try {
      const users = await userService.getAllUsers();
      setAvailableUsers(Array.isArray(users) ? users : []);
      setAssignData({ machineCode, employeeId: '', password: '', role: 'Operator' });
      setShowAssignModal(true);
    } catch {
      alert('Could not load users for assignment');
    }
  };

  const handleAssignOperator = async (e) => {
    e.preventDefault();
    try {
      await machineService.assignOperator(assignData);
      setShowAssignModal(false);
    } catch (err) {
      alert('Error assigning operator to machine');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1>Machines</h1>
          <p>Manage factory machines configuration</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}><Plus size={18} /> Add Machine</button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: 'var(--space-6)' }}>Loading machines...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th><th>Code</th><th>Name</th><th>Employees</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {machines.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td><strong>{m.machineCode}</strong></td>
                  <td>{m.machineName}</td>
                  <td>{m.employeesWorking}</td>
                  <td>
                    <span className={`badge ${m.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {m.isActive ? 'Active' : 'Offline'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <button className="btn btn-secondary" onClick={() => openView(m.id)} title="View Details">
                        <Eye size={14} />
                      </button>
                      <button className="btn btn-secondary" onClick={() => handleOpenEdit(m)}>
                        <Edit size={14} /> Edit
                      </button>
                      <button className="btn btn-secondary" onClick={() => openAssign(m.machineCode)} title="Assign Operator">
                        <UserPlus size={14} />
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(m.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {machines.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>No machines found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* View Machine Modal */}
      {showViewModal && viewMachine && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '380px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ margin: 0 }}>Machine Details</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowViewModal(false)}><X size={20} /></button>
            </div>
            <div style={{ background: 'var(--bg-main)', borderRadius: '8px', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(viewMachine).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'capitalize' }}>{key}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Machine Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ margin: 0 }}>{isEditMode ? 'Edit Machine' : 'Add Machine'}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Machine Code</label>
                <input type="text" className="form-control" required value={formData.machineCode} onChange={e => setFormData({ ...formData, machineCode: e.target.value })} disabled={isEditMode} />
              </div>
              <div className="form-group">
                <label className="form-label">Machine Name</label>
                <input type="text" className="form-control" required value={formData.machineName} onChange={e => setFormData({ ...formData, machineName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Capacity (Employees Working)</label>
                <input type="number" className="form-control" min="0" value={formData.employeesWorking} onChange={e => setFormData({ ...formData, employeesWorking: parseInt(e.target.value) || 0 })} />
              </div>
              {isEditMode && (
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <input type="checkbox" id="machineActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                  <label htmlFor="machineActive" className="form-label" style={{ marginBottom: 0 }}>Machine is Active</label>
                </div>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }}>Save Machine</button>
            </form>
          </div>
        </div>
      )}

      {/* Assign Operator Modal */}
      {showAssignModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ margin: 0 }}>Assign Operator to {assignData.machineCode}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowAssignModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAssignOperator}>
              <div className="form-group">
                <label className="form-label">Employee ID</label>
                <select className="form-control" value={assignData.employeeId} onChange={e => setAssignData({ ...assignData, employeeId: e.target.value })} required>
                  <option value="">Select Operator...</option>
                  {availableUsers.map(u => <option key={u.employeeId} value={u.employeeId}>{u.employeeId}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Password (for assignment verification)</label>
                <input type="password" className="form-control" required value={assignData.password} onChange={e => setAssignData({ ...assignData, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-control" value={assignData.role} onChange={e => setAssignData({ ...assignData, role: e.target.value })}>
                  <option>Operator</option><option>Manager</option><option>Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }}>Assign Operator</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachinesList;
