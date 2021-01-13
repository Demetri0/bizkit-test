import { Sidebar } from '../../components/Sidebar'

import styles from './DefaultLayout.module.css'

export function DefaultLayout({ logout, children }) {
    return <div className={styles.DefaultLayout}>
        <Sidebar logout={logout} />
        {children}
    </div>
}
