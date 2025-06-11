[Route("api")]
[ApiController]
public class RootController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("API is running");
    }
}
