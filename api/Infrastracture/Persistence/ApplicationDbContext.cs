using Microsoft.EntityFrameworkCore;
using TicketingSystem.Application.Common.Interfaces;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Infrastracture.Persistence
{
	public class ApplicationDbContext: DbContext, IApplicationDbContext
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options):
			base(options) 
		{}
		public DbSet<User> Users => Set<User>();
		public DbSet<Ticket> Tickets => Set<Ticket>();


		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<User>()
				.Property(u => u.Role)
				.HasConversion<string>();
			modelBuilder.Entity<User>()
				.HasIndex(u => u.Email)
				.IsUnique();
			modelBuilder.Entity<Ticket>()
				.Property(t => t.Status)
				.HasConversion<string>();

		}
	}
}
