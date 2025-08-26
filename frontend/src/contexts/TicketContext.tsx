import React, { createContext, useContext, useState } from 'react';
import type { Ticket, Comment, TicketStatus, TicketPriority } from './../types';

interface TicketContextType {
    tickets: Ticket[];
    comments: Comment[];
    createTicket: (title: string, description: string, clientId: string, clientName: string) => void;
    updateTicket: (id: string, updates: Partial<Ticket>) => void;
    deleteTicket: (id: string) => void;
    addComment: (ticketId: string, content: string, userId: string, userName: string, userRole: string) => void;
    getTicketsByClient: (clientId: string) => Ticket[];
    getCommentsByTicket: (ticketId: string) => Comment[];
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Mock data
const mockTickets: Ticket[] = [
    {
        id: '1',
        title: 'Login Issue',
        description: 'Cannot log into my account. Getting error message.',
        status: 'open',
        priority: 'high',
        clientId: '1',
        clientName: 'John Client',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        id: '2',
        title: 'Feature Request',
        description: 'Would like to see dark mode option in the application.',
        status: 'in-progress',
        priority: 'medium',
        clientId: '1',
        clientName: 'John Client',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12'),
    },
];

const mockComments: Comment[] = [
    {
        id: '1',
        ticketId: '1',
        userId: '2',
        userName: 'Sarah Agent',
        userRole: 'agent',
        content: 'I can help you with this. Can you please provide more details about the error message?',
        createdAt: new Date('2024-01-15'),
    },
];

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
    const [comments, setComments] = useState<Comment[]>(mockComments);

    const createTicket = (title: string, description: string, clientId: string, clientName: string) => {
        const newTicket: Ticket = {
            id: Date.now().toString(),
            title,
            description,
            status: 'open',
            priority: 'medium',
            clientId,
            clientName,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setTickets(prev => [newTicket, ...prev]);
    };

    const updateTicket = (id: string, updates: Partial<Ticket>) => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === id
                ? { ...ticket, ...updates, updatedAt: new Date() }
                : ticket
        ));
    };

    const deleteTicket = (id: string) => {
        setTickets(prev => prev.filter(ticket => ticket.id !== id));
        setComments(prev => prev.filter(comment => comment.ticketId !== id));
    };

    const addComment = (ticketId: string, content: string, userId: string, userName: string, userRole: string) => {
        const newComment: Comment = {
            id: Date.now().toString(),
            ticketId,
            userId,
            userName,
            userRole: userRole as any,
            content,
            createdAt: new Date(),
        };
        setComments(prev => [...prev, newComment]);
    };

    const getTicketsByClient = (clientId: string) => {
        return tickets.filter(ticket => ticket.clientId === clientId);
    };

    const getCommentsByTicket = (ticketId: string) => {
        return comments.filter(comment => comment.ticketId === ticketId);
    };

    return (
        <TicketContext.Provider value={{
            tickets,
            comments,
            createTicket,
            updateTicket,
            deleteTicket,
            addComment,
            getTicketsByClient,
            getCommentsByTicket,
        }}>
            {children}
        </TicketContext.Provider>
    );
};

export const useTickets = () => {
    const context = useContext(TicketContext);
    if (context === undefined) {
        throw new Error('useTickets must be used within a TicketProvider');
    }
    return context;
};