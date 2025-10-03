import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import styles from '../styles/GalleryPage.module.css';

const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchPhotos();
    fetchUser();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await api.get('/gallery');
      setPhotos(res.data);
    } catch (err) {
      console.error('Error fetching photos:', err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      // Not logged in or token expired
      setUser(null);
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);

    try {
      await api.post('/gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchPhotos();
      setTitle('');
      setImage(null);
    } catch (err) {
      console.error('Error uploading photo:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/gallery/${id}`);
      fetchPhotos();
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gallery</h1>

      {user && user.role === 'admin' && (
        <div className={styles.uploadForm}>
          <h2 className={styles.formTitle}>Upload a New Photo</h2>
          <form onSubmit={handleSubmit} className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Photo Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="file"
              onChange={handleFileChange}
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button}>Upload</button>
          </form>
        </div>
      )}

      <div className={styles.galleryGrid}>
        {photos.map((photo) => (
          <div key={photo._id} className={styles.photoCard}>
            <img src={`http://localhost:5000${photo.imageUrl}`} alt={photo.title} />
            <div className={styles.photoTitle}>{photo.title}</div>
            {user && user.role === 'admin' && (
              <button onClick={() => handleDelete(photo._id)} className={styles.deleteButton}>
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
