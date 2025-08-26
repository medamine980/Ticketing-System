import { useAuth } from './../contexts/AuthContext';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';

const Index = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Dashboard /> : <AuthPage />;
};

export default Index;