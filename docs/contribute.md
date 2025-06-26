---
sidebar_position: 1
title: "Contributor Guide"
---

## We ♥️ Contributions!
`trainer-demo-deploy` is a Technical Trainer community-friendly resource to help trainers and learners doing compelling demos during ILT (Instructor-Led Training) courses and other technical training deliveries and workshops. Scenarios are based on `azd` templates, which allows for easy redeployment for your next class delivery or learning journey. 

## See our [Contribute FAQ](https://microsoftlearning.github.io/trainer-demo-deploy/docs/faq/contribute-template) for more details

Our template gallery will be at its best when our community is involved in creating and contributing new templates. 

We welcome contributions of [requested templates](https://github.com/MicrosoftLearning/trainer-demo-deploy/issues?q=is%3Aopen+is%3Aissue+label%3Arequested-contribution) as well as any others, subject to review. 

Before you submit a template:
1. Add an entry to [/static/templates.json](https://github.com/MicrosoftLearning/trainer-demo-deploy/blob/main/static/templates.json) that includes:
    - **Template title** - A short title that reflects the local application stack that someone could use to get their application on Azure (e.g. "Containerized React Web App with Java API and MongoDB")
    - **Description** - 1-2 sentence description of the architecture (e.g. Azure services) or solution that is defined by the template.
    - **Architecture Diagram or Application Screenshot** - Used as display image for gallery card. The architecture should include all services and their connections ([example](https://raw.githubusercontent.com/MicrosoftLearning/trainer-demo-deploy/refs/heads/main/static/templates/images/AIFoundrywithSora.png). You should add the image to [website/static/templates/images](https://github.com/MicrosoftLearning/trainer-demo-deploy/tree/main/static/templates/images)
    - **Link to Author's GitHub or other relevant website** - Used for attribution.
    - **Author's Name** - Name to credit on the gallery card
    - **Link to template source** - Link to the template GitHub repo
    - **Tags** - One or more [tags](https://github.com/MicrosoftLearning/trainer-demo-deploy/blob/main/src/data/tags.tsx) representing the template. Provide at least 1 tag for the related Microsoft Instructor-Led Course (ILT) used and at least 1 tag for Azure services integrated. Missing a relevant tag for your template? Feel free to add one!
    - **DemoGuide** - Link to MarkDown document with step-by-step instructions on what to demo
    - **DeployTime** - The estimated time for deploying the scenario
    - **Cost** - The estimated costs in USD, to host the full Resource Group scenario for 24 hours, using Azure Cost Analysis amounts as a guideline 
2. Open a PR!
3. If possible, add a link to the PR in your repo where you made your app `azd` compatible to the PR description. This will help us provide feedback on your template and speed up the review process. 

If you would like to contribute a template but are not sure where to start, [check the create template FAQ](https://microsoftlearning.github.io/trainer-demo-deploy/docs/faq/create-template) for more context. Doing so consists of three main steps:
1.  Set up a new environment (with `azd init`) or use our "Trainer-Demo-Deploy Starter" template
2.  Update with your Bicep files in the \infra folder
3. (Optional) add your application sample to the \src folder
3.  Update azure.yaml with name and metadata information

## Other Ways To Help 
Other than these, we always welcome feedback through a:
 - [**request a template**](https://github.com/MicrosoftLearning/trainer-demo-deploy/issues/new?assignees=petender&labels=requested-contribution&template=%F0%9F%A4%94-submit-a-template-request.md&title=%5BIdea%5D+%3Cyour-template-name%3E): if you cannot find a template with architecture that works for you-- you can submit a request for that template
    - Keep in mind, templates are made to be flexible and extensible. You can use a template's architecture and swap out the source code. For example, if you want to create a grocery list making application using Azure SQL and Azure App service, you can use the React Web App with C# API and SQL Database on Azure template and swap out the source code.
 - [**bug report**](https://github.com/MicrosoftLearning/trainer-demo-deploy/issues/new?assignees=&labels=&template=bug_report.md&title=): let us know if something is broken
 - [**feature request**](https://github.com/MicrosoftLearning/trainer-demo-deploy/issues/new?assignees=&labels=&template=feature_request.md&title=): for improvements to our trainer-demo-deploy site
 - [**feedback**](https://github.com/MicrosoftLearning/trainer-demo-deploy/issues/new?assignees=petender&labels=feedback&projects=&template=feedback_template.md&title=%5BFeedback%5D): for sharing your feedback regarding a demo scenario or the tool in general

## Next Steps
- Visit our [FAQ](./1-faq/1-what-is-azd.md)
