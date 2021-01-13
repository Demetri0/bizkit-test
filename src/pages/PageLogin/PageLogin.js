import { LoginForm } from '../../components/LoginForm'

import styles from './PageLogin.module.css'

export function PageLogin() {
    return <div className={styles.PageLogin}>
        <LoginForm />
    </div>
}
