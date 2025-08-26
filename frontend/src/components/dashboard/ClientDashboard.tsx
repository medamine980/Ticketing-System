import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './../ui/card';
import { Button } from './../ui/button';
import TicketCard from './../tickets/TicketCard';
import CreateTicketDialog from './../tickets/CreateTicketDialog';
import TicketDetailDialog from './../tickets/TicketDetailDialog';
import EditTicketDialog from './../tickets/EditTicketDialog';
import { useTickets } from './../../contexts/TicketContext';
import { useAuth } from './../../contexts/AuthContext';
import type { Ticket } from './../../types';
import { LogOut, TicketIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const ClientDashboard = () => {
    const { user, logout } = useAuth();
    const { getTicketsByClient, deleteTicket } = useTickets();
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

    // user = {};

    // if (!user) return null;

    const userTickets = getTicketsByClient("user.id");
    const openTickets = userTickets.filter(t => t.status === 'open').length;
    const inProgressTickets = userTickets.filter(t => t.status === 'in-progress').length;
    const resolvedTickets = userTickets.filter(t => t.status === 'resolved').length;

    const handleDeleteTicket = (ticketId: string) => {
        deleteTicket(ticketId);
        toast.success('Ticket deleted successfully!');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TicketIcon className="w-8 h-8 text-primary" />
                            <div>
                                <h1 className="text-2xl font-bold">Support Portal</h1>
                                <p className="text-muted-foreground">Welcome back, {"user.name"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <CreateTicketDialog />
                            <Button variant="outline" onClick={logout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <TicketIcon className="w-8 h-8 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">{userTickets.length}</p>
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

                {/* Tickets */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {userTickets.length === 0 ? (
                            <div className="text-center py-12">
                                <TicketIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No tickets yet</h3>
                                <p className="text-muted-foreground mb-4">Create your first ticket to get started</p>
                                <CreateTicketDialog />
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {userTickets.map((ticket) => (
                                    <TicketCard
                                        key={ticket.id}
                                        ticket={ticket}
                                        onEdit={setEditingTicket}
                                        onDelete={handleDeleteTicket}
                                        onView={setSelectedTicket}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Dialogs */}
            <TicketDetailDialog
                ticket={selectedTicket}
                open={!!selectedTicket}
                onOpenChange={(open) => !open && setSelectedTicket(null)}
            />
            <EditTicketDialog
                ticket={editingTicket}
                open={!!editingTicket}
                onOpenChange={(open) => !open && setEditingTicket(null)}
            />
        </div>
    );
};

export default ClientDashboard;