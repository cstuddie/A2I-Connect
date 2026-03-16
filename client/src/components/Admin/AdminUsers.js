import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Base.css';

// Reusing AdminHeader component
function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminID');
    navigate('/admin/login');
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#0B3444',
        color: 'white',
        position: 'sticky',
        top: '0',
        zIndex: '100',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <a href="/admin/dashboard" style={{ textDecoration: 'none', color: 'white' }}>
          <h1>A2I Connect Admin</h1>
        </a>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <a href="/admin/dashboard" style={{ textDecoration: 'none', color: 'white' }}>
          <h4>Dashboard</h4>
        </a>
        <a href="/admin/users" style={{ textDecoration: 'none', color: 'white' }}>
          <h4>Users</h4>
        </a>
        <a href="/admin/events" style={{ textDecoration: 'none', color: 'white' }}>
          <h4>Events</h4>
        </a>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    affiliation: ''
  });
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [banTarget, setBanTarget] = useState(null);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const usersResponse = await fetch('http://localhost:3001/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserFormData({
      email: user.Email,
      firstName: user.FirstName,
      lastName: user.LastName,
      affiliation: user.Affiliation || ''
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const adminToken = localStorage.getItem('adminToken');

      const response = await fetch(`http://localhost:3001/users/${editingUser.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          FirstName: userFormData.firstName,
          LastName: userFormData.lastName,
          Affiliation: userFormData.affiliation
        }),
      });

      if (response.ok) {
        setUsers(users.map(user => {
          if (user.ID === editingUser.ID) {
            return {
              ...user,
              FirstName: userFormData.firstName,
              LastName: userFormData.lastName,
              Affiliation: userFormData.affiliation
            };
          }
          return user;
        }));

        setEditingUser(null);
        alert('User updated successfully');
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  const handleDeleteUser = async (userID) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const adminToken = localStorage.getItem('adminToken');

        const response = await fetch(`http://localhost:3001/admin/users/${userID}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });

        if (response.ok) {
          setUsers(users.filter(user => user.ID !== userID));
          alert('User deleted successfully');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const handleBanUser = async () => {
    if (!banTarget) return;
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3001/admin/users/${banTarget.ID}/ban`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      if (response.ok) {
        setUsers(users.filter(u => u.ID !== banTarget.ID));
        setBanTarget(null);
        alert('User banned successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to ban user');
      }
    } catch (error) {
      console.error('Error banning user:', error);
      alert('Error banning user');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (newUserData.password !== newUserData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: newUserData.firstName,
          lastName: newUserData.lastName,
          email: newUserData.email,
          password: newUserData.password,
          role: 1
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Re-fetch users to get the new user with correct data
        const userResponse = await fetch('http://localhost:3001/users');
        const usersData = await userResponse.json();
        setUsers(usersData);

        // Reset form and hide it
        setNewUserData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: ''
        });
        setShowAddUserForm(false);
        alert('User created successfully');
      } else {
        alert(result.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    const fullName = `${user.FirstName} ${user.LastName}`.toLowerCase();
    return (
      (user.Email || '').toLowerCase().includes(searchTermLower) ||
      fullName.includes(searchTermLower) ||
      (user.Affiliation || '').toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return (
      <div>
        <AdminHeader />
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Loading users...</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader />

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>User Management</h1>
          <button
            className="cta-button"
            onClick={() => setShowAddUserForm(!showAddUserForm)}
            style={{ padding: '10px 15px' }}
          >
            {showAddUserForm ? 'Cancel' : 'Add New User'}
          </button>
        </div>

        {/* Add User Form */}
        {showAddUserForm && (
          <div className="form-container" style={{ marginBottom: '30px' }}>
            <h2>Add New User</h2>
            <form onSubmit={handleAddUser}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={newUserData.firstName}
                    onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={newUserData.lastName}
                    onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={newUserData.password}
                onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                required
              />

              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={newUserData.confirmPassword}
                onChange={(e) => setNewUserData({...newUserData, confirmPassword: e.target.value})}
                required
              />

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddUserForm(false)}
                  style={{ marginRight: '10px', backgroundColor: '#f0f0f0', color: '#333' }}
                >
                  Cancel
                </button>
                <button type="submit">Create User</button>
              </div>
            </form>
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '500px', maxWidth: '90%' }}>
              <h2>Edit User</h2>
              <form onSubmit={handleUpdateUser}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userFormData.email}
                  required
                  disabled
                />

                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userFormData.firstName}
                  onChange={(e) => setUserFormData({...userFormData, firstName: e.target.value})}
                  required
                />

                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userFormData.lastName}
                  onChange={(e) => setUserFormData({...userFormData, lastName: e.target.value})}
                  required
                />

                <label htmlFor="affiliation">Affiliation</label>
                <input
                  type="text"
                  id="affiliation"
                  name="affiliation"
                  value={userFormData.affiliation}
                  onChange={(e) => setUserFormData({...userFormData, affiliation: e.target.value})}
                />

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    style={{ marginRight: '10px', backgroundColor: '#f0f0f0', color: '#333' }}
                  >
                    Cancel
                  </button>
                  <button type="submit">Update User</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Ban Confirmation Modal */}
        {banTarget && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '450px', maxWidth: '90%', textAlign: 'center' }}>
              <h2 style={{ marginBottom: '15px' }}>Ban User</h2>
              <p>Are you sure you want to ban <strong>{banTarget.FirstName} {banTarget.LastName}</strong> ({banTarget.Email})?</p>
              <p style={{ color: '#d9534f', fontSize: '14px', marginTop: '10px' }}>This will delete their account and prevent them from re-registering.</p>
              <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button
                  onClick={() => setBanTarget(null)}
                  style={{ padding: '10px 20px', width: 'auto', backgroundColor: '#f0f0f0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBanUser}
                  style={{ padding: '10px 20px', width: 'auto', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                >
                  Confirm Ban
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and User List */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search users by name, email, affiliation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#0B3444', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Affiliation</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Created</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.ID} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{user.ID}</td>
                  <td style={{ padding: '12px' }}>{user.FirstName} {user.LastName}</td>
                  <td style={{ padding: '12px' }}>{user.Email}</td>
                  <td style={{ padding: '12px' }}>{user.Role === 2 ? 'Expert' : 'User'}</td>
                  <td style={{ padding: '12px' }}>{user.Affiliation || 'Not specified'}</td>
                  <td style={{ padding: '12px' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <button
                      className="cta-button"
                      onClick={() => handleEditUser(user)}
                      style={{ padding: '5px 10px', fontSize: '14px', marginRight: '5px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="cta-button"
                      onClick={() => handleDeleteUser(user.ID)}
                      style={{ padding: '5px 10px', fontSize: '14px', backgroundColor: '#d9534f' }}
                    >
                      Delete
                    </button>
                    <button
                      className="cta-button"
                      onClick={() => setBanTarget(user)}
                      style={{ padding: '5px 10px', fontSize: '14px', backgroundColor: '#c9302c', marginLeft: '5px' }}
                    >
                      Ban
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>
                  No users found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
