using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Domain.Enums;
using TicketingSystem.Domain.Services;
using TicketingSystem.Infrastracture.Utility;

namespace TicketingSystem.Application.Services
{
	public class CurrentUserService : ICurrentUserService
	{
		private readonly IHttpContextAccessor _httpContextAccessor;

		public CurrentUserService(IHttpContextAccessor httpContextAccessor)
		{
			_httpContextAccessor = httpContextAccessor;
		}

		public string GetUserName()
		{
			return _httpContextAccessor.HttpContext?.User?.FindFirst(JwtRegisteredClaimNames.Name)?.Value;
		}

		public string GetUserEmail()
		{
			return _httpContextAccessor.HttpContext?.User?.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
		}

		public User? GetUser() {
			ClaimsPrincipal user = _httpContextAccessor.HttpContext?.User;
			if (user == null)
			{
				return null;
			}
			string Id = user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
			string Name = user.FindFirst(ClaimTypes.Name)?.Value ?? "";
			string Email = user.FindFirst(ClaimTypes.Email)?.Value ?? "";
			string Role = user.FindFirst(ClaimTypes.Role)?.Value ?? "";
			return new()
			{
				Id = new Guid(Id),
				Name = Name,
				Email = Email,
				Role = Role.ToEnum<Role>()
			};
		}
	}
}
