import React from 'react';
import styles from '../styles/StaticPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About Us</h1>
      <p className={styles.content}>
        Welcome to our platform! We are dedicated to providing the best exam management system. Our application allows administrators to create and manage exams, while students can take tests and view their results seamlessly. We aim to create a user-friendly and efficient environment for both educators and learners.
      </p>
    </div>
  );
};

export default AboutPage;
