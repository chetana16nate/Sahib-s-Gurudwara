
import 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const Layout = () => {
    return (
        <div className="layout">
            <div className="spiritual-background" aria-hidden="true">
                <div className="spiritual-glow spiritual-glow--top" />
                <div className="spiritual-glow spiritual-glow--bottom" />
                <div className="spiritual-pattern" />
            </div>
            <Navbar />

            <div className="main-content">
                <Outlet />
            </div>

            <Footer />
        </div>
    );
};

export default Layout;




