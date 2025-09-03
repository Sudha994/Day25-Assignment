import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch users. Please try again.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>User Management Dashboard</h1>
        <p>Manage your users efficiently</p>
      </header>

      <div className="dashboard-content">
        <div className="users-panel">
          <div className="panel-header">
            <h2>All Users ({users.length})</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="users-list">
            {filteredUsers.length === 0 ? (
              <div className="no-results">
                <p>No users found matching your search.</p>
              </div>
            ) : (
              filteredUsers.map(user => (
                <div 
                  key={user.id} 
                  className={`user-card ${selectedUser?.id === user.id ? 'active' : ''}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="user-avatar">
                    {user.name.charAt(0)}
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">{user.name}</h3>
                    <p className="user-email">{user.email}</p>
                    <p className="user-company">{user.company.name}</p>
                  </div>
                  <div className="user-action">
                    <span className="view-icon">→</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`user-details-panel ${selectedUser ? 'active' : ''}`}>
          {selectedUser ? (
            <div className="user-details">
              <div className="details-header">
                <h2>User Details</h2>
                <button onClick={handleCloseDetails} className="close-btn">×</button>
              </div>

              <div className="details-content">
                <div className="user-profile">
                  <div className="profile-avatar">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <h2 className="profile-name">{selectedUser.name}</h2>
                  <p className="profile-username">@{selectedUser.username.toLowerCase()}</p>
                </div>

                <div className="details-section">
                  <h3>Contact Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{selectedUser.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{selectedUser.phone}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Website</span>
                      <span className="info-value">
                        <a href={`http://${selectedUser.website}`} target="_blank" rel="noopener noreferrer">
                          {selectedUser.website}
                        </a>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Address</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Street</span>
                      <span className="info-value">{selectedUser.address.street}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">City</span>
                      <span className="info-value">{selectedUser.address.city}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Zipcode</span>
                      <span className="info-value">{selectedUser.address.zipcode}</span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Company</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Name</span>
                      <span className="info-value">{selectedUser.company.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Catchphrase</span>
                      <span className="info-value">"{selectedUser.company.catchPhrase}"</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Business</span>
                      <span className="info-value">{selectedUser.company.bs}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">👤</div>
              <h3>Select a user to view details</h3>
              <p>Click on any user from the list to see their complete profile information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;