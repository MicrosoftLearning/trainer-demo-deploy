<#
.SYNOPSIS
    Deploy Azure Developer CLI (azd) projects from a JSON configuration file.

.DESCRIPTION
    This PowerShell script automates the deployment of multiple Azure Developer CLI (azd) projects.
    It reads project configurations from a JSON file, clones repositories, initializes azd environments,
    and deploys infrastructure and applications to Azure. The script tracks deployment status and 
    generates a summary report.

.PARAMETER JsonFilePath
    (Required) Path to the JSON file containing project configurations with source repositories and deployment settings.

.PARAMETER WorkingDirectory
    Directory where projects will be cloned and deployed. Default: "azd-deployments"

.PARAMETER AzureSubscription
    Azure subscription ID to use for deployments. Default: "498ab842-278f-45f8-ac5c-dc89061565cd"

.PARAMETER DefaultAzureRegion
    Default Azure region for deployments if not specified in JSON. Default: "eastus2"

.EXAMPLE
    .\deploy-azd-projects.ps1 -JsonFilePath ".\list_of_github_scenarios.json"

.EXAMPLE
    .\deploy-azd-projects.ps1 -JsonFilePath ".\list_of_github_scenarios.json" -WorkingDirectory "my-deployments" -DefaultAzureRegion "westus2"

.NOTES
    Prerequisites:
    - Azure CLI (az) must be installed and authenticated
    - Azure Developer CLI (azd) must be installed
    - Git must be installed
    - PowerShell 5.1 or later
    
    The script will:
    1. Read project configurations from the JSON file
    2. Clone each repository to the working directory
    3. Initialize azd environment with generated credentials
    4. Deploy infrastructure and application
    5. Update status in JSON file and generate summary report
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$JsonFilePath,
    
    [string]$WorkingDirectory = "azd-deployments",
    
    # Hardcoded values for test deployments
    [string]$AzureSubscription = "498ab842-278f-45f8-ac5c-dc89061565cd",
    [string]$DefaultAzureRegion = "eastus2"  # Fallback region if not specified in JSON
)

# Function to generate secure passwords
function New-SecurePassword {
    param(
        [int]$Length = 16
    )
    
    $characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*"
    $password = ""
    for ($i = 0; $i -lt $Length; $i++) {
        $password += $characters[(Get-Random -Maximum $characters.Length)]
    }
    return $password
}

# Function to update project status in JSON file
function Update-ProjectStatus {
    param(
        [string]$JsonFilePath,
        [string]$ProjectName,
        [string]$Status
    )
    
    try {
        # Read current JSON
        $jsonContent = Get-Content $JsonFilePath -Raw | ConvertFrom-Json
        
        # Find and update the project
        $project = $jsonContent.projects | Where-Object { $_.name -eq $ProjectName }
        if ($project) {
            $project.status = $Status
            
            # Write updated JSON back to file
            $jsonContent | ConvertTo-Json -Depth 10 | Out-File $JsonFilePath -Encoding UTF8
            Write-Host "Status updated to '$Status' for project: $ProjectName" -ForegroundColor Magenta
        } else {
            Write-Warning "Project '$ProjectName' not found in JSON file"
        }
    } catch {
        Write-Warning "Failed to update status for project '$ProjectName': $_"
    }
}

# Convert JsonFilePath to absolute path to avoid issues when changing directories
$JsonFilePath = (Resolve-Path $JsonFilePath).Path

# Read and parse the JSON file
$projects = Get-Content $JsonFilePath | ConvertFrom-Json

# Create working directory if it doesn't exist
if (!(Test-Path $WorkingDirectory)) {
    New-Item -ItemType Directory -Path $WorkingDirectory -Force | Out-Null
}

Write-Host "Working directory: $WorkingDirectory" -ForegroundColor Gray

# Set default subscription for the session
Write-Host "Setting Azure subscription to: $AzureSubscription" -ForegroundColor Cyan
az account set --subscription $AzureSubscription

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to set Azure subscription. Please check the subscription ID and ensure you're logged in."
    exit 1
}

# Create a passwords file in the working directory
$passwordsFile = "$WorkingDirectory\deployment-passwords.txt"
Write-Host "Passwords will be saved to: $passwordsFile" -ForegroundColor Gray

"Deployment Passwords - Generated on $(Get-Date)" | Out-File $passwordsFile -Force
"=" * 50 | Out-File $passwordsFile -Append

