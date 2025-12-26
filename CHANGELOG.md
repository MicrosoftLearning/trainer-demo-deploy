# Trainer Demo Deploy - 2025 Changelog

## 📊 Overview

### Summary Statistics

- **Total Deployments**: 2067
- **Period**: January 10, 2025 - December 25, 2025
- **New Deployment Scenarios Added**: 60+

### 👥 Top Contributors

1. **Peter De Tender** - Project lead, majority of scenario additions, maintenance
2. **Rob Foulkrod** - Documentation improvements, multiple scenarios (Purview, API Management, GoodFood)
3. **Dave Rendon** - Multiple security and infrastructure scenarios
4. **Koenraad Haedens** - Hypervisor scenarios, security templates
5. **Maarten van Diemen** - Load testing, App Configuration, prerequisite updates
6. **Alex Ivanov** - PostgreSQL scenarios, OWASP template, Event Hub updates
7. **Sungjin Ahn** - Training course tags and icons
8. **Karel De Winter** - Azure Monitor scenarios
9. **Krunal Trivedi** - IIS infrastructure scenarios
10. **Sarah Allali** - Private Link scenarios

---

## 📅 Monthly Changes

### December 2025

#### 🆕 New Scenarios

- **Azure Routing Demo** ([PR #79](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/79)) - by jmenne
- **Azure Backup scenarios** - Backup solutions
- **Azure Site Recovery (ASR) scenarios** - Disaster recovery

#### 🐛 Bug Fixes

- Fixed null value check in template parameters file

#### 🔧 UI/UX Improvements

- **Fixed text visibility in dark mode** ([PR #80](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/80)) - by copilot-swe-agent[bot]
- Refactored textColor constant to reduce duplication
- Tags case insensitivity no longer fails build
- Tags for Azure Services not sorting alphabetically fixed
- Getting-Started text is not readable in dark mode fixed
- Tags taking up too much space when multiple tags, moved to "+X more" styling

#### 📦 Dependencies

- **Bump tar-fs** ([PR #75](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/75))
- **Refined contribution guidelines** ([PR #78](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/78)) - Complete rewrite for better clarity

### November 2025

#### 🆕 New Scenarios

- **Document Intelligence scenario** - AI document processing

#### 🏷️ Tags & Categorization

- **Added dp-600 tag and updated dp-603/dp-700 tags** ([PR #71](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/71))

- **Document Intelligence scenario** - AI document processing
- **MCP demo** - Model Context Protocol demonstration

#### 🔧 Maintenance

- Updated control scripts

#### 🐛 Bug Fixes

- Fixed tag in MCP scenario
- Updated demoguide URL to raw GitHub link ([PR #69](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/69))
- Updated title of Syslog deployment template ([PR #70](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/70))

### October 2025

#### 🆕 New Scenarios

- **Emulated firewall Syslog deployment** ([PR #68](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/68)) - by Koenraad Haedens

#### 📦 Dependencies

- **Bump tar-fs** - Security update

### September 2025

#### 🆕 New Scenarios

- **Deep-researcher scenario** - AI research assistant

#### 🏷️ Tags & Categorization

- Added Foundry and OpenAI tags to scenarios

### August 2025

#### 🆕 New Scenarios

- **Hardened webapp** ([PR #64](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/64)) - by Dave Rendon
- **Load Balancer template** - thhatty/fourlb

### July 2025

#### 🆕 New Scenarios

- **Microsoft Sentinel-based threat detection and response** ([PR #54](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/54)) - by Dave Rendon
- **PostgreSQL demos for AI-3019 and DP-3021** ([PR #53](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/53)) - by Alex Ivanov
- Removed outdated JSON schema placement instructions

### June 2025

#### 🆕 New Scenarios

- **Azure Monitor custom logs** ([PR #48](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/48)) - by Karel De Winter


### May 2025

#### 🆕 New Scenarios

- **Use Private Link for overlapping address spaces** ([PR #42](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/42)) - by Dave Rendon
- **AI Foundry with Sora** - Video generation scenario
- **AI Foundry agent service** - Agent development platform
- **Azure App Configuration** ([PR #40](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/40)) - by Maarten van Diemen
- **Good Food demo with Semantic Kernel** ([PR #38](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/38)) - by Rob Foulkrod
- **SQL Workload Simulator** ([PR #43](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/43)) - by Koenraad Haedens
- **AZ-104 scenario** - by Vassilis
- **Windows 2019 IIS Servers with Load Balancer** ([PR #34](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/34)) - by Krunal Trivedi (first contribution!)

#### 📝 Documentation & Updates (May 2025)

- Fixed dead links in contribute page
- Updated create-template FAQ
- Updated main contribute page
- Updated contribution guidelines
- Updated link for contribution PR

#### 🏷️ Tags & Categorization

- Aligning tags across scenarios

---

### April 2025

#### 🆕 New Scenarios

- **Plan and implement security for public access to Azure resources** ([PR #29](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/29)) - by Dave Rendon
- **Added Framework tag** ([PR #39](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/39)) - For Semantic Kernel and other frameworks
- Updated AIStudio to AI Foundry tags
- Added frameworks tag for semantic-kernel, removed az-2005 tag
- Updated "hot" and "new" tags
- Updated azurenetworking tag to vnets

#### 📝 Documentation

- **Updated GoodFood demo guide** ([PR #41](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/41))
- **Updated BadgeMaker demoguide** ([PR #36](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/36))
- **Added redirect for search engine users** ([PR #35](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/35))

#### 🔧 Maintenance

- Updated feedback link to root of issues
- Updated tags from dp-203 to dp-300 for SQLAO scenario
- Changed author attribution for AI Python scenario to Vince
- Updated tag for vmsqlserver

---

### March 2025

#### 🆕 New Scenarios

- **Load testing scenario** ([PR #21](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/21)) - by Maarten van Diemen
- **Baseline web application** ([PR #27](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/27)) - by Dave Rendon
- **DeepSeek-R1 on Azure Container Apps** ([PR #26](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/26)) - by Dave Rendon
- **YouTube Summarizer** - AI video summarization

#### 📝 Documentation & Legal (March 2025)

- **Created SECURITY.md** - Security policy
- **SQL Always On (SQLAO)** - High availability
- **ADDS VM scenario** - Active Directory
- **Azure Firewall scenario** - Network security
- **Cognitive Services scenario** - AI services
- **Storage and integration services** - Data integration

#### 🐛 Bug Fixes

- Fixed link to ISS demoguide
- Updated description for baseline web app scenario
- Fixed case sensitivity for tags

#### 🏷️ Tags & Categorization

- Cleanup "new" and "hot" tags for scenarios
- Added Azure Firewall tag

---

### February 2025

#### 🆕 New Scenarios

- **Flex function + Event Hubs + Load testing** ([PR #15](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/15)) - by Rob Foulkrod
- **Microsoft Purview Demo Environment** ([PR #2](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/2)) - by Rob Foulkrod
- **Private Link scenario** ([PR #3](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/3)) - by Sarah Allali
- **Event Hubs scenario** ([PR #8](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/8)) - by Alex Ivanov
- **Nested Hypervisor scenarios** ([PR #11](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/11), [PR #12](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/12)) - by Koenraad Haedens

#### 📝 Documentation & Legal

- **Created SECURITY.md** - Security policy
- **Created CODE_OF_CONDUCT.md** - Community guidelines
- **Created LICENSE** - MIT License
- Added NOTICE.txt
- Format Legal text and add Code of Conduct link

#### 📝 Documentation (February 2025)

#### 🐛 Bug Fixes

- **Fixed demoguide links** ([PR #17](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/17)) - ACI and ACAPPS by Maarten van Diemen
- Fixed template.json EOD issues
- Fixed service endpoint scenario duplicate demoguide properties
- Fixed text layout bugs
- Fixed layout for Legal text
- Links fixing in templates.json ([PR #18](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/18))

#### 🔧 UI/UX Improvements

- Cleaner 3-step deployment process
- Updated MOC to ILT for blueprints
- Updated author names to full names

#### 🏷️ Tags & Categorization

- Added more issue templates

---

### January 2025

#### 🆕 New Scenarios (Project Foundation - 10+ scenarios)

- **Watermark Function** - Azure Functions demo
- **Two network scenarios** - VNET configurations
- **EShop PAAS** - E-commerce platform
- **Event Hubs** - Event streaming
- **Azure Front Door** - Global load balancer
- **AKS scenario** - Kubernetes deployment
- **Container scenarios** - ACI and ACA demos
- **IAAS 2019** - Infrastructure as a Service
- **Azure ML scenario** - Machine Learning workloads
- **3 initial scenarios** - Catalog foundation

#### 🏷️ Tags & Categorization

- Added Load Testing tag
- Added Azure ARC tag
- Added VPN Gateway tag
- Added Purview tag and service icon
- Updated tags.tsx for Purview support

#### 🔧 UI/UX Improvements

#### 🔧 Platform Features

- **Added telemetry for copy button** - User behavior tracking
- Added prereqs element

#### 🐛 Bug Fixes

#### 📊 Analytics

- **Switched from AppInsights to Adobe Analytics** - Better tracking
- Added schema for Event Hub scenario
- Fixed demoguide for ACI demo
- Multiple pricing and deployment time adjustments for Hypervisor and Dev PC scenarios

#### 📝 Documentation (January 2025)

- Updated contribution documentation
- Updated FAQs and prerequisites
- Added config file for feedback templates
- Added feedback template
- Changed template format
- Fixed typos in templates
- Added prerequisite documentation for multiple scenarios

---

#### 🔧 Platform Features

- **Added telemetry for copy button** - User behavior tracking
- **Added AppInsights for azd init copy button**
- **Added cost and deployment time parameters** - For all scenarios with tags and icons
- **Added rehype-raw package** - For markdown to HTML rendering in demo guides

#### 📊 Analytics

- **Switched from AppInsights to Adobe Analytics** - Better tracking
- Updated 1DS instrumentation key
- Enabled ms.analytics-web-4 script
- Added Adobe metrics

#### 🏷️ Tags & Categorization

- Added framework tags to template scenarios
- Updated tags across multiple scenarios
- Updated Maarten scenarios to MCT tag
- Updating tags for MCT contributions

#### 🐛 Bug Fixes & Improvements

- **Moved demo guides to separate folder** ([PR #1](https://github.com/MicrosoftLearning/trainer-demo-deploy/pull/1)) - by Maarten van Diemen
- Updated scenario images to correct ones
- Updated architecture images and links
- Uploaded test images as placeholders for missing diagrams
- Fixed website links to point to GitHub profiles instead of scenarios
- Updated link to demo guide for Event Hub

---

*This changelog reflects the evolution of the Trainer Demo Deploy platform from a basic template catalog to a comprehensive deployment platform for Azure training scenarios with extensive documentation, contributor-friendly processes, and robust telemetry.*

---
