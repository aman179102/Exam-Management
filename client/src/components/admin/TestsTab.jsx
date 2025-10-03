import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/TestsTab.module.css';

const TestsTab = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/api/tests', {
          headers: { 'x-auth-token': token },
        });
        console.log('Fetched tests:', res.data);
        setTests(res.data);
      } catch (error) {
        console.error('Error fetching tests', error);
      }
    };
    fetchTests();
  }, []);

  const handlePublish = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`/api/tests/${id}/publish`, {}, {
        headers: { 'x-auth-token': token },
      });
      console.log('Publish response:', res.data);
      alert('Test published successfully');
    } catch (error) {
      console.error('Error publishing test:', error.response ? error.response.data : error.message);
      alert(`Error publishing test: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const deleteTest = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        const res = await axios.delete(`/api/tests/${id}`, {
          headers: { 'x-auth-token': token },
        });
        console.log('Delete response:', res.data);
        setTests(tests.filter((test) => test._id !== id));
      } catch (error) {
        console.error('Error deleting test:', error.response ? error.response.data : error.message);
        alert(`Error deleting test: ${error.response ? error.response.data.message : error.message}`);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Manage Tests</h3>
        <Link to="/admin/create-test">
          <button className={styles.createButton}>Create New Test</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Questions</th>
            <th>Time Limit</th>
            <th className={styles.actionsHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tests) && tests.map((test) => (
            <tr key={test._id}>
              <td>{test.title}</td>
              <td>{test.description}</td>
              <td>{test.questions.length}</td>
              <td>{test.timeLimit} mins</td>
              <td>
                <button onClick={() => handlePublish(test._id)} className={styles.publishButton}>Publish</button>
                <button onClick={() => deleteTest(test._id)} className={styles.deleteButton}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestsTab;
