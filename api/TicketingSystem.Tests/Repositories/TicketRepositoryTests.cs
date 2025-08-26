using Microsoft.EntityFrameworkCore;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Infrastracture.Persistence;
using TicketingSystem.Infrastracture.Repositories;
using Xunit;
using FluentAssertions;

namespace TicketingSystem.TicketingSystem.Tests.Repositories
{
	public class TicketRepositoryTests
	{
		private ApplicationDbContext GetDbContext()
		{
			var options = new DbContextOptionsBuilder<ApplicationDbContext>()
				.UseInMemoryDatabase(Guid.NewGuid().ToString())
				.Options;

			return new ApplicationDbContext(options);
		}

		[Fact]
		public async Task AddAsync_Should_Add_Ticket()
		{
			var db = GetDbContext();
			var repo = new TicketRepository(db);

			var ticket = new Ticket { Id = Guid.NewGuid(), Title = "Test Ticket" };

			await repo.AddAsync(ticket);
			await repo.SaveChangesAsync();

			var tickets = await repo.GetAllTickets();

			tickets.Should().ContainSingle(t => t.Title == "Test Ticket");
		}

		[Fact]
		public async Task DeleteById_Should_Remove_Ticket()
		{
			var db = GetDbContext();
			var repo = new TicketRepository(db);

			var ticket = new Ticket { Id = Guid.NewGuid(), Title = "Test Ticket" };
			await repo.AddAsync(ticket);
			await repo.SaveChangesAsync();

			await repo.DeleteById(ticket.Id);
			await repo.SaveChangesAsync();

			var tickets = await repo.GetAllTickets();
			tickets.Should().BeEmpty();
		}

	}
}
