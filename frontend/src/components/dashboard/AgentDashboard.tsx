import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import TicketCard from '../tickets/TicketCard';
import TicketDetailDialog from '../tickets/TicketDetailDialog';
import { useTickets } from '../../contexts/TicketContext';
import { useAuth } from '../../contexts/AuthContext';
import type { Ticket, TicketStatus, TicketPriority } from '../../types';
import { LogOut, TicketIcon, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const AgentDashboard = () => {
    const { user, logout } = useAuth();
    const { tickets } = useTickets();
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');

    if (!user) return null;

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TicketIcon className="w-8 h-8 text-primary" />
                            <div>
                                <h1 className="text-2xl font-bold">Agent Portal</h1>
                                <p className="text-muted-foreground">Welcome back, {user.name}</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={logout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <Users className="w-8 h-8 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">{totalTickets}</p>
                                    <p className="text-muted-foreground">Total Tickets</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-8 h-8 text-destructive" />
                                <div>
                                    <p className="text-2xl font-bold">{openTickets}</p>
                                    <p className="text-muted-foreground">Open</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <Clock className="w-8 h-8 text-warning" />
                                <div>
                                    <p className="text-2xl font-bold">{inProgressTickets}</p>
                                    <p className="text-muted-foreground">In Progress</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-8 h-8 text-success" />
                                <div>
                                    <p className="text-2xl font-bold">{resolvedTickets}</p>
                                    <p className="text-muted-foreground">Resolved</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                placeholder="Search tickets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Tickets */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Tickets ({filteredTickets.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredTickets.length === 0 ? (
                            <div className="text-center py-12">
                                <TicketIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                                <p className="text-muted-foreground">No tickets match your current filters</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredTickets.map((ticket) => (
                                    <TicketCard
                                        key={ticket.id}
                                        ticket={ticket}
                                        onView={setSelectedTicket}
                                        showClientName
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Dialog */}
            <TicketDetailDialog
                ticket={selectedTicket}
                open={!!selectedTicket}
                onOpenChange={(open: boolean) => !open && setSelectedTicket(null)}
            />
        </div>
    );
};

export default AgentDashboard;