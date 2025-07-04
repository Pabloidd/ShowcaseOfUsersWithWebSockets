import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './MainPage.module.css';
import MainContent from "../mainContent/MainContent";

/**
 * Компонент MainPage - основная страница приложения.
 * @returns {JSX.Element}
 */
export default function MainPage() {
    return (
        <div className={styles.mainPage}>
            <Header />
            <MainContent />
            <Footer />
        </div>
    );
};