foreach ($project in $projects.projects) {
    # Skip projects that are not in 'planned' status
    $currentStatus = if ($project.status) { $project.status } else { "planned" }
    if ($currentStatus -ne "planned") {
        Write-Host "Skipping project: $($project.name) (Status: $currentStatus)" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "Processing project: $($project.name)" -ForegroundColor Green
    
    # Determine which region to use for this project
    $projectRegion = if ($project.region) { $project.region } else { $DefaultAzureRegion }
    Write-Host "Target region: $projectRegion" -ForegroundColor Cyan
    
    try {
        # Create project directory
        $projectPath = "$WorkingDirectory\$($project.name)"
        if (Test-Path $projectPath) {
            Write-Host "Directory already exists, removing..." -ForegroundColor Yellow
            Remove-Item $projectPath -Recurse -Force
        }
        
        New-Item -ItemType Directory -Path $projectPath -Force | Out-Null
        Push-Location $projectPath
        
        # Generate a unique environment name
        $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
        $environmentName = ($project.name -replace '[^a-zA-Z0-9]', '').Substring(0, [Math]::Min(($project.name -replace '[^a-zA-Z0-9]', '').Length, 6)) + (Get-Date -Format "MMdd")
        Write-Host "Using environment name: $environmentName" -ForegroundColor Gray
        
        # Step 1: azd init with environment name
        Write-Host "Initializing project with azd init..." -ForegroundColor Cyan
        
        if ($project.templateUrl) {
            # Initialize from template URL with environment name
            azd init --template $project.templateUrl --environment $environmentName --no-prompt
        } elseif ($project.gitUrl) {
            # Initialize from git repository with environment name
            azd init --template $project.gitUrl --environment $environmentName --no-prompt
        } else {
            throw "No template URL or git URL specified for $($project.name)"
        }
        
        if ($LASTEXITCODE -ne 0) {
            throw "azd init failed for $($project.name)"
        }
        
        # Set environment variables for this deployment using project-specific region
        Write-Host "Setting Azure region to: $projectRegion" -ForegroundColor Cyan
        azd env set AZURE_LOCATION $projectRegion
        azd env set AZURE_SUBSCRIPTION_ID $AzureSubscription
        
        # Generate and set common passwords that might be needed
        $adminPassword = New-SecurePassword -Length 20
        $dbPassword = New-SecurePassword -Length 16
        $apiKey = New-SecurePassword -Length 32
        
        Write-Host "Setting secure passwords..." -ForegroundColor Cyan
        
        # Common password environment variables that azd templates often use
        azd env set ADMIN_PASSWORD $adminPassword
        azd env set DATABASE_PASSWORD $dbPassword
        azd env set DB_PASSWORD $dbPassword
        azd env set SQL_PASSWORD $dbPassword
        azd env set POSTGRES_PASSWORD $dbPassword
        azd env set MYSQL_PASSWORD $dbPassword
        azd env set API_KEY $apiKey
        azd env set SECRET_KEY $apiKey
        azd env set JWT_SECRET $apiKey
        
        # Store passwords for reference - using relative path to working directory
        "" | Out-File "..\..\$passwordsFile" -Append
        "Project: $($project.name) ($environmentName)" | Out-File "..\..\$passwordsFile" -Append
        "Region: $projectRegion" | Out-File "..\..\$passwordsFile" -Append
        "Admin Password: $adminPassword" | Out-File "..\..\$passwordsFile" -Append
        "Database Password: $dbPassword" | Out-File "..\..\$passwordsFile" -Append
        "API Key: $apiKey" | Out-File "..\..\$passwordsFile" -Append
        "-" * 30 | Out-File "..\..\$passwordsFile" -Append
        
        # Optional: Set a unique resource group name to prevent conflicts
        $resourceGroupName = "rg-$($project.name)-$timestamp"
        azd env set AZURE_RESOURCE_GROUP_NAME $resourceGroupName
        Write-Host "Using resource group: $resourceGroupName" -ForegroundColor Gray
        
        # Step 2: Run azd up
        Write-Host "Running azd up in region $projectRegion..." -ForegroundColor Cyan
        azd up --no-prompt
        
        if ($LASTEXITCODE -ne 0) {
            throw "azd up failed for $($project.name)"
        }
        
        # Step 3: Verify deployment
        Write-Host "Verifying deployment..." -ForegroundColor Cyan
        $azdShow = azd show --output json | ConvertFrom-Json
        
        if ($azdShow.services) {
            Write-Host "✅ Deployment successful for $($project.name)" -ForegroundColor Green
            Update-ProjectStatus -JsonFilePath $JsonFilePath -ProjectName $project.name -Status "success"
            Write-Host "Environment: $environmentName" -ForegroundColor White
            Write-Host "Region: $projectRegion" -ForegroundColor White
            Write-Host "Services deployed:" -ForegroundColor White
            foreach ($service in $azdShow.services.PSObject.Properties) {
                $endpoint = if ($service.Value.endpoint) { $service.Value.endpoint } else { "No endpoint" }
                Write-Host "  - $($service.Name): $endpoint" -ForegroundColor Gray
            }
        } else {
            Write-Warning "⚠️  Deployment status unclear for $($project.name)"
            Update-ProjectStatus -JsonFilePath $JsonFilePath -ProjectName $project.name -Status "unclear"
        }
        
        # Show deployment details
        $azdEnv = azd env get-values --output json | ConvertFrom-Json
        Write-Host "Subscription: $($azdEnv.AZURE_SUBSCRIPTION_ID)" -ForegroundColor Gray
        Write-Host "Region: $($azdEnv.AZURE_LOCATION)" -ForegroundColor Gray
        Write-Host "Resource Group: $($azdEnv.AZURE_RESOURCE_GROUP_NAME)" -ForegroundColor Gray
        
    } catch {
        Write-Error "❌ Failed to process $($project.name): $_"
        Update-ProjectStatus -JsonFilePath $JsonFilePath -ProjectName $project.name -Status "failed"
    } finally {
        Pop-Location
    }
    
    Write-Host "----------------------------------------" -ForegroundColor Gray
}

Write-Host "All projects processed!" -ForegroundColor Green
Write-Host "Subscription used: $AzureSubscription" -ForegroundColor Yellow
Write-Host "Key: All passwords saved to: $passwordsFile" -ForegroundColor Yellow

# Summary of regions used
Write-Host "" -ForegroundColor White
Write-Host "Deployment Summary by Region:" -ForegroundColor Green
foreach ($project in $projects.projects) {
    $projectRegion = if ($project.region) { $project.region } else { $DefaultAzureRegion }
    Write-Host "  - $($project.name): $projectRegion" -ForegroundColor Gray
}

# Summary of deployment statuses
Write-Host "" -ForegroundColor White
Write-Host "Deployment Status Summary:" -ForegroundColor Green

# Create status log file in the main folder (where script is located)
$statusLogFile = "$PSScriptRoot\deployment-status-summary.txt"
"Deployment Status Summary - Generated on $(Get-Date)" | Out-File $statusLogFile -Force
"=" * 60 | Out-File $statusLogFile -Append
"" | Out-File $statusLogFile -Append

# Re-read the JSON to get updated statuses
$updatedProjects = Get-Content $JsonFilePath | ConvertFrom-Json
$statusCounts = @{}
$failedProjects = @()
$successfulProjects = @()

foreach ($project in $updatedProjects.projects) {
    $status = if ($project.status) { $project.status } else { "planned" }
    if ($statusCounts.ContainsKey($status)) {
        $statusCounts[$status]++
    } else {
        $statusCounts[$status] = 1
    }
    
    # Track specific projects for detailed reporting
    switch ($status) {
        "failed" { $failedProjects += $project.name }
        "success" { $successfulProjects += $project.name }
    }
}

"DEPLOYMENT STATUS COUNTS:" | Out-File $statusLogFile -Append
foreach ($status in $statusCounts.Keys) {
    $color = switch ($status) {
        "success" { "Green" }
        "failed" { "Red" }
        "planned" { "Yellow" }
        "unclear" { "Magenta" }
        default { "Gray" }
    }
    $statusLine = "  - ${status}: $($statusCounts[$status])"
    Write-Host $statusLine -ForegroundColor $color
    $statusLine | Out-File $statusLogFile -Append
}
"" | Out-File $statusLogFile -Append

if ($failedProjects.Count -gt 0) {
    Write-Host "" -ForegroundColor White
    Write-Host "Failed Deployments (require investigation):" -ForegroundColor Red
    "FAILED DEPLOYMENTS (require investigation):" | Out-File $statusLogFile -Append
    foreach ($failed in $failedProjects) {
        $failedLine = "  - $failed"
        Write-Host $failedLine -ForegroundColor Red
        $failedLine | Out-File $statusLogFile -Append
    }
    "" | Out-File $statusLogFile -Append
}

if ($successfulProjects.Count -gt 0) {
    Write-Host "" -ForegroundColor White
    Write-Host "Successful Deployments:" -ForegroundColor Green
    "SUCCESSFUL DEPLOYMENTS:" | Out-File $statusLogFile -Append
    foreach ($success in $successfulProjects) {
        $successLine = "  - $success"
        Write-Host $successLine -ForegroundColor Green
        $successLine | Out-File $statusLogFile -Append
    }
    "" | Out-File $statusLogFile -Append
}

Write-Host "" -ForegroundColor White
Write-Host "Status summary saved to: $statusLogFile" -ForegroundColor Cyan