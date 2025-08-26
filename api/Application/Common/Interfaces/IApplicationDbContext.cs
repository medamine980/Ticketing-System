using Microsoft.EntityFrameworkCore;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Common.Interfaces
{
	public interface IApplicationDbContext
	{
		DbSet<User> Users { get; }
		DbSet<Ticket> Tickets { get; }
		Task<int> SaveChangesAsync(CancellationToken cancellationToken =  default);
	}
}
