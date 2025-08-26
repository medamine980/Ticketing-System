export type UserRole = 'client' | 'agent';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
}

export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    clientId: string;
    clientName: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Comment {
    id: string;
    ticketId: string;
    userId: string;
    userName: string;
    userRole: UserRole;
    content: string;
    createdAt: Date;
}