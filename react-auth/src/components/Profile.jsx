import { useAuth } from '../AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  if (!user) return <div>Not logged in.</div>;
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <h3>Profile</h3>
      <div>
        <b>ID:</b> {user.id}
      </div>
      <div>
        <b>Email:</b> {user.email}
      </div>
      <div>
        <b>Name:</b> {user.name || '—'}
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
