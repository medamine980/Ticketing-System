using System.Security.Claims;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Domain.Services
{
	public interface ICurrentUserService
	{
		public string GetUserName();

		public string GetUserEmail();
		
		User? GetUser();
	}
}
