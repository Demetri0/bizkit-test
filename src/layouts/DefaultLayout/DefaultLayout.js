import { Sidebar } from '../../components/Sidebar'

export function DefaultLayout({ children }) {
    return <div>
        <Sidebar />
        {children}
    </div>
}
