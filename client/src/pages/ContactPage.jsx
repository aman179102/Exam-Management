import React from 'react';
import styles from '../styles/StaticPage.module.css';

const ContactPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contact Us</h1>
      <p className={styles.content}>
        If you have any questions, feedback, or inquiries, please feel free to reach out to us at <a href="mailto:contact@example.com">contact@example.com</a>. We are always happy to help!
      </p>
    </div>
  );
};

export default ContactPage;
