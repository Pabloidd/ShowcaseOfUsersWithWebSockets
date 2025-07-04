import React from 'react';
import styles from './Footer.module.css';

/**
 * компонент подвала
 */
export default function Footer(){
    return (
        <footer className={styles.footer}>
            <p className={styles.footer__text}>&copy;Pablo's product</p>
        </footer>
    );
};