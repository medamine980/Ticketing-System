import { useAuth } from './../contexts/AuthContext';
import ClientDashboard from './../components/dashboard/ClientDashboard';
import AgentDashboard from './../components/dashboard/AgentDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return user.role === 'client' ? <ClientDashboard /> : <AgentDashboard />;
};

export default Dashboard;