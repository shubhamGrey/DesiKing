FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ./Backend/Agronexis.Api/*.csproj ./Agronexis.Api/
RUN dotnet restore ./Agronexis.Api/Agronexis.Api.csproj

# Copy everything else and build
COPY ./Backend/. .
WORKDIR /src/Agronexis.Api
RUN dotnet publish -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 5000
ENTRYPOINT ["dotnet", "Agronexis.Api.dll"]
