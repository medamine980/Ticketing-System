using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Domain.Repositories
{
	public interface ITicketRepository
	{
		Task<List<Ticket>> GetAllTickets();
		Task<List<Ticket>> GetAllTicketByUser(Guid userId);
		Task AddAsync(Ticket ticket);

        public Task<Ticket?> DeleteById(Guid Id);
        Task SaveChangesAsync();
	}
}
