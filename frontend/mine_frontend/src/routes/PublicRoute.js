import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    const user_detail = JSON.parse(user);
    if (!user_detail) {
        return <Navigate reloadDocument to="/9910c765099bd20851b270fc9d759253" />;
    }
    return children;
};

export default PublicRoute;