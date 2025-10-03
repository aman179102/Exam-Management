import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import styles from '../../styles/UsersTab.module.css';

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'student' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const { username, password, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      fetchUsers();
      setFormData({ username: '', password: '', role: 'student' });
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Manage Users</h2>
      <form onSubmit={onSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={username}
          onChange={onChange}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          className={styles.input}
          required
        />
        <select name="role" value={role} onChange={onChange} className={styles.input}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className={styles.button}>
          Add User
        </button>
      </form>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => deleteUser(user._id)} className={styles.deleteButton}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTab;
