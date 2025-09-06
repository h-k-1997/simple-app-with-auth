import AuthProvider, { useAuth } from './AuthContext';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Profile from './components/Profile';

function Home() {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading…</div>;

  return (
    <div style={{ display: 'grid', gap: 16, padding: 24 }}>
      <h2>Auth Demo</h2>
      {user ? (
        <Profile />
      ) : (
        <div style={{ display: 'flex', gap: 24 }}>
          <RegisterForm />
          <LoginForm />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}
