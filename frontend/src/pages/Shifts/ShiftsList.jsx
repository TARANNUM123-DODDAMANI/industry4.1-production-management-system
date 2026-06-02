import React, { useEffect, useState } from 'react';
import shiftService from '../../services/shiftService';
import { Plus, Trash2, Edit, X, Clock } from 'lucide-react';

const ShiftsList = () => {
  const [shifts, setShifts] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: 0, shiftName: '', startTime: '', endTime: '' });

  useEffect(() => { loadShifts(); }, []);

  const loadShifts = async () => {
    try {
      setLoading(true);
      const data = await shiftService.getAllShifts();
      setShifts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSchedule = async () => {
    try {
      const data = await shiftService.getShiftWithSchedule();
      setSchedule(Array.isArray(data) ? data : []);
      setShowSchedule(true);
    } catch (err) {
      alert('Could not load schedule view');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this shift?')) return;
    try {
      await shiftService.deleteShift(id);
      loadShifts();
    } catch (err) {
      alert('Error deleting shift');
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData({ id: 0, shiftName: '', startTime: '', endTime: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (s) => {
    setIsEditMode(true);
    setFormData({ id: s.id, shiftName: s.shiftName, startTime: s.startTime, endTime: s.endTime });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fmt = (t) => t.length === 5 ? `${t}:00` : t;
    try {
      if (isEditMode) {
        await shiftService.updateShift(formData.id, fmt(formData.startTime));
      } else {
        await shiftService.addShift({ shiftName: formData.shiftName, startTime: fmt(formData.startTime), endTime: fmt(formData.endTime) });
      }
      setShowModal(false);
      loadShifts();
    } catch (err) {
      alert('Error saving shift');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1>Shifts</h1>
          <p>Manage working shifts schedule</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary" onClick={loadSchedule}>
            <Clock size={16} /> Schedule View
          </button>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} /> Add Shift
          </button>
        </div>
      </div>

      {/* Schedule View */}
      {showSchedule && (
        <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <h3 style={{ margin: 0 }}>Shift Schedule Timeline</h3>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowSchedule(false)}><X size={18} /></button>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {schedule.map((s, i) => (
              <div key={i} style={{
                flex: '1', minWidth: '180px',
                background: `hsl(${i * 60}, 70%, 95%)`,
                border: `2px solid hsl(${i * 60}, 60%, 75%)`,
                borderRadius: '12px',
                padding: 'var(--space-3)',
                textAlign: 'center'
              }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{s.shiftName || s.ShiftName}</div>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                  {s.startTime || s.StartTime} → {s.endTime || s.EndTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: 'var(--space-6)' }}>Loading shifts...</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Shift Name</th><th>Start Time</th><th>End Time</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {shifts.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td><strong>{s.shiftName}</strong></td>
                  <td>{s.startTime}</td>
                  <td>{s.endTime}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="btn btn-secondary" onClick={() => handleOpenEdit(s)}><Edit size={16} /> Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(s.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {shifts.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>No shifts found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ margin: 0 }}>{isEditMode ? 'Edit Start Time' : 'Add Shift'}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Shift Name</label>
                <input type="text" className="form-control" required value={formData.shiftName} onChange={e => setFormData({ ...formData, shiftName: e.target.value })} disabled={isEditMode} />
              </div>
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input type="time" className="form-control" required value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} step="1" />
              </div>
              {!isEditMode && (
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input type="time" className="form-control" required value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} step="1" />
                </div>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }}>Save Shift</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftsList;
