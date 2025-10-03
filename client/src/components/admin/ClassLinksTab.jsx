import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import io from 'socket.io-client';
import styles from '../../styles/ClassLinksTab.module.css';

const socket = io('http://localhost:5000');

const ClassLinksTab = () => {
  const [links, setLinks] = useState([]);
  const [formData, setFormData] = useState({ title: '', link: '' });

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await api.get('/classlinks');
        setLinks(res.data);
      } catch (err) {
        console.error('Failed to fetch class links', err);
      }
    };
    fetchLinks();

    socket.on('new-class-link', (newLink) => {
      setLinks((prevLinks) => [newLink, ...prevLinks]);
    });

    socket.on('updated-class-link', (updatedLink) => {
      setLinks((prevLinks) =>
        prevLinks.map((link) => (link._id === updatedLink._id ? updatedLink : link))
      );
    });

    socket.on('deleted-class-link', (deletedLinkId) => {
      setLinks((prevLinks) => prevLinks.filter((link) => link._id !== deletedLinkId));
    });

    return () => {
      socket.off('new-class-link');
      socket.off('updated-class-link');
      socket.off('deleted-class-link');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/classlinks', formData);
      setFormData({ title: '', link: '' });
    } catch (err) {
      console.error('Failed to create class link', err);
    }
  };

  const deleteLink = async (id) => {
    try {
      await api.delete(`/classlinks/${id}`);
      setLinks(links.filter(link => link._id !== id));
    } catch (err) {
      console.error('Failed to delete class link', err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Manage Class Links</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="text" 
          placeholder="Link Title" 
          value={formData.title} 
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          className={styles.input} 
          required 
        />
        <input 
          type="url" 
          placeholder="https://meet.google.com/abc-def-ghi" 
          value={formData.link} 
          onChange={(e) => setFormData({ ...formData, link: e.target.value })} 
          className={styles.input} 
          required 
        />
        <button type="submit" className={styles.button}>Add Link</button>
      </form>
      
      <div>
        <h3 className={styles.title}>Current Class Links</h3>
        <ul className={styles.list}>
          {links.map(link => (
            <li key={link._id} className={styles.listItem}>
              <div>
                <p>{link.title}</p>
                <a href={link.link} target="_blank" rel="noopener noreferrer" className={styles.link}>{link.link}</a>
              </div>
              <button onClick={() => deleteLink(link._id)} className={styles.deleteButton}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClassLinksTab;

