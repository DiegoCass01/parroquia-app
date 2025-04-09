import React from 'react';

const EditUser = () => {
  // Example user data
  const user = {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@example.com',
    role: 'Admin',
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Edit User</h1>
      <div style={{ marginTop: '20px' }}>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
};

export default EditUser;