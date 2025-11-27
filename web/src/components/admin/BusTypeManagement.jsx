import { useState, useEffect } from "react";
import { busTypeAPI } from "../../api/axios";

const BusTypeManagement = () => {
  const [busTypes, setBusTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    description: ""
  });

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      const res = await busTypeAPI.getAll();
      setBusTypes(res.data);
    } catch (err) {
      console.error("Failed to load types", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingType) {
        await busTypeAPI.update(editingType.id, {
          name: formData.name,
          capacity: parseInt(formData.capacity),
          description: formData.description
        });
      } else {
        await busTypeAPI.create({
          name: formData.name,
          capacity: parseInt(formData.capacity),
          description: formData.description
        });
      }

      setFormData({ name: "", capacity: "", description: "" });
      setShowForm(false);
      setEditingType(null);
      loadTypes();
    } catch (err) {
      alert(`Failed to ${editingType ? 'update' : 'create'} bus type.`);
    }
  };

  const handleEdit = (type) => {
    setFormData({
      name: type.name,
      capacity: type.capacity.toString(),
      description: type.description
    });
    setEditingType(type);
    setShowForm(true);
  };

  const handleDelete = async (typeId) => {
    if (window.confirm('Are you sure you want to delete this bus type?')) {
      try {
        await busTypeAPI.delete(typeId);
        loadTypes();
      } catch (error) {
        alert('Failed to delete bus type');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", capacity: "", description: "" });
    setShowForm(false);
    setEditingType(null);
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Bus Type Management</h2>
        <button className="btn-primary" onClick={() => {
          if (showForm) {
            handleCancel();
          } else {
            setShowForm(true);
          }
        }}>
          {showForm ? "Cancel" : "Add Bus Type"}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingType ? 'Edit Bus Type' : 'Add Bus Type'}</h3>

          <input
            type="text"
            placeholder="Type Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-primary" type="submit">
              {editingType ? 'Update Bus Type' : 'Save Bus Type'}
            </button>
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Capacity</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {busTypes.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td>{t.capacity}</td>
                <td>{t.description}</td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      className="btn-secondary btn-small"
                      onClick={() => handleEdit(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger btn-small"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusTypeManagement;
