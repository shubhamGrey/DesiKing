using Agronexis.Api.Middleware;
using Agronexis.Business.Configurations;
using Agronexis.DataAccess.ConfigurationsRepository;
using Agronexis.DataAccess.DbContexts;
using Agronexis.ExternalApi;
using Agronexis.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.SwaggerUI;
using System.Text;

// Load configuration files
var builder = WebApplication.CreateBuilder(args);

// Load configuration files
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

Console.WriteLine("Environment: " + builder.Environment.EnvironmentName);

// Add services to the container
builder.Services.AddControllers();
builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);

// Swagger Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Agronexis API",
        Version = "v1",
        Description = "API for Agronexis - Premium Spice Management System",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Agronexis Support",
            Email = "support@agronexis.com"
        }
    });

    // JWT in Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// DB Context
Console.WriteLine("Connection String: " + builder.Configuration.GetConnectionString("AGRONEXIS_DB_CONNECTION"));
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("AGRONEXIS_DB_CONNECTION")));

// Dependency Injections
builder.Services.AddScoped<IConfigService, ConfigService>();
builder.Services.AddScoped<IConfigurationRepository, ConfigurationRepository>();
builder.Services.AddScoped<ExternalUtility>();

// Logging
builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddDebug();
});

// CORS
var allowedOrigins = new[]
{
    "http://localhost:3002",
    "https://agronexis.com",
    "https://www.agronexis.com"
};

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policyBuilder =>
    {
        policyBuilder.WithOrigins(allowedOrigins)
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

// -----------------------------------------------------------------------------
// Middleware pipeline
// -----------------------------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else if (app.Environment.IsProduction())
{
    app.UseSwagger(c => c.RouteTemplate = "swagger/{documentName}/swagger.json");
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Agronexis API V1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "Agronexis API Documentation";
        c.DefaultModelsExpandDepth(-1);
        c.DocExpansion(DocExpansion.None);
    });
}

app.UseHttpsRedirection();
app.UseGlobalExceptionHandler();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseMiddleware<RepositoryExceptionHandlerMiddleware>();

app.Run();
