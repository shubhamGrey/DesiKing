# Use the official .NET SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the project files
COPY Agronexis.Api/*.csproj ./Agronexis.Api
RUN dotnet restore ./Agronexis.Api/Agronexis.Api.csproj

# Copy the rest of the application files and build the application
COPY Agronexis.Api ./Agronexis.Api
RUN dotnet publish ./Agronexis.Api/Agronexis.Api.csproj --configuration Release --output /app/publish

# Use the official .NET runtime image for running the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

# Expose the port the application runs on
EXPOSE 5000

# Set the entry point for the container
ENTRYPOINT ["dotnet", "Agronexis.Api.dll"]
