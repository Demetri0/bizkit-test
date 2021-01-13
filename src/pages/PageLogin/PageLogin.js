import { LoginForm } from '../../components/LoginForm'

import styles from './PageLogin.module.css'

export function PageLogin({ login }) {
    return <div className={styles.PageLogin}>
        <LoginForm login={login} />
    </div>
}
