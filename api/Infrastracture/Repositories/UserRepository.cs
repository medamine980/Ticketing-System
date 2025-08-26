using Microsoft.EntityFrameworkCore;
using TicketingSystem.Application.Common.Interfaces;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Domain.Repositories;

namespace TicketingSystem.Infrastracture.Repositories
{
	public class UserRepository: IUserRepository
	{
		private IApplicationDbContext dbContext;

		public UserRepository(IApplicationDbContext dbContext)
		{
			this.dbContext = dbContext;
		}

		public async Task AddAsync(User user) => 
			await this.dbContext.Users.AddAsync(user);
		

		public async Task<User?> GetByEmailAsync(string email) =>
			await this.dbContext.Users.FirstOrDefaultAsync(user => user.Email == email);

		

		public async Task SaveChangesAsync() =>
			await this.dbContext.SaveChangesAsync();
		
	}
}
