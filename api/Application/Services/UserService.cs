using FluentValidation;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TicketingSystem.Application.DTOs.User;
using TicketingSystem.Application.Mappers;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Domain.Enums;
using TicketingSystem.Domain.Repositories;
using TicketingSystem.Domain.Services;
using TicketingSystem.Infrastracture.Persistence;

namespace TicketingSystem.Application.Services
{
	public class UserService : IUserService
	{
		private ApplicationDbContext dbContext;
		private IValidator<RegisterUserDTO> registerUserValidator;
		private IValidator<LoginUserDTO> loginUserValidator;
		private IUserRepository userRepository;

		private readonly IConfiguration _configuration;

		public UserService(
			ApplicationDbContext dbContext,
			IValidator<RegisterUserDTO> registerUserValidator,
			IValidator<LoginUserDTO> loginUserValidator,
			IUserRepository userRepository,
			IConfiguration configuration
			)
		{
			this.dbContext = dbContext;
			this.registerUserValidator = registerUserValidator;
			this.loginUserValidator = loginUserValidator;
			this.userRepository = userRepository;
			this._configuration = configuration;
		}

		public async Task<UserResponseDTO> Register(RegisterUserDTO dto)
		{

			var result = this.registerUserValidator.Validate(dto);
			if (!result.IsValid)
			{
				throw new ValidationException(result.Errors);
			}
			var existing = await this.userRepository.GetByEmailAsync(dto.Email);
			if (existing != null)
			{
				throw new Exception("Email already exists");
			}
			User user = UserMapper.RegisterUserDTOToUser(dto);
			user.Id = Guid.NewGuid();
			user.Password = HashPassword(user.Password);
			user.Role = Role.Client;

			await this.userRepository.AddAsync(user);
			await this.userRepository.SaveChangesAsync();

			return UserMapper.UserToUserResponseDTO(user);
		}

		public async Task<string> Login(LoginUserDTO dto)
		{
			var validation = this.loginUserValidator.Validate(dto);
			if (!validation.IsValid)
			{
				throw new ValidationException(validation.Errors);
			}
			var existingUser = await this.userRepository.GetByEmailAsync(dto.Email);
			if (existingUser == null)
			{
				throw new UnauthorizedAccessException("Invalid Credentials");
			}
			if (!VerifyHashes(dto.Password, existingUser.Password))
			{
				throw new UnauthorizedAccessException("Invalid Credentials");
			}

			return GenerateJwtToken(existingUser);
		}

		private static string HashPassword(string plainTextPassword)
		=> BCrypt.Net.BCrypt.HashPassword(plainTextPassword);

		private static bool VerifyHashes(string plainText, string hashedPassword)
		=> BCrypt.Net.BCrypt.Verify(plainText, hashedPassword);

		private string GenerateJwtToken(User user)
		{
			var claims = new[]
			{
				new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
				new Claim(JwtRegisteredClaimNames.Email, user.Email),
				new Claim(JwtRegisteredClaimNames.Name, user.Name),
				new Claim(ClaimTypes.Role, user.Role.ToString())
			};

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var token = new JwtSecurityToken(
				issuer: _configuration["Jwt:Issuer"],
				audience: _configuration["Jwt:Audience"],
				claims: claims,
				expires: DateTime.Now.AddHours(2),
				signingCredentials: creds);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}	
