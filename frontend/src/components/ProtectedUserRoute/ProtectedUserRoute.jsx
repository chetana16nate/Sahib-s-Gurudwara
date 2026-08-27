import { Navigate, useLocation } from 'react-router-dom';


export default function ProtectedUserRoute({
    children
}) {

    const location =
        useLocation();

    const token =
        localStorage.getItem(
            'userToken'
        );


    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from:
                        location.pathname
                }}
            />
        );

    }


    return children;
}