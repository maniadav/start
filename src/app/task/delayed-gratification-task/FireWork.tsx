import React from 'react';
import styles from './firework.module.css';

const Firework: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.firework}></div>
      <div className={styles.firework}></div>
      <div className={styles.firework}></div>
    </div>
  );
};

export default Firework;
