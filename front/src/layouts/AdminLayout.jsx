import { Outlet } from 'react-router-dom'
import './AdminLayout.css'

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <main className="admin-layout__main">
        <Outlet />
      </main>
    </div>
  )
}
