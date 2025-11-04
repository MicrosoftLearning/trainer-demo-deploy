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


// ILT Courses
  | "ai-102"
  | "ai-3002"
  | "ai-3003"
  | "ai-3004"
  | "ai-3016"
  | "ai-3019"
  | "ai-3022"
  | "ai-3026"
  | "ai-900"
  | "az-104"
  | "az-1002"
  | "az-1003"
  | "az-1004"
  | "az-1006"
  | "az-1007"
  | "az-1008"
  | "az-1010"
  | "az-120"
  | "az-140"
  | "az-2001"
  | "az-2003"
  | "az-2005"
  | "az-2006"
  | "az-2008"
  | "az-2010"
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
  | "dp-3001"
  | "dp-3011"
  | "dp-3014"
  | "dp-3015"
  | "dp-3020"
  | "dp-3021"
  | "dp-3028"
  | "dp-3029"
  | "dp-420"
  | "dp-601"
  | "dp-602"
  | "dp-603"
  | "dp-604"
  | "dp-700"
  | "dp-900"
  | "sc-100"
  | "sc-200"
  | "sc-300"
  | "sc-5001"
  | "sc-5002"
  | "sc-5003"
  | "sc-5004"
  | "sc-5006"
  | "sc-5007"
  | "sc-5008"
  | "sc-900"
  

  // Frameworks
  | "dotnet"
  | "nodejs"
  | "python"
  | "semantic-kernel"
  | "blazor"


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
  | "azurebot"
  | "azuredb-mySQL"
  | "eventhub"
  | "azurestorage"
  | "azureappconfig"
  | "aifoundry"
  | "apicenter"
  | "eventgrid"
  | "logicapps"
  | "speechservice"
  | "azureml"
  | "virtualmachine"
  | "sentinel"
  | "trafficmgr"
  | "purview"
  | "vpngw"
  | "azurearc"
  | "loadtesting"
  | "fabric"
  | "azurefirewall"
  | "bastion"
  | "vmsqlserver"
  | "avset"
  | "appgateway"
  | "privateendpoint"
  | "privatelink"
  | "loadbalancer"
 



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
 

  // ---- ILT Courses
  
  "ai-102": {
    label: "AI-102 Azure AI Engineer Associate",
    description: "Design and implement an Azure AI solution using Azure AI services, Azure AI Search, and Azure Open AI.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-ai-engineer/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "ai-3002": {
    label: "AI-3002 Develop AI information extraction solutions in Azure",
    description: "Use Azure AI to extract information from content to support scenarios like data capture, business process automation, meeting summarization and analysis, digital asset management (DAM), and knowledge mining",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/ai-extract-information/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "ai-3003": {
    label: "AI-3003 Develop natural language solutions in Azure​",
    description: "Natural language solutions use language models to interpret the semantic meaning of written or spoken language, and in some cases respond based on that meaning. You can use the Language service to build language models for your applications, and explore Azure AI Foundry to use generative models for speech.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/develop-language-solutions-azure-ai/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "ai-3004": {
    label: "AI-3004 Develop computer vision solutions in Azure",
    description: "Computer vision is an area of artificial intelligence that deals with visual perception. Azure AI includes multiple services that support common computer vision scenarios.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/create-computer-vision-solutions-azure-ai/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "ai-3016": {
    label: "AI-3016 Develop generative AI apps in Azure",
    description: "Generative Artificial Intelligence (AI) is becoming more accessible through comprehensive development platforms like Azure AI Foundry. Learn how to build generative AI applications that use language models to chat with your users.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/create-custom-copilots-ai-studio/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "ai-3019": {
    label: "AI-3019 Build AI Apps with Azure Database for PostgreSQL",
    description: "This learning path explores how the Azure AI and Azure Machine Learning Services integrations provided by the Azure AI extension for Azure Database for PostgreSQL",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/build-ai-apps-azure-database-postgresql/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "ai-3022": {
    label: "AI-3022 Implement knowledge mining with Azure AI Search",
    description: "Do you have information locked up in structured and unstructured data sources? Using Azure AI Search, you can extract key insights from this data, and enable applications to search and analyze them.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/implement-knowledge-mining-azure-cognitive-search/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "ai-3026": {
    label: "AI-3026 Develop AI agents on Azure",
    description: "This learning path will help you understand the AI agents, including when to use them and how to build them, using Azure AI Foundry Agent Service and Microsoft Agent Framework.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/develop-ai-agents-on-azure/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "ai-900": {
    label: "AI-900 Azure AI Fundamentals",
    description: "Demonstrate fundamental AI concepts related to the development of software and services of Microsoft Azure to create AI solutions.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-fundamentals-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-ai-fundamentals/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-104": {
    label: "AZ-104 Azure Administrator",
    description: "Demonstrate key skills to configure, manage, secure, and administer key professional functions in Microsoft Azure.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-administrator/?practice-assessment-type=certification",
    courseblueprint: "https://aka.ms/AZ-104Blueprint",
    courseblueprintdiag: "https://courseblueprints.blob.core.windows.net/img/AZ-104.jpg"
  },
  "az-1002": {
    label: "AZ-1002 Configure secure access to your workloads using networking with Azure Virtual Network",
    description: "In this learning path, you practice configuring secure access to workloads using Azure networking.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/configure-secure-workloads-using-azure-virtual-networking/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-1003": {
    label: "AZ-1003 Secure storage for Azure Files and Azure Blob Storage",
    description: "In this learning path, you practice storing business data securely by using Azure Blob Storage and Azure Files. The skills validated include creating storage accounts, storage containers, and file shares. Also, configuring encryption and networking to improve the security posture.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/implement-storage-azure-files-azure-blob-storage/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-1004": {
    label: "AZ-1004 Deploy and configure Azure Monitor",
    description: "In this learning path, you practice implementing Azure Monitor to collect, analyze and act on monitoring telemetry from Azure environments. You learn to configure and interpret monitoring for virtual machines, networking, and web applications.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/deploy-configure-azure-monitor/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-1006": {
    label: "AZ-1006 Migrate and Modernize SAP in the Microsoft Cloud",
    description: "This 1-day course teaches IT professionals who have experience with SAP solutions how to use Azure resources that include setting up and configuration of SAP environments in Azure for virtual machines, virtual networks, storage accounts, and Microsoft Entra ID.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/courses/az-1006",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-1007": {
    label: "AZ-1007 Deploy and administer Linux virtual machines on Azure",
    description: "In this learning path, you prepare for the Applied Skill, Deploy and administer Linux virtual machines on Microsoft Azure.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/deploy-administer-linux-virtual-machines-azure/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-1008": {
    label: "AZ-1008 Administer Active Directory Domain Services",
    description: "This learning path helps prepare you for the APL-1008 Administer Active Directory Domain Services modern credential. You'll learn how to create, deploy, and maintain an Active Directory Domain Services environment.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/administer-active-directory-domain-services/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-1010": {
    label: "AZ-1010 Deploy and manage Azure Arc-enabled Servers",
    description: "In this learning path, you're introduced to Azure Arc-enabled servers. You'll cover Arc-enabled server deployment, updates to Arc-enabled servers using Azure Update Manager and configuring Microsoft Defender for Cloud for Azure Arc-enabled servers.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/deploy-manage-azure-arc-enabled-servers/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-120":{
    label: "AZ-120 Azure for SAP Workloads Specialty",
    description: "Demonstrate planning, migration, and operation of an SAP solution on Microsoft Azure while you leverage Azure resources.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-specialty-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-for-sap-workloads-specialty/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-140": {
    label: "AZ-140 Azure Virtual Desktop Specialty",
    description: "Plan, deliver, manage, and monitor virtual desktop experiences and remote apps on Microsoft Azure for any device.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-specialty-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-virtual-desktop-specialty/?practice-assessment-type=certification",
    courseblueprint: "https://aka.ms/AZ-140Blueprint",
    courseblueprintdiag: "https://courseblueprints.blob.core.windows.net/img/AZ-140.jpg",
  },
  "az-2001": {
    label: "AZ-2001 Implement security through a pipeline using Azure DevOps",
    description: "This learning path helps you prepare for the Implement security through a pipeline assessment using Azure DevOps. Learn how to configure and secure Azure Pipelines.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/implement-security-through-pipeline-using-devops/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-2003": {
    label: "AZ-2003 Deploy cloud-native apps using Azure Container Apps",
    description: "Develop the skills necessary to configure a secure deployment solution for cloud-native apps. Learn how to build, deploy, scale, and manage containerized cloud-native apps using Azure Container Apps, Azure Container Registry, and Azure Pipelines.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/deploy-cloud-native-applications-to-azure-container-apps/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-2005": {
    label: "AZ-2005 Develop Generative AI solutions using Azure OpenAI and the Semantic Kernel SDK",
    description: "Learn how to use the Semantic Kernel SDK to build intelligent applications that automate tasks and perform natural language processing.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/develop-ai-agents-azure-open-ai-semantic-kernel-sdk/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-2006": {
    label: "AZ-2006 Automate Azure Load Testing by using GitHub Actions",
    description: "Learn how to implement GitHub Actions and configure Azure Load Testing to automate testing app deployments.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/automate-azure-load-testing-github/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-2008": {
    label: "AZ-2008 DevOps Foundations: The Core Principles and Practices",
    description: "Explore DevOps practices using GitHub. Your development and operations teams will experience improved collaboration, agility, continuous integration, continuous delivery, automation, and operational excellence throughout all phases of the application lifecycle.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/devops-foundations-core-principles-practices/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-2010": {
    label: "AZ-2010 Designing and Implementing Platform Engineering",
    description: "This learning path provides a comprehensive guide to designing and implementing platform engineering within modern enterprises. It covers the foundational principles, strategic alignment with business goals, and the practical aspects of building scalable, secure, and future-proof platforms.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/designing-implementing-platform-engineering/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-204": {
    label: "AZ-204 Azure Developer Associate",
    description: "Build end-to-end solutions in Microsoft Azure to create Azure Functions, implement and manage web apps, develop solutions utilizing Azure storage, and more.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-developer/?practice-assessment-type=certification",
    courseblueprint: "https://aka.ms/AZ-204Blueprint",
    courseblueprintdiag: "https://courseblueprints.blob.core.windows.net/img/AZ-204.jpg"
  },
  "az-305": {
    label: "AZ-305 Azure Solutions Architect Expert",
    description: "Design solutions that run on Azure, including aspects like compute, network, storage, and security.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-expert-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-solutions-architect/",
    courseblueprint: "https://aka.ms/AZ-305Blueprint",
    courseblueprintdiag: "https://courseblueprints.blob.core.windows.net/img/AZ-305.jpg"
  
  },
  "az-400": {
    label: "AZ-400 Azure DevOps Engineer Expert",
    description: "Design, implement, and manage DevOps strategies for Microsoft Azure, including aspects like source control, continuous integration, continuous delivery, and more.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-expert-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/devops-engineer/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-500": {
    label: "AZ-500 Azure Security Engineer Associate",
    description: "Demonstrate the skills needed to implement security controls, maintain an organization’s security posture, and identify and remediate security vulnerabilities.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-security-engineer/?practice-assessment-type=certification",
    courseblueprint: "https://aka.ms/AZ-500Blueprint",
    courseblueprintdiag: "https://courseblueprints.blob.core.windows.net/img/AZ-500.jpg",
  },
  "az-700": {
    label: "AZ-700 Azure Network Engineer Associate",
    description: "Demonstrate the design, implementation, and maintenance of Azure networking infrastructure, load balancing traffic, network routing, and more.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-network-engineer-associate/?practice-assessment-type=certification",
    courseblueprint: "https://aka.ms/AZ-700Blueprint",
    courseblueprintdiag: "https://courseblueprints.blob.core.windows.net/img/AZ-700.jpg",
  },
  "az-800":{
    label: "AZ-800 Windows Server Hybrid Administrator Associate",
    description: "Demonstrate the ability to implement, configure and manage Windows Server on-premises, hybrid, and infrastructure as a service (IaaS) platform workloads",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/windows-server-hybrid-administrator/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "az-801":{
    label: "AZ-801 Windows Server Hybrid Administrator Associate",
    description: "Demonstrate the ability to implement, configure and manage Windows Server on-premises, hybrid, and infrastructure as a service (IaaS) platform workloads",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/windows-server-hybrid-administrator/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },   
  "az-900": {
    label: "AZ-900 Azure Fundamentals",
    description: "Demonstrate foundational knowledge of cloud concepts, core Azure services, plus Azure management and governance features and tools.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-fundamentals-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-fundamentals/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },  
  "dp-100": {
    label: "DP-100 Azure Data Scientist Associate",
    description: "Manage data ingestion and preparation, model training and deployment, and machine learning solution monitoring with Python, Azure Machine Learning and MLflow.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-data-scientist/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-203": {
    label: "DP-203 Azure Data Engineer Associate",
    description: "Demonstrate understanding of common data engineering tasks to implement and manage data engineering workloads on Microsoft Azure, using a number of Azure services.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-data-engineer/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-300": {
    label: "DP-300 Azure Database Administrator Associate",
    description: "Administer an SQL Server database infrastructure for cloud, on-premises and hybrid relational databases using the Microsoft PaaS relational database offerings.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-database-administrator-associate/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-3001": {
    label: "DP-3001 Migrate SQL Server workload to Azure SQL",
    description: "This learning path prepares you for the task of migrating SQL Server workloads to Azure SQL. You'll learn how to assess SQL Server components and compatibility for migration using the Azure SQL Migration Extension and Database Migration Assistant.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/migrate-sql-workloads-azure/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-3011": {
    label: "DP-3011 Implement a Data Analytics Solution with Azure Databricks",
    description: "By the end of this learning path, you'll have built solid intermediate to advanced skills in both Databricks and Spark on Azure. You're able to ingest, transform, and analyze large-scale datasets using Spark DataFrames, Spark SQL, and PySpark, giving you confidence in working with distributed data processing.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/data-engineer-azure-databricks/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-3014": {
    label: "DP-3014 Build machine learning solutions using Azure Databricks",
    description: "Azure Databricks is a cloud-scale platform for data analytics and machine learning. Data scientists and machine learning engineers can use Azure Databricks to implement machine learning solutions at scale.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/build-operate-machine-learning-solutions-azure-databricks/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-3015": {
    label: "DP-3015 Getting Started with Cosmos DB NoSQL Development",
    description: "This course teaches developers to utilize Azure Cosmos DB for NoSQL API and SDK. Students will learn query execution, resource configuration, SDK operations, and design strategies for non-relational data modeling and data partitioning.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/courses/dp-3015",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-3020": {
    label: "DP-3020 Develop data-driven applications with Azure SQL Database",
    description: "This learning path prepares you for the task of developing data-driven applications by using Microsoft Azure SQL Database. You'll learn how to create and configure an Azure SQL Database, build and deploy database projects using GitHub Actions and Azure Pipelines, and automate the publishing process.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/develop-data-driven-app-sql-db/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-3021": {
    label: "DP-3021 Configure and migrate to Azure Database for PostgreSQL",
    description: "In this learning path, you learn the main features of PostgreSQL and how they work in Azure Database for PostgreSQL. You learn about the different Azure Database for PostgreSQL implementation options, and how to configure a server for your needs.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/microsoft-learn-azure-database-for-postgresql/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-3028": {
    label: "DP-3028 Implement Generative AI engineering with Azure Databricks",
    description: "Generative AI engineering with Azure Databricks uses the platform's capabilities to explore, fine-tune, evaluate, and integrate advanced language models. By using Apache Spark's scalability and Azure Databricks' collaborative environment, you can design complex AI systems.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/implement-generative-ai-engineering-azure-databricks/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-3029": {
    label: "DP-3029 Work smarter with Copilot in Microsoft Fabric",
    description: "Explore how to work smarter with Copilot in Microsoft Fabric. Learn how to integrate, transform, store data, and create insightful reports using Copilot in Microsoft Fabric.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/work-smarter-with-copilot-in-microsoft-fabric/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-420": {
    label: "DP-420 Azure Cosmos DB Developer Specialty",
    description: "Write efficient queries, create indexing policies, manage, and provision resources in the SQL API and SDK with Microsoft Azure Cosmos DB.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-specialty-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-cosmos-db-developer-specialty/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-601": {
    label: "DP-601 Implement a Lakehouse with Microsoft Fabric",
    description: "This learning path introduces the foundational components of implementing a data lakehouse with Microsoft Fabric.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/implement-lakehouse-microsoft-fabric/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-602": {
    label: "DP-602 Implement a Data Warehouse with Microsoft Fabric",
    description: "Explore the data warehousing process and learn how to load, monitor, secure, and query a warehouse in Microsoft Fabric.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/work-with-data-warehouses-using-microsoft-fabric/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-603": {
    label: "DP-603 Fabrid Data Engineer Associate",
    description: "Design and implement data storage solutions, data processing, and data security solutions using Microsoft Azure.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/fabric-analytics-engineer-associate/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-604": {
    label: "DP-604 Implement a data science and machine learning solution for AI with Microsoft Fabric",
    description: "Explore the data science process and learn how to train machine learning models to accomplish artificial intelligence in Microsoft Fabric.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/implement-data-science-machine-learning-fabric/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "dp-700": {
  label: "DP-700 Fabric Data Engineer Associate",
    description: "Prepare data for analysis, model data, visualize data, analyze data, and deploy solutions using Microsoft Power BI.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/fabric-data-engineer-associate/",
    courseblueprint: "",
    courseblueprintdiag: ""
  },
  "dp-900": {
    label: "DP-900 Azure Data Fundamentals",
    description: "Demonstrate foundational knowledge of core data concepts related to Microsoft Azure data services.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-fundamentals-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/azure-data-fundamentals/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "sc-100":{
    label: "SC-100 Cybersecurity Architect Expert",
    description: "Demonstrate foundational knowledge of security, compliance, and identity across cloud-based and related Microsoft services.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-expert-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/cybersecurity-architect-expert/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "sc-200": {
    label: "SC-200 Microsoft Security Operations Analyst Associate",
    description: "Investigate, search for, and mitigate threats using Microsoft Sentinel, Microsoft Defender for Cloud, and Microsoft 365 Defender.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/security-operations-analyst/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "sc-300":{
    label: "SC-300 Microsoft Identity and Access Administrator Associate",
    description: "Demonstrate the features of Microsoft Entra ID to modernize identity solutions, implement hybrid solutions, and implement identity governance.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-associate-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/identity-and-access-administrator/?practice-assessment-type=certification",
    courseblueprint: "https://aka.ms/SC-300Blueprint",
    courseblueprintdiag: "https://courseblueprints.blob.core.windows.net/blueprints/SC-300_Blueprint.pdf?sp=r&st=2024-10-10T16:20:37Z&se=2025-07-02T00:20:37Z&spr=https&sv=2022-11-02&sr=b&sig=Q8NZNEY0oa96Olaeyuu8Wf1DeTJ77TJbUmesb6uSjZw%3D",
  },
  "sc-5001": {
    label: "SC-5001 Configure SIEM security operations using Microsoft Sentinel",
    description: "Get started with Microsoft Sentinel security operations by configuring the Microsoft Sentinel workspace, connecting Microsoft services and Windows security events to Microsoft Sentinel, configuring Microsoft Sentinel analytics rules, and responding to threats with automated responses.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/configure-security-information-event-management-operations-using-microsoft-sentinel/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "sc-5002": {
    label: "SC-5002: Secure Azure services and workloads with Microsoft Defender for Cloud regulatory compliance controls",
    description: "This learning path guides you in securing Azure services and workloads using Microsoft Cloud Security Benchmark controls in Microsoft Defender for Cloud via the Azure portal.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/secure-azure-services-workloads-defender-cloud/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "sc-5003": {
    label: "SC-5003: Implement information protection and data loss prevention by using Microsoft Purview",
    description: "Gain the skills to use Microsoft Purview to improve your data security in Microsoft 365. In this training, you learn how to create sensitive information types, create sensitivity labels, and use auto-labeling policies based on these labels. You also learn how to set up DLP (Data Loss Prevention) policies to safeguard your organization's data.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/purview-implement-information-protection-data-loss-prevention/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "sc-5004": {
    label: "SC-5004 Defend against cyberthreats with Microsoft Defender XDR",
    description: "Implement the Microsoft Defender for Endpoint environment to manage devices, perform investigations on endpoints, manage incidents in Defender XDR, and use Advanced Hunting with Kusto Query Language (KQL) to detect unique threats.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/sc-5004-defend-against-cyberthreats-defender/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "sc-5006": {
    label: "SC-5006 Enhance security operations by using Microsoft Security Copilot",
    description: "Learn about Microsoft Security Copilot, an AI-powered security analysis tool that enables analysts to process security signals and respond to threats at a machine speed, and the AI concepts upon which it's built.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/security-copilot-and-ai/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "sc-5007": {
    label: "SC-5007 Implement retention, eDiscovery, and Communication compliance in Microsoft Purview",
    description: "Manage data lifecycle, records management, eDiscovery, and communication compliance with Microsoft Purview.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/purview-implement-retention-ediscovery-communication-compliance/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "sc-5008": {
    label: "SC-5008 Configure and govern entitlement with Microsoft Entra ID",
    description: "Use Microsoft Entra to manage access by using entitlements, access reviews, privileged access tools, and monitor access events.",
    type: "ILT Courses",
    azureIcon: "./img/applied-skill.svg",
    url: "https://learn.microsoft.com/en-us/training/paths/configure-manage-entitlement-microsoft-entra-id/",
    courseblueprint: "",
    courseblueprintdiag: "",
  },
  "sc-900":{
    label: "SC-900 Microsoft Security, Compliance, and Identity Fundamentals",
    description: "Demonstrate foundational knowledge of security, compliance, and identity across cloud-based and related Microsoft services.",
    type: "ILT Courses",
    azureIcon: "./img/microsoft-certified-fundamentals-badge.svg",
    url: "https://learn.microsoft.com/credentials/certifications/security-compliance-and-identity-fundamentals/?practice-assessment-type=certification",
    courseblueprint: "",
    courseblueprintdiag: "",
  },

  // ---- Database
  mongodb: {
    label: "MongoDB",
    description: "Template architecture uses MongoDB",
    type: "Database",
  },
  
  // ---- Framework
  "semantic-kernel": {
    label: "Semantic Kernel",
    description: "Template architecture uses Semantic Kernel",
    type: "Framework",
  },
 
  blazor: {
    label: "Blazor",
    description: "Template architecture uses Blazor",
    type: "Framework",
  },

  python: {
    label: "Python",
    description: "Template architecture uses Python",
    type: "Framework",
  },

  nodejs: {
    label: "Node.js",
    description: "Template architecture uses Node.js",
    type: "Framework",
  },

  dotnet: {
    label: ".NET",
    description: "Template architecture uses .NET",
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
    url: "https://learn.microsoft.com/azure/machine-learning/?view=azureml-api-2",
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
    url: "https://azure.microsoft.com/products/container-instances/",
    type: "Service",
  },
  acr: {
    label: "Azure Container Registry",
    description: "Template architecture uses Azure Container Registry",
    azureIcon: "./img/Azure-Container-Registry.svg",
    url: "https://azure.microsoft.com/products/container-registry/",
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
    url: "https://azure.microsoft.com/products/ai-services/ai-speech",
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
    label: "Azure Storage Account",
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
  aifoundry: {
    label: "Azure AI Foundry",
    description: "Template architecture uses Azure AI Foundry",
    azureIcon: "./img/Azure-AI-Studio.svg",
    url: "https://azure.microsoft.com/products/ai-foundry",
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
    url: "https://azure.microsoft.com/products/microsoft-sentinel/",
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

  vpngw: {
    label: "Azure VPN Gateway",
    description: "Template architecture uses Azure VPN Gateway",
    azureIcon: "./img/Azure-VPN-GW.svg",
    url: "https://azure.microsoft.com/products/vpn-gateway",
    type: "Service",
  },

  azurearc: {
    label: "Azure ARC",
    description: "Template architecture for Azure ARC",
    azureIcon: "./img/Azure-Arc-VM.svg",
    url: "hhttps://azure.microsoft.com/products/azure-arc",
    type: "Service",
  },

  loadtesting: {
    label: "Azure Load Testing",
    description: "Template architecture for Azure Load Testing",
    azureIcon: "./img/Azure-Load-Testing.svg",
    url: "https://azure.microsoft.com/products/load-testing",
    type: "Service", 
  },

  fabric: {
    label: "Microsoft Fabric",
    description: "Template architecture for Azure Fabric",
    azureIcon: "./img/Azure-Fabric.png",
    url: "https://www.microsoft.com/microsoft-fabric",
    type: "Service", 
  },

  azurefirewall: {
    label: "Azure Firewall",
    description: "Template architecture for Azure Firewall",
    azureIcon: "./img/Azure-Firewall.svg",
    url: "https://azure.microsoft.com/products/azure-firewall",
    type: "Service", 
  },

  bastion: {
    label: "Azure Bastion",
    description: "Template architecture for Azure Bastion",
    azureIcon: "./img/Azure-Bastion.svg",
    url: "https://azure.microsoft.com/products/azure-bastion",
    type: "Service",
  },

  vmsqlserver: {
    label: "SQL Server on Azure Virtual Machines",
    description: "Template architecture for SQL Server",
    azureIcon: "./img/SQL-Server-Database.svg",
    url: "https://azure.microsoft.com/products/virtual-machines/sql-server/",
    type: "Service",
  },
  avset: {
    label: "Availability Set",
    description: "Template architecture for Availability Set",
    azureIcon: "./img/VM-AVSets.svg",
    url: "https://learn.microsoft.com/azure/virtual-machines/availability-set-overview",
    type: "Service",
  },
  appgateway: {
    label: "Azure Application Gateway",
    description: "Template architecture for Azure Application Gateway",
    azureIcon: "./img/Azure-Application-Gateway.svg",
    url: "https://azure.microsoft.com/products/application-gateway",
    type: "Service",
  },
  privateendpoint: {
    label: "Azure Private Endpoint",
    description: "Template architecture for Azure Private Endpoint",
    azureIcon: "./img/Azure-Private-Endpoint.svg",
    url: "https://learn.microsoft.com/azure/private-link/private-endpoint-overview",
    type: "Service",
  },
  privatelink: {
    label: "Azure Private Link",
    description: "Template architecture for Azure Private Link",
    azureIcon: "./img/Azure-Private-Link.svg",
    url: "https://azure.microsoft.com/products/private-link",
    type: "Service",
  },
  loadbalancer: {
    label: "Azure Load Balancer",
    description: "Template architecture for Azure Load Balancer",
    azureIcon: "./img/Azure-Load-Balancer.svg",
    url: "https://azure.microsoft.com/products/load-balancer",
    type: "Service",
  },
  


  
};
