import React from 'react';
import logo from '../../assets/images/logo_vault_boy.svg';
import pablosProductLogo from '../../assets/images/Pablo\'s_product.png';
import styles from './Header.module.css';

/**
 * компонент шапки
 */
const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <img className={styles.header__img} src={logo} alt="Логотип vault boy" />
            <h1 className={styles.header__title}>Портал управления сотрудниками</h1>
            <img className={styles.header__img} src={pablosProductLogo} alt="Логотип продукта" />
        </header>
    );
};

export default Header;