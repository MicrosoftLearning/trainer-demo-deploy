---
name: webapp-development
description: ".NET 10 C# sample web application scaffolding patterns, industry-specific seed data templates, Dockerfile generation, and azd service wiring for demo workload scenarios."
compatibility: Works with Claude Code, GitHub Copilot, VS Code, and any Agent Skills compatible tool.
license: MIT
metadata:
  author: petender
  version: "1.0"
  category: webapp-development
---

# Webapp Development Skill

Patterns and templates for scaffolding .NET 10 C# sample web applications
with industry-specific data for Azure demo scenarios. When the architecture
includes a data service (Storage Table, SQL, Cosmos DB, etc.), the app uses
that service as its data backend. Otherwise, it falls back to local JSON seed
files. Covers project structure, data service patterns, container support, and
azd integration.

---

## 1. Project Structure

Every sample webapp follows this layout:

```text
generated-scenarios/{project}/src/{ProjectName}.Web/
├── {ProjectName}.Web.csproj
├── Program.cs
├── appsettings.json
├── appsettings.Development.json
├── Dockerfile                    # Container targets only
├── .dockerignore                 # Container targets only
├── Models/
│   ├── {Entity1}.cs
│   ├── {Entity2}.cs
│   └── {Entity3}.cs
├── Services/
│   └── SampleDataService.cs
├── SeedData/
│   ├── {entity1}s.json
│   ├── {entity2}s.json
│   └── {entity3}s.json
├── Pages/
│   ├── Index.cshtml
│   ├── Index.cshtml.cs
│   ├── {Entity1}/
│   │   ├── Index.cshtml
│   │   ├── Index.cshtml.cs
│   │   ├── Details.cshtml
│   │   └── Details.cshtml.cs
│   ├── {Entity2}/
│   │   └── ... (same pattern)
│   └── Shared/
│       ├── _Layout.cshtml
│       └── _ViewImports.cshtml
└── wwwroot/
    ├── css/
    │   └── site.css
    └── lib/
```

### Naming Conventions

| Element        | Convention                  | Example              |
| -------------- | --------------------------- | -------------------- |
| Project folder | `{PascalCase}.Web`          | `HealthcareDemo.Web` |
| Model classes  | PascalCase singular         | `Patient`, `Doctor`  |
| Seed files     | camelCase plural `.json`    | `patients.json`      |
| Pages folders  | PascalCase plural of entity | `Pages/Patients/`    |
| Service class  | See data strategy below     | Depends on backend   |

### Data Strategy Decision

| Architecture Includes           | Service Class             | NuGet Packages Required                           |
| ------------------------------- | ------------------------- | ------------------------------------------------- |
| Storage Account (Table Storage) | `TableStorageDataService` | `Azure.Data.Tables`, `Azure.Identity`             |
| SQL Database                    | `SqlDataService`          | `Microsoft.Data.SqlClient`                        |
| Cosmos DB (NoSQL)               | `CosmosDataService`       | `Microsoft.Azure.Cosmos`                          |
| Cosmos DB (Table API)           | `TableStorageDataService` | `Azure.Data.Tables`, `Azure.Identity`             |
| Redis Cache                     | `RedisDataService`        | `Microsoft.Extensions.Caching.StackExchangeRedis` |
| **None of the above**           | `SampleDataService`       | (none — local JSON fallback)                      |

> **Rule**: Use the Azure data service when one is present in the architecture.
> Only fall back to `SampleDataService` with local JSON when no data endpoint exists.

---

## 2. Industry Data Templates

### Healthcare

**Models:**

```csharp
public class Doctor
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

public class Patient
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string BloodType { get; set; } = string.Empty;
    public int DoctorId { get; set; }
}

public class Appointment
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public DateTime ScheduledAt { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Scheduled";
}
```

**Seed data** (`doctors.json` excerpt):

```json
[
  {
    "Id": 1,
    "Name": "Dr. Sarah Chen",
    "Specialty": "Cardiology",
    "Email": "s.chen@clinic.local",
    "Phone": "555-0101"
  },
  {
    "Id": 2,
    "Name": "Dr. James Wilson",
    "Specialty": "Neurology",
    "Email": "j.wilson@clinic.local",
    "Phone": "555-0102"
  }
]
```

### Retail

**Models:** `Product`, `Category`, `Order`

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public int StockQuantity { get; set; }
}

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class Order
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending";
    public List<int> ProductIds { get; set; } = new();
}
```

### Finance

**Models:** `Account`, `Transaction`, `Customer`

```csharp
public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime MemberSince { get; set; }
}

public class Account
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string AccountType { get; set; } = "Checking";
    public decimal Balance { get; set; }
    public string Currency { get; set; } = "USD";
}

