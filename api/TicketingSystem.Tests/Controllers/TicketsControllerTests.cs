using Moq;
using Xunit;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using TicketingSystem.Controllers;
using TicketingSystem.Domain.Services;
using TicketingSystem.Application.DTOs.Ticket;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Tests.Controllers
{
	public class TicketsControllerTests
	{
		private readonly Mock<ITicketService> _serviceMock = new();

		[Fact]
		public async Task GetAll_Should_Return_Ok()
		{
			_serviceMock.Setup(x => x.GetAllAsync())
				.ReturnsAsync(new List<TicketDTO> { new TicketDTO { Title = "Test" } });

			var controller = new TicketsController(_serviceMock.Object);

			var result = await controller.GetAll();

			var okResult = result as OkObjectResult;
			okResult.Should().NotBeNull();
			var tickets = okResult!.Value as List<TicketDTO>;
			tickets.Should().HaveCount(1);
		}

		[Fact]
		public async Task Create_Should_Return_Ok_When_Success()
		{
			var dto = new CreateTicketDTO { Title = "New Ticket" };
			_serviceMock.Setup(x => x.AddTicket(dto))
				.ReturnsAsync(new Ticket { Title = dto.Title });

			var controller = new TicketsController(_serviceMock.Object);

			var result = await controller.Create(dto);

			result.Should().BeOfType<OkObjectResult>();
		}
	}
}
