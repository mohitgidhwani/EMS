import axios from 'axios';
import React, { createContext, useCallback, useEffect, useState } from 'react'


export const AuthCon = createContext();



function AuthContext({ children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetched once here and shared via context — previously Navbar, Settings,
    // and the Admin analytics report each called GetAllRegisterUser
    // independently, tripling the (image-heavy) payload on pages where they
    // were all mounted together.
    const [registeredUsers, setRegisteredUsers] = useState([]);

    const refreshRegisteredUsers = useCallback(() => {
        return axios.get("https://localhost:7238/api/Auth/GetAllRegisterUser", { withCredentials: true })
            .then((res) => setRegisteredUsers(res.data))
            .catch(() => setRegisteredUsers([]));
    }, []);

    useEffect(() => {
         axios.get("https://localhost:7238/api/Auth/LoggedInUser", { withCredentials: true })
            .then((res) => { setUser(res.data)})
            .catch(() => { setUser(null) })
            .finally(() => setLoading(false))

        refreshRegisteredUsers();
    },[])
    return (
        <AuthCon.Provider value={{user , setUser, loading, registeredUsers, refreshRegisteredUsers }}>
             {children}
        </AuthCon.Provider>
    )
}

export default AuthContext
