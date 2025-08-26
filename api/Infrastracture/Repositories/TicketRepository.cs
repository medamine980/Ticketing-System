using Microsoft.EntityFrameworkCore;
using TicketingSystem.Application.Common.Interfaces;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Domain.Repositories;

namespace TicketingSystem.Infrastracture.Repositories
{
	public class TicketRepository(IApplicationDbContext dbContext) : ITicketRepository
	{
		private IApplicationDbContext dbContext = dbContext;
	
		public async Task AddAsync(Ticket ticket) => await dbContext.Tickets.AddAsync(ticket);
	
		public async Task<List<Ticket>> GetAllTickets() => await dbContext.Tickets.ToListAsync();

		public async Task<Ticket?> DeleteById(Guid Id)
		{
			Ticket? ticket = await this.dbContext.Tickets.Where(t => t.Id == Id).FirstOrDefaultAsync();
			if (ticket != null)
			{
				dbContext.Tickets.Remove(ticket);
			}
			return ticket;

		}

		public async Task SaveChangesAsync() => await dbContext.SaveChangesAsync();

        public async Task<List<Ticket>> GetAllTicketByUser(Guid userId) => await this.dbContext.Tickets.Where(t => t.UserId == userId).ToListAsync();
    }
}
