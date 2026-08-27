import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, LogOut, RefreshCw, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import "./AdminUsers.css";

export default function AdminUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await api.get("/auth/admin/users");
            setUsers(data.users || []);
        } catch (requestError) {
            if ([401, 403].includes(requestError.response?.status)) {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminUser");
                navigate("/admin/login", { replace: true });
                return;
            }
            setError(requestError.response?.data?.message || "Unable to load users.");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadUsers();
    }, [loadUsers]);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return users;
        return users.filter((user) => [user.name, user.email, user.phone]
            .some((value) => value?.toLowerCase().includes(query)));
    }, [search, users]);

    const logout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("userRole");
        navigate("/admin/login", { replace: true });
    };

    return <main className="admin-users-page">
        <header className="admin-users-header">
            <button onClick={() => navigate("/admin/bookings")}><ArrowLeft size={17} /> All Bookings</button>
            <div><p>ADMINISTRATION</p><h1>Registered Users</h1><span>View devotees who have created an account.</span></div>
            <div className="admin-users-actions">
                <button onClick={loadUsers} disabled={loading}><RefreshCw size={17} /> Refresh</button>
                <button className="logout" onClick={logout}><LogOut size={17} /> Logout</button>
            </div>
        </header>
        <section className="admin-users-summary"><Users size={25} /><span>Registered devotees<strong>{users.length}</strong></span></section>
        <section className="admin-users-card">
            <div className="admin-users-card-header">
                <div><h2>All Users</h2><span>Showing {filteredUsers.length} of {users.length} users</span></div>
                <label><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email or phone" /></label>
            </div>
            {loading ? <div className="admin-users-state">Loading users…</div>
                : error ? <div className="admin-users-state error">{error}<button onClick={loadUsers}>Try again</button></div>
                : !filteredUsers.length ? <div className="admin-users-state">No users found.</div>
                : <div className="admin-users-table-wrap"><table>
                    <thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Joined</th></tr></thead>
                    <tbody>{filteredUsers.map((user) => <tr key={user._id}>
                        <td><span className="admin-user-avatar">{user.name?.charAt(0).toUpperCase()}</span><strong>{user.name}</strong></td>
                        <td>{user.email}</td><td>{user.phone}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}</td>
                    </tr>)}</tbody>
                </table></div>}
        </section>
    </main>;
}