public class Transaction
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
```

### Education

**Models:** `Student`, `Course`, `Enrollment`

### Hospitality

**Models:** `Room`, `Guest`, `Reservation`

### Logistics

**Models:** `Shipment`, `Warehouse`, `Driver`

### Real Estate

**Models:** `Property`, `Agent`, `Listing`

### Manufacturing

**Models:** `Product`, `WorkOrder`, `Machine`

> For industries not listed: derive 2-4 entities from the project description,
> following the same patterns (Id, Name, descriptive fields, status fields).

---

## 3. Data Service Pattern

The `SampleDataService` loads JSON seed data at startup and serves it in-memory.

```csharp
using System.Text.Json;

public class SampleDataService
{
    private readonly IWebHostEnvironment _env;

    public SampleDataService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public List<T> Load<T>(string fileName)
    {
        var path = Path.Combine(_env.ContentRootPath, "SeedData", fileName);
        if (!File.Exists(path))
            return new List<T>();

        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<List<T>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        }) ?? new List<T>();
    }
}
```

**Registration in `Program.cs`:**

```csharp
builder.Services.AddSingleton<SampleDataService>();
```

---

## 3b. Azure Data Backend Patterns

When the architecture includes a data service, use the patterns below instead of
`SampleDataService`. The app should still include `SeedData/` JSON files — these
are used to **seed the backend on first run** if the data store is empty.

### Azure Table Storage (`Azure.Data.Tables`)

```csharp
using Azure.Data.Tables;
using Azure.Identity;
using System.Text.Json;

public class TableStorageDataService
{
    private readonly TableServiceClient _serviceClient;
    private readonly IWebHostEnvironment _env;

    public TableStorageDataService(TableServiceClient serviceClient, IWebHostEnvironment env)
    {
        _serviceClient = serviceClient;
        _env = env;
    }

    public async Task<List<T>> GetAllAsync<T>(string tableName) where T : class, ITableEntity, new()
    {
        var tableClient = _serviceClient.GetTableClient(tableName);
        await tableClient.CreateIfNotExistsAsync();
        var entities = new List<T>();
        await foreach (var entity in tableClient.QueryAsync<T>())
        {
            entities.Add(entity);
        }
        return entities;
    }

    public async Task<T?> GetByIdAsync<T>(string tableName, string partitionKey, string rowKey) where T : class, ITableEntity, new()
    {
        var tableClient = _serviceClient.GetTableClient(tableName);
        try
        {
            var response = await tableClient.GetEntityAsync<T>(partitionKey, rowKey);
            return response.Value;
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public async Task SeedIfEmptyAsync<T>(string tableName, string seedFileName) where T : class, ITableEntity, new()
    {
        var tableClient = _serviceClient.GetTableClient(tableName);
        await tableClient.CreateIfNotExistsAsync();

        await foreach (var _ in tableClient.QueryAsync<T>(maxPerPage: 1))
        {
            return; // Table already has data
        }

        var path = Path.Combine(_env.ContentRootPath, "SeedData", seedFileName);
        if (!File.Exists(path)) return;

        var json = await File.ReadAllTextAsync(path);
        var items = JsonSerializer.Deserialize<List<T>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (items == null) return;

        foreach (var item in items)
        {
            await tableClient.UpsertEntityAsync(item);
        }
    }
}
```

**Registration in `Program.cs` (Table Storage):**

```csharp
var storageEndpoint = builder.Configuration["StorageAccountEndpoint"]
    ?? builder.Configuration["AZURE_STORAGE_ENDPOINT"]
    ?? throw new InvalidOperationException("Storage account endpoint not configured");

builder.Services.AddSingleton(new TableServiceClient(new Uri(storageEndpoint), new DefaultAzureCredential()));
builder.Services.AddSingleton<TableStorageDataService>();
```

**Model adaptation for Table Storage entities:**

Models must implement `ITableEntity`. Use `PartitionKey` + `RowKey` as the key:

```csharp
using Azure;
using Azure.Data.Tables;

public class ProductEntity : ITableEntity
{
    public string PartitionKey { get; set; } = "Products";
    public string RowKey { get; set; } = string.Empty; // Use Id.ToString()
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    public string Name { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public double UnitPrice { get; set; }
    public int StockQuantity { get; set; }
    public string Status { get; set; } = string.Empty;
}
```

### Azure SQL (`Microsoft.Data.SqlClient`)

```csharp
using Microsoft.Data.SqlClient;

public class SqlDataService
{
    private readonly string _connectionString;

    public SqlDataService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("SqlDb")
            ?? throw new InvalidOperationException("SQL connection string not configured");
    }

    public async Task<List<T>> QueryAsync<T>(string query, Func<SqlDataReader, T> map)
    {
        var results = new List<T>();
        await using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        await using var cmd = new SqlCommand(query, conn);
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            results.Add(map(reader));
        }
        return results;
    }
}
```

### Cosmos DB (`Microsoft.Azure.Cosmos`)

```csharp
using Microsoft.Azure.Cosmos;

public class CosmosDataService
{
    private readonly CosmosClient _client;
    private readonly string _databaseName;

    public CosmosDataService(CosmosClient client, IConfiguration config)
    {
        _client = client;
        _databaseName = config["CosmosDbName"] ?? "DemoDB";
    }

