namespace TicketingSystem.Infrastracture.Utility
{
	public static class EnumHelper
	{
		public static T ToEnum<T>(this string value) where T : struct, Enum
		{
			return Enum.TryParse(value, true, out T result) ? result : default;
		}
	}
}
