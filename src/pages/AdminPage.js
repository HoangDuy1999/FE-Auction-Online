
import Footer from '../components/Footer.js';
import AdminNav from '../components/AdminNav';
import Dashboard from '../features/Admin/Dashboard';

export default function AdminPage(props) {
    return (
        <div className = 'container' >
            <AdminNav/>
            <Dashboard/>
            <Footer/>
        </div>
    ) 
};