/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export type Tag = {
  label: string;
  description: string;
  azureIcon?: string;
  darkModeAzureIcon?: string;
  url?: string;
  type?: string;
  courseblueprint?: string;
  courseblueprintdiag?: string;
};

export type User = {
  title: string;
  description: string;
  preview: string;
  website: string;
  author: string;
  source: string | null;
  demoguide: string | null;
  courseblueprint: string | null;
  tags: TagType[];
  cost: string;
  deploytime: string;
  prereqs: string;
};

// NN: Updated TagType to suit Static Web Apps
export type TagType =

// Special Tags
  | "msft"
  | "mct"
  | "new"
  | "hot"

// MOC Courses
  | "ai-102"
  | "ai-900"
  | "az-104"
  | "az-120"
  | "az-140"
  | "az-204"
  | "az-305"
  | "az-400"
  | "az-500"
  | "az-700"
  | "az-800"
  | "az-801"
  | "az-900"
  | "dp-100"
  | "dp-203"
  | "dp-300"
  | "dp-420"
  | "dp-900"
  | "sc-100"
  | "sc-200"
  | "sc-300"
  | "sc-900"


// Azure Services
  | "kubernetes"
  | "appservice"
  | "cosmosdb"
  | "azuredatafactory"
  | "monitor"
  | "keyvault"
  | "azurecontainerapps"
  | "aci"
  | "acr"
  | "mongodb"
  | "functions"
  | "blobstorage"
  | "azuredb-postgreSQL"
  | "azuresql"
  | "staticwebapps"
  | "servicebus"
  | "vnets"
  | "appinsights"
  | "loganalytics"
  | "aisearch"
  | "openai"
  | "azureai"
  | "apim"
  | "aks"
  | "azurecdn"
  | "frontdoor"
  | "rediscache"
  | "agw"
  | "azurebot"
  | "blazor"
  | "azuredb-mySQL"
  | "eventhub"
  | "azurestorage"
  | "azureappconfig"
  | "aistudio"
  | "apicenter"
  | "eventgrid"
  | "logicapps"
  | "speechservice"
  | "azureml"
  | "virtualmachine"
  | "sentinel"
  | "trafficmgr"
  | "purview"

;

