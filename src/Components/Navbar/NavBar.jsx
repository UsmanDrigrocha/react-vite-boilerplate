import React from 'react'
import { useNavigate } from 'react-router-dom'
import { loginTokenKey } from '../../Utils/utils';

export default function NavBar() {

    const navigate = useNavigate();
    const navigateTo = (to) => {
        navigate(to)
    }

    const handleLogout = () => {
        localStorage.removeItem(loginTokenKey);
        navigate('/login'); 1
    };

    const isLoggedIn = localStorage.getItem(loginTokenKey);

    return (
        <div className="nav">
            <h1>Learnixx</h1>
            <div className="header-links">
                <a onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>Home</a>

                {!isLoggedIn ? (
                    <>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/login'); }}>Login</a>
                        <a onClick={(e) => { e.preventDefault(); localStorage.setItem(loginTokenKey, loginTokenKey); navigateTo('/login'); }}>Add Token</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/register'); }}>Register</a>
                    </>
                ) : (
                    <a onClick={handleLogout}>Logout</a>
                )}
            </div>
        </div>
    )
}
