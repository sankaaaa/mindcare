import React from 'react';
import {Link} from 'react-router-dom';
import styles from '../styles/footer.module.css';
import {ReactComponent as Frame} from '../assets/Frame.svg';

function Footer() {
    return (
        <footer className={styles.footer}>
                <div className={styles.logo}>
                    <Frame className={styles.frameIcon}/>
                    <div className={styles.logoText}>MindCare</div>
                </div>

                <div className={styles.legalInfo}>
                    <h3>Юридична інформація</h3>
                    <Link to="/privacy-policy" className={styles.footerLink}>
                        Політика конфіденційності
                    </Link>
                    <Link to="/terms-of-use" className={styles.footerLink}>
                        Правила користування сайтом
                    </Link>
                </div>

                <div className={styles.contactInfo}>
                    <h3>Зв'язатися з нами</h3>
                    <a href="mailto:mindcare_platform@ukr.net" className={styles.contactEmail}>
                        mindcare_platform@ukr.net
                    </a>
                </div>

                <div className={styles.footerLeaf}>
                    <Frame className={styles.leafIcon}/>
                </div>
        </footer>
    );
}

export default Footer;