    public async Task<List<T>> GetAllAsync<T>(string containerName)
    {
        var container = _client.GetContainer(_databaseName, containerName);
        var query = container.GetItemQueryIterator<T>();
        var results = new List<T>();
        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();
            results.AddRange(response);
        }
        return results;
    }
}
```

### Connection Configuration via App Settings

The Bicep templates should output connection strings or endpoints as app settings.
The webapp reads them from `IConfiguration`:

```json
{
  "StorageAccountEndpoint": "https://{storageAccountName}.table.core.windows.net",
  "ConnectionStrings": {
    "SqlDb": "Server={server}.database.windows.net;Database={db};Authentication=Active Directory Default;"
  },
  "CosmosDbEndpoint": "https://{accountName}.documents.azure.com:443/",
  "CosmosDbName": "DemoDB"
}
```

> At runtime, `azd` populates these values from Bicep outputs via environment variables.

---

## 4. Program.cs Template

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddSingleton<SampleDataService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

app.UseStaticFiles();
app.UseRouting();
app.MapRazorPages();

app.Run();
```

---

## 5. Dockerfile Pattern (Container Targets)

Multi-stage build for minimal image size:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY *.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "{ProjectName}.Web.dll"]
```

`.dockerignore`:

```text
**/.git
**/.vs
**/bin
**/obj
**/node_modules
**/.idea
Dockerfile
.dockerignore
```

---

## 6. azd Service Wiring

### App Service Target

```yaml
name: tdd-azd-{project}
metadata:
  template: tddazd-{project}@1.0.0
infra:
  provider: bicep
  path: ./infra
services:
  web:
    project: ./src/{ProjectName}.Web
    host: appservice
    language: csharp
```

### Container Apps Target

```yaml
name: tdd-azd-{project}
metadata:
  template: tddazd-{project}@1.0.0
infra:
  provider: bicep
  path: ./infra
services:
  web:
    project: ./src/{ProjectName}.Web
    host: containerapp
    language: csharp
    docker:
      path: ./src/{ProjectName}.Web/Dockerfile
```

### AKS Target

```yaml
services:
  web:
    project: ./src/{ProjectName}.Web
    host: aks
    language: csharp
    docker:
      path: ./src/{ProjectName}.Web/Dockerfile
```

### ACI Target

```yaml
services:
  web:
    project: ./src/{ProjectName}.Web
    host: aci
    language: csharp
    docker:
      path: ./src/{ProjectName}.Web/Dockerfile
```

> [!IMPORTANT]
> The `host` field determines how `azd deploy` packages and deploys the app.
> For `appservice`, azd uses `dotnet publish` + zip deploy.
> For container hosts, azd builds the Docker image and pushes to ACR.

---

## 7. Razor Page Patterns

### Entity List Page

```csharp
// Pages/{Entity}/Index.cshtml.cs
public class IndexModel : PageModel
{
    private readonly SampleDataService _dataService;

    public IndexModel(SampleDataService dataService)
    {
        _dataService = dataService;
    }

    public List<{Entity}> Items { get; set; } = new();

    public void OnGet()
    {
        Items = _dataService.Load<{Entity}>("{entity}s.json");
    }
}
```

### Entity Details Page

```csharp
// Pages/{Entity}/Details.cshtml.cs
public class DetailsModel : PageModel
{
    private readonly SampleDataService _dataService;

    public DetailsModel(SampleDataService dataService)
    {
        _dataService = dataService;
    }

    public {Entity}? Item { get; set; }

    public IActionResult OnGet(int id)
    {
        var items = _dataService.Load<{Entity}>("{entity}s.json");
        Item = items.FirstOrDefault(x => x.Id == id);
        if (Item == null)
            return NotFound();
        return Page();
    }
}
```

---

## 8. Homepage Dashboard

The `Pages/Index.cshtml` should show a dashboard with:

- Project name and industry context
- Navigation cards for each entity type
- Quick stats (total counts per entity)
- A brief description of the demo scenario

---

## 9. Guardrails

- **DO**: Always use .NET 10 (`net10.0`)
- **DO**: Keep seed data realistic but fictional (no real PII)
- **DO**: Use 10-20 records per entity for meaningful demo data
- **DO**: Include `SeedData/` folder in published output (copy to output)
- **DO**: Validate with `dotnet build` before proceeding
- **DO**: Use the Azure data service SDK when the architecture includes a data endpoint
- **DO**: Prefer managed identity (`DefaultAzureCredential`) over connection strings with secrets
- **DO**: Seed the backend from JSON on first run when the data store is empty
- **DON'T**: Add authentication to the sample app (keep it simple for demos)
- **DON'T**: Use local JSON when a data endpoint is available in the architecture
- **DON'T**: Use Entity Framework — use the native SDK for each data service
- **DON'T**: Add unnecessary NuGet packages beyond the data service SDK
- **DON'T**: Include real personal data in seed files
- **DON'T**: Generate more than 4 entity types (keep demos focused)
