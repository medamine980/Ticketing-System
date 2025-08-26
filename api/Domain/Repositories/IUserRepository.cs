using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Domain.Repositories
{
	public interface IUserRepository
	{
		Task<User?> GetByEmailAsync(string email);
		Task AddAsync(User user);
        Task SaveChangesAsync();
	}
}
