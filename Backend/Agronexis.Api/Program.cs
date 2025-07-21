using Agronexis.Api.Middleware;
using Agronexis.Business.Configurations;
using Agronexis.DataAccess.ConfigurationsRepository;
using Agronexis.DataAccess.DbContexts;
using Agronexis.ExternalApi;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// Add services to the container.

builder.Services.AddControllers();
builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

Console.WriteLine("Environment: " + builder.Environment.EnvironmentName);
Console.WriteLine("Connection String: " + builder.Configuration.GetConnectionString("AGRONEXIS_DB_CONNECTION"));

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("AGRONEXIS_DB_CONNECTION")));
builder.Services.AddTransient<IConfigService, ConfigService>();
builder.Services.AddTransient<IConfigurationRepository, ConfigurationRepository>();
builder.Services.AddScoped<ExternalUtility>();

// Add logging
builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddDebug();
});

var allowedOrigins = new[] { "http://localhost:3002", "https://agronexis.com", "https://www.agronexis.com" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins(allowedOrigins)
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// JWT Authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsProduction())
{
    app.UseSwagger(c =>
    {
        c.RouteTemplate = "app/swagger/{documentName}/swagger.json"; // becomes /api/swagger/v1/swagger.json
    });

    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/app/swagger/v1/swagger.json", "Agronexis API V1"); // use public path!
        c.RoutePrefix = "app/swagger"; // internally under /api/swagger
    });
}

app.UseHttpsRedirection();

// Add Global Exception Handler Middleware (should be early in the pipeline)
app.UseGlobalExceptionHandler();

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
