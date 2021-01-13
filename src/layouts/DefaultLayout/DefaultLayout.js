import { useContext } from "react"

import { UserContext } from '../../core/UserContext'
import { LoginForm } from '../../components/LoginForm'

import styles from './DefaultLayout.module.css'

export function DefaultLayout({ children }) {
    const [user] = useContext(UserContext)

    if (!user) {
        return <div className={styles.LoginBG}>
            <LoginForm />
        </div>
    }

    return <div>
        <div>DefaultLayout</div>
        {children}
    </div>
}
