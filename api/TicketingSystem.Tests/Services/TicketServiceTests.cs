using Moq;
using Xunit;
using FluentAssertions;
using TicketingSystem.Application.Services;
using TicketingSystem.Application.DTOs.Ticket;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Domain.Enums;
using TicketingSystem.Domain.Repositories;
using TicketingSystem.Domain.Services;
using FluentValidation;

namespace TicketingSystem.Tests.Services
{
	public class TicketServiceTests
	{
		private readonly Mock<ITicketRepository> _repoMock = new();
		private readonly Mock<ICurrentUserService> _currentUserMock = new();
		private readonly IValidator<CreateTicketDTO> _validator =
			new InlineValidator<CreateTicketDTO>();

		public TicketServiceTests()
		{
			// validator rule: Title must not be empty
			_validator.RuleFor(x => x.Title).NotEmpty();
		}

		[Fact]
		public async Task AddTicket_Should_Throw_When_User_Not_LoggedIn()
		{
			var service = new TicketService(_repoMock.Object, _validator, _currentUserMock.Object);

			var dto = new CreateTicketDTO { Title = "Test Ticket" };

			Func<Task> act = async () => await service.AddTicket(dto);

			await act.Should().ThrowAsync<UnauthorizedAccessException>();
		}

		[Fact]
		public async Task AddTicket_Should_Save_When_User_Is_LoggedIn()
		{
			var user = new User { Id = Guid.NewGuid(), Name = "TestUser" };
			_currentUserMock.Setup(x => x.GetUser()).Returns(user);

			var service = new TicketService(_repoMock.Object, _validator, _currentUserMock.Object);

			var dto = new CreateTicketDTO { Title = "Valid Title" };

			var ticket = await service.AddTicket(dto);

			ticket.UserId.Should().Be(user.Id);
			_repoMock.Verify(x => x.AddAsync(It.IsAny<Ticket>()), Times.Once);
			_repoMock.Verify(x => x.SaveChangesAsync(), Times.Once);
		}
	}
}
