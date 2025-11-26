<#
.SYNOPSIS
    Check Azure Bicep files for security control configurations in GitHub repositories.

.DESCRIPTION
    This PowerShell script scans multiple GitHub repositories to check for the presence of
    "SecurityControl: 'Ignore'" annotations in main.bicep files. It clones each repository,
    searches for main.bicep files, and reports whether security controls are being ignored.
    This helps maintain security compliance across Azure infrastructure-as-code templates.

.PARAMETER None
    This script does not accept parameters. Repository URLs are defined within the script.

.EXAMPLE
    .\check_security_control.ps1
    
    Runs the script to check all configured repositories for security control settings.

.NOTES
    Prerequisites:
    - Git must be installed and available in PATH
    - PowerShell 5.1 or later
    - Internet connectivity to clone GitHub repositories
    
    The script will:
    1. Create a temporary directory for repository clones
    2. Clone each repository from the configured list
    3. Search for main.bicep files
    4. Check for SecurityControl: 'Ignore' annotations
    5. Report findings for each repository
    6. Clean up temporary files
#>

# PowerShell script to check for SecurityControl: 'Ignore' in main.bicep files

# List of GitHub repositories
$repositories = @(
"https://github.com/petender/ConferenceAPI",
"https://github.com/petender/azd-apimwithconfAPI",
"https://github.com/petender/OpenAIMultiModel",
"https://github.com/rob-foulkrod/TollBooth",
"https://github.com/rob-foulkrod/BadgeMaker",
"https://github.com/rob-foulkrod/MachineLearningAZD",
"https://github.com/rob-foulkrod/IAAS2019",
"https://github.com/maartenvandiemen/AZD-ACI-Demo",
"https://github.com/maartenvandiemen/AZD-ACA-Demo",
"https://github.com/maartenvandiemen/AZD-AKS-Demo",
"https://github.com/petender/azd-fdcdn",
"https://github.com/maartenvandiemen/AZD-PaaS-Demo",
"https://github.com/true-while/event-hub-azd",
"https://github.com/petender/azd-hubspoke",
"https://github.com/petender/azd-site2sitevpn/",
"https://github.com/maartenvandiemen/AZD-WatermarkFunction",
"https://github.com/petender/azd-sentinel",
"https://github.com/petender/azd-trafficmgr",
"https://github.com/rob-foulkrod/purviewEnvironment-azd",
"https://github.com/sarahallali/azd-Privatelink-Pendpoint",
"https://github.com/koenraadhaedens/azd-nestedhv-dc-rtr",
"https://github.com/koenraadhaedens/AZD-WIN11-DEV-PC-DOCKER",
"https://github.com/koenraadhaedens/azd-infra-dev-containers",
"https://github.com/rob-foulkrod/tdd-functions-e2e-http-to-eventhubs",
"https://github.com/true-while/owasp-azd/",
"https://github.com/maartenvandiemen/azd-loadtest/",
"https://github.com/true-while/secure-data-solutions/",
"https://github.com/ronaldbosma/azure-integration-services-quickstart",
"https://github.com/petender/azd-storaccnt",
"https://github.com/daverendon/azd-deepseek-r1-on-azure-container-apps",
"https://github.com/petender/azd-youtubesummarizer-openai",
"https://github.com/petender/issdata",
"https://github.com/daverendon/azd-baseline-webapp",
"https://github.com/daverendon/azd-firewall",
"https://github.com/vincentk16/azd-vision-face",
"https://github.com/petender/azd-addsvm",
"https://github.com/petender/azd-sqlao",
"https://github.com/trainerkrunal/azd-vmwithlb",
"https://github.com/daverendon/azd-service-endpoints-and-securing-storage",
"https://github.com/daverendon/azd-intersite-connectivity",
"https://github.com/michelmsft/GoodFood/",
"https://github.com/maartenvandiemen/AZD-AppConfiguration",
"https://github.com/daverendon/azd-private-link",
"https://github.com/koenraadhaedens/azd-sqlworloadsim",
"https://github.com/SQLtattoo/azd-az104-all-in-one",
"https://github.com/petender/azd-ai-agent-service",
"https://github.com/petender/azd-foundrysora",
"https://github.com/kareldewinter/tdd-azd-monitor",
"https://github.com/rob-foulkrod/azd-apimwithconfAPI-OAuth",
"https://github.com/daverendon/azd-microsoft-sentinel",
"https://github.com/true-while/pg-ai-azd",
"https://github.com/ronaldbosma/protect-apim-with-oauth",
"https://github.com/ronaldbosma/call-apim-backend-with-oauth",
"https://github.com/ronaldbosma/call-apim-with-managed-identity",
"https://github.com/daverendon/azd-hardened-webapp",
"https://github.com/petender/azd-researcher",
"https://github.com/daverendon/azd-multiagent",
"https://github.com/passadis/azure-a2a-translation",
"https://github.com/koenraadhaedens/azd-firewall-send-syslog-messages"
)