// LIST OF AVAILABLE TAGS
// Each tag in lit about must have a defined object here
// One or more tags can be associated per card
// Tag Metadata:
//   - label = short name seen in tag
//   - description = explainer for usage
//   - type = type of tag
//   - azureIcon = svg path for azure service icon
//   - url = url for azure service
//   - darkModeAzureIcon = svg path for azure service icon in dark mode
export const Tags: { [type in TagType]: Tag } = {
  // =============     FOR ADMIN USE ONLY:

  // Special Tag
  msft: {
    label: "MTT Authored",
    description: "This tag is used for Microsoft Technical Trainer created templates.",
  },
  mct: {
    label: "MCT Authored",
    description: "This tag is used for Microsoft Certified Trainer created templates.",
  },
  new: {
    label: "New",
    description: "This tag is used for new templates.",
  },
  hot: {
    label: "hot",
    description: "This tag is used for hot templates.",
  },
 

  // ---- MOC Courses
  
  "ai-102": {
    label: "AI-102 Azure AI Engineer Associate",
    description: "Design and implement an Azure AI solution using Azure AI services, Azure AI Search, and Azure Open AI.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  
    },
    
  "ai-900": {
    label: "AI-900 Azure AI Fundamentals",
    description: "Demonstrate fundamental AI concepts related to the development of software and services of Microsoft Azure to create AI solutions.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-fundamentals-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },  
  "az-104": {
    label: "AZ-104 Azure Administrator",
    description: "Demonstrate key skills to configure, manage, secure, and administer key professional functions in Microsoft Azure.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/?practice-assessment-type=certification",
    courseblueprint: "https://aka.ms/AZ-104Blueprint",
    courseblueprintdiag: "https://courseblueprints.blob.core.windows.net/img/AZ-104.jpg?sp=r&st=2024-12-18T16:37:35Z&se=2025-07-01T23:37:35Z&spr=https&sv=2022-11-02&sr=b&sig=BvTw%2F8lvodlShflkzwtUe%2FelAQpEyY1CZ6EY6Vju95I%3D"
  },
  "az-120":{
    label: "AZ-120 Azure for SAP Workloads Specialty",
    description: "Demonstrate planning, migration, and operation of an SAP solution on Microsoft Azure while you leverage Azure resources.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-specialty-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-for-sap-workloads-specialty/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-140": {
    label: "AZ-140 Azure Virtual Desktop Specialty",
    description: "Plan, deliver, manage, and monitor virtual desktop experiences and remote apps on Microsoft Azure for any device.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-specialty-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-virtual-desktop-specialty/?practice-assessment-type=certification",
    courseblueprint: "https://aka.ms/AZ-140Blueprint",
    courseblueprintdiag: "https://courseblueprints.blob.core.windows.net/blueprints/AZ-140Blueprint.pdf?sp=r&st=2024-12-31T20:49:49Z&se=2025-07-02T03:49:49Z&spr=https&sv=2022-11-02&sr=b&sig=frB70N5UhTxm4tWN9kIVJDA%2B9LTvlupb4Ohhp4Co72c%3D",
  },

  "az-204": {
    label: "AZ-204 Azure Developer Associate",
    description: "Build end-to-end solutions in Microsoft Azure to create Azure Functions, implement and manage web apps, develop solutions utilizing Azure storage, and more.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/?practice-assessment-type=certification",
    courseblueprint: "https://aka.ms/AZ-204Blueprint",
    courseblueprintdiag: "https://courseblueprints.blob.core.windows.net/img/AZ-204.jpg?sp=r&st=2024-12-18T16:38:44Z&se=2025-07-01T23:38:44Z&spr=https&sv=2022-11-02&sr=b&sig=ySlKoSDxTAdzA5KEt5x5GiebjNbkvHARwsl6E6t9Pjk%3D"
  },
  "az-305": {
    label: "AZ-305 Azure Solutions Architect Expert",
    description: "Design solutions that run on Azure, including aspects like compute, network, storage, and security.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-expert-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect/",
    courseblueprint: "https://aka.ms/AZ-305Blueprint",
    courseblueprintdiag: "https://courseblueprints.blob.core.windows.net/img/AZ-305.jpg?sp=r&st=2024-12-18T16:39:14Z&se=2025-07-01T23:39:14Z&spr=https&sv=2022-11-02&sr=b&sig=XhagugPepjpY8FS6A%2BoqWkEXccUYY838kfVJGyU5frM%3D"
  
  },
  "az-400": {
    label: "AZ-400 Azure DevOps Engineer Expert",
    description: "Design, implement, and manage DevOps strategies for Microsoft Azure, including aspects like source control, continuous integration, continuous delivery, and more.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-expert-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/devops-engineer/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-500": {
    label: "AZ-500 Azure Security Engineer Associate",
    description: "Demonstrate the skills needed to implement security controls, maintain an organization’s security posture, and identify and remediate security vulnerabilities.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-security-engineer/?practice-assessment-type=certification",
    courseblueprint: "https://aka.ms/AZ-500Blueprint",
    courseblueprintdiag: "https://courseblueprints.blob.core.windows.net/blueprints/AZ-500_Blueprint.pdf?sp=r&st=2024-12-31T20:53:09Z&se=2025-07-02T03:53:09Z&spr=https&sv=2022-11-02&sr=b&sig=w7dBnLHMisSjomtus8Qgv7fri%2FiJrCrm5pxg1iY7yZ0%3D",
  },   

  "az-700": {
    label: "AZ-700 Azure Network Engineer Associate",
    description: "Demonstrate the design, implementation, and maintenance of Azure networking infrastructure, load balancing traffic, network routing, and more.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-network-engineer-associate/?practice-assessment-type=certification",
    courseblueprint: "https://aka.ms/AZ-700Blueprint",
    courseblueprintdiag: "https://courseblueprints.blob.core.windows.net/img/AZ-700.jpg?sp=r&st=2024-12-18T16:39:40Z&se=2025-07-01T23:39:40Z&spr=https&sv=2022-11-02&sr=b&sig=bptBO1h5wbO%2BujYDkSdh6vuSRBV51CFSHS4FP43Pqh8%3D",
  },
  "az-800":{
    label: "AZ-800 Windows Server Hybrid Administrator Associate",
    description: "Demonstrate the ability to implement, configure and manage Windows Server on-premises, hybrid, and infrastructure as a service (IaaS) platform workloads",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/windows-server-hybrid-administrator/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-801":{
    label: "AZ-801 Windows Server Hybrid Administrator Associate",
    description: "Demonstrate the ability to implement, configure and manage Windows Server on-premises, hybrid, and infrastructure as a service (IaaS) platform workloads",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/windows-server-hybrid-administrator/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },   
  "az-900": {
    label: "AZ-900 Azure Fundamentals",
    description: "Demonstrate foundational knowledge of cloud concepts, core Azure services, plus Azure management and governance features and tools.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-fundamentals-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },  
  "dp-100": {
    label: "DP-100 Azure Data Scientist Associate",
    description: "Manage data ingestion and preparation, model training and deployment, and machine learning solution monitoring with Python, Azure Machine Learning and MLflow.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-data-scientist/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-203": {
    label: "DP-203 Azure Data Engineer Associate",
    description: "Demonstrate understanding of common data engineering tasks to implement and manage data engineering workloads on Microsoft Azure, using a number of Azure services.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-data-engineer/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-300": {
    label: "DP-300 Azure Database Administrator Associate",
    description: "Administer an SQL Server database infrastructure for cloud, on-premises and hybrid relational databases using the Microsoft PaaS relational database offerings.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-database-administrator-associate/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-420": {
    label: "DP-420 Azure Cosmos DB Developer Specialty",
    description: "Write efficient queries, create indexing policies, manage, and provision resources in the SQL API and SDK with Microsoft Azure Cosmos DB.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-specialty-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-cosmos-db-developer-specialty/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-900": {
    label: "DP-900 AAzure Data Fundamentals",
    description: "Demonstrate foundational knowledge of core data concepts related to Microsoft Azure data services.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-fundamentals-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-data-fundamentals/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "sc-100":{
    label: "SC-100 Cybersecurity Architect Expert",
    description: "Demonstrate foundational knowledge of security, compliance, and identity across cloud-based and related Microsoft services.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-expert-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/cybersecurity-architect-expert/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "sc-200": {
    label: "SC-200 Microsoft Security Operations Analyst Associate",
    description: "Investigate, search for, and mitigate threats using Microsoft Sentinel, Microsoft Defender for Cloud, and Microsoft 365 Defender.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "sc-300":{
    label: "SC-300 Microsoft Identity and Access Administrator Associate",
    description: "Demonstrate the features of Microsoft Entra ID to modernize identity solutions, implement hybrid solutions, and implement identity governance.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/identity-and-access-administrator/?practice-assessment-type=certification",
    courseblueprint: "https://aka.ms/SC-300Blueprint",
    courseblueprintdiag: "https://courseblueprints.blob.core.windows.net/blueprints/SC-300_Blueprint.pdf?sp=r&st=2024-10-10T16:20:37Z&se=2025-07-02T00:20:37Z&spr=https&sv=2022-11-02&sr=b&sig=Q8NZNEY0oa96Olaeyuu8Wf1DeTJ77TJbUmesb6uSjZw%3D",
   },
  "sc-900":{
    label: "SC-900 Microsoft Security, Compliance, and Identity Fundamentals",
    description: "Demonstrate foundational knowledge of security, compliance, and identity across cloud-based and related Microsoft services.",
    type: "MOC Courses",
    azureIcon: "./img/microsoft-certified-fundamentals-badge.svg",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/security-compliance-and-identity-fundamentals/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },

  // ---- Database
  mongodb: {
    label: "MongoDB",
    description: "Template architecture uses MongoDB",
    type: "Database",
  },
  

 
  blazor: {
    label: "Blazor",
    description: "Template architecture uses Blazor",
    type: "Framework",
  },
  

  // ---- Platform
  kubernetes: {
    label: "Kubernetes",
    description: "Template architecture uses Kubernetes",
    type: "Platform",
  },


  

  // ---- Azure Services
  appinsights: {
    label: "Azure Application Insights",
    description: "Template architecture uses Azure Application Insights",
    azureIcon: "./img/Azure-Application-Insights.svg",
    url: "https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview",
    type: "Service",
  },
  azureml: {
    label: "Azure Machine Learning",
    description: "Template architecture uses Azure Machine Learning",
    azureIcon: "./img/Azure-Machine-Learning.svg",
    url: "https://learn.microsoft.com/en-us/azure/machine-learning/?view=azureml-api-2",
    type: "Service",
  },
  loganalytics: {
    label: "Azure Log Analytics",
    description: "Template architecture uses Azure Log Analytics",
    azureIcon: "./img/Azure-Log-Analytics.svg",
    url: "https://learn.microsoft.com/azure/azure-monitor/logs/log-analytics-overview",
    type: "Service",
  },
  appservice: {
    label: "Azure App Service",
    description: "Template architecture uses Azure App Service",
    azureIcon: "./img/Azure-App-Service.svg",
    url: "https://azure.microsoft.com/products/app-service",
    type: "Service",
  },
  monitor: {
    label: "Azure Monitor",
    description: "Template architecture uses Azure Monitor Service",
    azureIcon: "./img/Azure-Monitor.svg",
    url: "https://azure.microsoft.com/products/monitor",
    type: "Service",
  },
  keyvault: {
    label: "Azure Key Vault",
    description: "Template architecture uses Azure Key Vault",
    azureIcon: "./img/Azure-Key-Vault.svg",
    url: "https://azure.microsoft.com/products/key-vault",
    type: "Service",
  },
  azurecontainerapps: {
    label: "Azure Container Apps",
    description: "Template architecture uses Azure Container Apps",
    azureIcon: "./img/Azure-Container-Apps.svg",
    url: "https://azure.microsoft.com/products/container-apps",
    type: "Service",
  },
  aci: {
    label: "Azure Container Instance",
    description: "Template architecture uses Azure Container Instance",
    azureIcon: "./img/Azure-Container-Instance.svg",
    url: "https://azure.microsoft.com/en-us/products/container-instances/",
    type: "Service",
  },
  acr: {
    label: "Azure Container Registry",
    description: "Template architecture uses Azure Container Registry",
    azureIcon: "./img/Azure-Container-Registry.svg",
    url: "https://azure.microsoft.com/en-us/products/container-registry/",
    type: "Service",
  },
  cosmosdb: {
    label: "Azure CosmosDB",
    description: "Template architecture uses Azure CosmosDB",
    azureIcon: "./img/Azure-Cosmos-DB.svg",
    url: "https://azure.microsoft.com/products/cosmos-db/",
    type: "Service",
  },
  functions: {
    label: "Azure Functions",
    description: "Template architecture uses Azure Functions",
    azureIcon: "./img/Azure-Function.svg",
    url: "https://azure.microsoft.com/products/functions",
    type: "Service",
  },
  blobstorage: {
    label: "Azure Blob Storage",
    description: "Template architecture uses Azure Blob Storage",
    azureIcon: "./img/Azure-Storage.svg",
    url: "https://azure.microsoft.com/products/storage/blobs",
    type: "Service",
  },
  azuresql: {
    label: "Azure SQL",
    description: "Template architecture uses Azure SQL",
    azureIcon: "./img/Azure-SQL.svg",
    url: "https://azure.microsoft.com/products/azure-sql/database",
    type: "Database",
  },
  "azuredb-postgreSQL": {
    label: "Azure PostgreSQL",
    description: "Template architecture uses Azure Database for PostgreSQL",
    azureIcon: "./img/Azure-PostgreSQL.svg",
    url: "https://azure.microsoft.com/products/postgresql",
    type: "Database",
  },
  "azuredb-mySQL": {
    label: "Azure MySQL",
    description: "Template architecture uses Azure Database for MySQL",
    azureIcon: "./img/Azure-MySQL.svg",
    url: "https://azure.microsoft.com/products/mysql",
    type: "Database",
  },
  staticwebapps: {
    label: "Azure Static Web Apps",
    description: "Template architecture uses Azure Static Web Apps",
    azureIcon: "./img/Azure-Static-Web-Apps.svg",
    url: "https://azure.microsoft.com/products/app-service/static",
    type: "Service",
  },
  servicebus: {
    label: "Azure Service Bus",
    description: "Template architecture uses Azure Service Bus",
    azureIcon: "./img/Azure-Service-Bus.svg",
    url: "https://azure.microsoft.com/products/service-bus",
    type: "Service",
  },
  vnets: {
    label: "Azure Virtual Networks (VNET)",
    description: "Template architecture uses Azure Virtual Networks",
    azureIcon: "./img/Azure-Virtual-Networks.svg",
    url: "https://azure.microsoft.com/products/virtual-network",
    type: "Service",
  },
  aisearch: {
    label: "Azure AI Search",
    description: "Template architecture uses Azure AI Search",
    azureIcon: "./img/Azure-AI-Search.svg",
    url: "https://azure.microsoft.com/products/ai-services/ai-search",
    type: "Service",
  },
  openai: {
    label: "Azure OpenAI Service",
    description: "Template architecture uses Azure OpenAI Service",
    azureIcon: "./img/Azure-OpenAI-Service.svg",
    darkModeAzureIcon: "./img/Azure-OpenAI-Service-white.svg",
    url: "https://azure.microsoft.com/products/ai-services/openai-service",
    type: "Service",
  },
  azureai: {
    label: "Azure AI Service",
    description: "Template architecture uses Azure AI Service",
    azureIcon: "./img/Azure-AI-Service.svg",
    url: "https://azure.microsoft.com/solutions/ai",
    type: "Service",
  },
  speechservice: {
    label: "Azure Speech Services",
    description: "Template architecture uses Azure AI Speech Services",
    azureIcon: "./img/Azure-Speech-Services.svg",
    url: "https://azure.microsoft.com/en-us/products/ai-services/ai-speech",
    type: "Service",
  },
  apim: {
    label: "Azure API Management",
    description: "Template architecture uses Azure API Management",
    azureIcon: "./img/Azure-API-Management.svg",
    url: "https://azure.microsoft.com/products/api-management",
    type: "Service",
  },
  aks: {
    label: "Azure Kubernetes Service",
    description: "Template architecture uses Azure Kubernetes Service",
    azureIcon: "./img/Azure-Kubernetes-Service.svg",
    url: "https://azure.microsoft.com/products/kubernetes-service",
    type: "Service",
  },
  azurecdn: {
    label: "Azure Content Delivery Network",
    description: "Template architecture uses Azure Content Delivery Network",
    azureIcon: "./img/Azure-Front-Door-And-CDN.svg",
    url: "https://azure.microsoft.com/products/cdn",
    type: "Service",
  },
  frontdoor: {
    label: "Azure Front Door",
    description: "Template architecture uses Azure Front Door",
    azureIcon: "./img/Azure-Front-Door-And-CDN.svg",
    url: "https://azure.microsoft.com/products/frontdoor",
    type: "Service",
  },
  
  
  rediscache: {
    label: "Azure Cache for Redis",
    description: "Template architecture uses Azure Cache for Redis",
    azureIcon: "./img/Azure-Cache-for-Redis.svg",
    url: "https://azure.microsoft.com/products/cache",
    type: "Service",
  },
  agw: {
    label: "Azure Application Gateway",
    description: "Template architecture uses Azure Application Gateway",
    azureIcon: "./img/Azure-Application-Gateway.svg",
    url: "https://azure.microsoft.com/products/application-gateway",
    type: "Service",
  },
  azurebot: {
    label: "Azure AI Bot Service",
    description: "Template architecture uses Azure AI Bot Service",
    azureIcon: "./img/Azure-AI-Bot-Services.svg",
    url: "https://azure.microsoft.com/products/ai-services/ai-bot-service",
    type: "Service",
  },
  
  eventhub: {
    label: "Azure Event Hubs",
    description: "Template architecture uses Azure Event Hubs",
    azureIcon: "./img/Azure-Event-Hubs.svg",
    url: "https://azure.microsoft.com/products/event-hubs",
    type: "Service",
  },
  azurestorage: {
    label: "Azure Storage",
    description: "Template architecture uses Azure Storage",
    azureIcon: "./img/Azure-Storage.svg",
    url: "https://azure.microsoft.com/products/storage",
    type: "Service",
  },
  azureappconfig: {
    label: "Azure App Configuration",
    description: "Template architecture uses Azure App Configuration",
    azureIcon: "./img/Azure-App-Configuration.svg",
    url: "https://azure.microsoft.com/products/app-configuration",
    type: "Service",
  },
  aistudio: {
    label: "Azure AI Studio",
    description: "Template architecture uses Azure AI Studio",
    azureIcon: "./img/Azure-AI-Studio.svg",
    url: "https://azure.microsoft.com/products/ai-studio",
    type: "Service",
  },
  apicenter: {
    label: "Azure API Center",
    description: "Template architecture uses Azure API Center",
    azureIcon: "./img/Azure-API-Center.svg",
    url: "https://learn.microsoft.com/azure/api-center/overview",
    type: "Service",
  },
  eventgrid: {
    label: "Azure Event Grid",
    description: "Template architecture uses Azure Event Grid",
    azureIcon: "./img/Azure-Event-Grid.svg",
    url: "https://learn.microsoft.com/azure/event-grid/overview",
    type: "Service",
  },
  
  logicapps: {
    label: "Azure Logic Apps",
    description: "Template architecture uses Azure Logic Apps",
    azureIcon: "./img/Azure-Logic-Apps.svg",
    url: "https://learn.microsoft.com/azure/logic-apps/logic-apps-overview",
    type: "Service",
  },
  
  azuredatafactory: {
    label: "Azure Data Factory",
    description: "Template architecture uses Azure Data Factory",
    azureIcon: "./img/Azure-Data-Factory.svg",
    url: "https://learn.microsoft.com/azure/data-factory/introduction",
    type: "Service",
  },

  virtualmachine: {
    label: "Azure Virtual Machine",
    description: "Template architecture uses Azure Virtual Machine",
    azureIcon: "./img/Azure-Virtual-Machine.svg",
    url: "https://azure.microsoft.com/azure/virtual-machines",
    type: "Service",
  },

  sentinel: {
    label: "Azure Sentinel",
    description: "Template architecture uses Azure Sentinel",
    azureIcon: "./img/Microsoft-Sentinel.svg",
    url: "https://azure.microsoft.com/en-us/products/microsoft-sentinel/",
    type: "Service",
  },

  trafficmgr: {
    label: "Azure Traffic Manager",
    description: "Template architecture uses Azure Traffic Manager",
    azureIcon: "./img/trafficmgr.svg",
    url: "https://azure.microsoft.com/products/traffic-manager",
    type: "Service",
  },

  purview: {
    label: "Azure Purview",
    description: "Template architecture uses Azure Purview",
    azureIcon: "./img/Azure-Purview.svg",
    url: "https://azure.microsoft.com/products/purview",
    type: "Service",
  },


  
};