# Directory to clone repositories
$cloneDirectory = "c:\temp\github_repos"

# Ensure the clone directory exists
if (-Not (Test-Path -Path $cloneDirectory)) {
    New-Item -ItemType Directory -Path $cloneDirectory
}

# List to store repositories with SecurityControl: 'Ignore'
$results = @()

# List to store repositories without SecurityControl: 'Ignore'
$noTagResults = @()

# Function to check for SecurityControl: 'Ignore'
function Test-SecurityControl {
    param (
        [string]$FilePath
    )

    $content = Get-Content -Path $FilePath
    # Updated regex to match both variations of the SecurityControl tag
    if ($content -match "SecurityControl:\s*'Ignore'" -or $content -match "'SecurityControl':\s*'Ignore'") {
        return $true
    }
    return $false
}

# Process each repository
foreach ($repo in $repositories) {
    Write-Host "Processing $repo..."

    # Extract repository name
    $repoName = ($repo -split '/')[4]
    $localPath = Join-Path -Path $cloneDirectory -ChildPath $repoName

    # Clone the repository
    if (-Not (Test-Path -Path $localPath)) {
        git clone $repo $localPath
    }

    # Check for infra/main.bicep
    $bicepFile = Join-Path -Path $localPath -ChildPath "infra\main.bicep"
    if (Test-Path -Path $bicepFile) {
        Write-Host "Found main.bicep in $repoName. Checking for SecurityControl: 'Ignore'..."

        if (Test-SecurityControl -FilePath $bicepFile) {
            Write-Host "SecurityControl: 'Ignore' found in $repoName."
            $results += $repo
        } else {
            Write-Host "SecurityControl: 'Ignore' NOT found in $repoName."
            $noTagResults += $repo
        }
    } else {
        Write-Host "main.bicep not found in $repoName."
        $noTagResults += $repo
    }
}

# Output results with totals
Write-Host "Repositories with SecurityControl: 'Ignore':"
$results | ForEach-Object { Write-Host $_ }
Write-Host "Total: $($results.Count)"

Write-Host "Repositories without SecurityControl: 'Ignore':"
$noTagResults | ForEach-Object { Write-Host $_ }
Write-Host "Total: $($noTagResults.Count)"

# Save results to files with totals
$results | Out-File -FilePath "c:\temp\security_control_results_with_tag.txt" -Encoding UTF8
Add-Content -Path "c:\temp\security_control_results_with_tag.txt" -Value "Total: $($results.Count)"

$noTagResults | Out-File -FilePath "c:\temp\security_control_results_without_tag.txt" -Encoding UTF8
Add-Content -Path "c:\temp\security_control_results_without_tag.txt" -Value "Total: $($noTagResults.Count)"

Write-Host "Results saved to c:\temp\security_control_results_with_tag.txt and c:\temp\security_control_results_without_tag.txt"