---
title: How do I create templates?
---

There are a few different ways to create 'azd templates', depending on what your starting point is. Assuming that you want to create not just an 'azd template', but provide a full demo scenario into Trainer-Demo-Deploy, you could use our [`tdd-azd-starter`](https://github.com/petender/tdd-azd-starter) template, which contains the following:

```txt
├── .devcontainer              [ For DevContainer ]
├── demoguide                  [ Contains the demoguide.md and corresponding screenshots]
    ├── demoguide.md           [ The actual step-by-step demoguide with instructions/suggestions what to demo ]
    ├── screenshot1.png        [ Screenshots used in the demoguide.md ]    
├── infra                      [ Creates and configures Azure resources ]
│   ├── main.bicep             [ The Main infrastructure as Code file, containing Resource Group and Modules deployment ]
│   ├── main.parameters.json/  [ Bicep Parameters file ]
    ├── modulename.bicep       [ Bicep Module file(s), used by Main.bicep ]       
├── src                        [ Contains directories for the app code ]
└── azure.yaml                 [ Describes the app and type of Azure resources; it also contains name  & metadata]
```
Update or replace the different sample files (Main.bicep, modulename.bicep, demoguide.md, etc...) with your own template files, and you're good to go.

Next, update the azure.yaml information, especially name and metadata, having a clear name for the scenario. Make sure you keep the naming convention `tdd-azd-`. FYI, the metadata information is used in the AZD reporting KPIs.

Once your scenario is complete, and the necessary artifacts are available in a Public GitHub repo, `raise a PR` to initiate your scenario into the template catalog as follows:

1. **Fork** the [Trainer-Demo-Deploy GitHub Repo](https://github.com/MicrosoftLearning/trainer-demo-deploy)

2. **In your forked copy repo**, check which tags you would allocate to your scenario, from the `\src\data\tags.tsx` file. You can add as many tags as you want for both ILT Courses and Azure Services. You should have at least 1 tag for each category. (If any of the tags is missing, feel free to add them under the \\ ILT Courses section (line 41 and following) for missing ILT courses, and under the \\ Azure Services section (line 75 and following). For each new tag you create in either section, you should also add a tag description in JSON format more below in the same file (lines 168 and following section for `ILT Courses` and lines 441 and following for `Azure Services`)

3. Add your scenario description to the `\src\static\templates\templates.json`, at the end of the JSON file, using the following data structure:

```
{
  "**title**": "Short descriptive title for your scenario; check other templates for examples",
  "**description**": "Longer description of what the demo scenario is about, what gets deployed, etc...",
  "**preview**": "raw github link to the PNG file of the demo scenario architecture",
  "**website**": "https://github.com/<your github account>",
  "**author**": "<Your Name>",
  "**source**": "https://github.com/<your github account>/<your github repo for the scenario>",
  "**demoguide**": "raw github link to the demoguide.md",
  "**tags**": [list of tags from \src\data\tags.tsx collection],
  "**cost**": "cost estimate for 24 hours running the scenario",
  "**deploytime**": "estimate in minutes to run the actual deployment from azd up"
}
```

:::Note TAG Guidelines
if you are an **MTT**, add "msft" to the tags array, if you are an **MCT**, use "mct"
for a new scenario, add the tag "new" to the tags array 

4. After making these changes, 'push' the changes to the original Trainer-Demo-Deploy Repo, by initiating a PR-Pull Request. Provide a concise description as comment. 

5. Inform the project leads (petender@microsoft.com or robfoulkrod@microsoft.com about the PR, so we can start looking into it)

6. Once the scenario got tested and validated, the PR will get approved and your scenario will show up in the catalog. 

7. Congrats, and thank you for your contributions! 


:::tip AZD CONVENTIONS 
If you want to learn even more about AZD, check the Product Group `azd conventions`(https://learn.microsoft.com/azure/developer/azure-developer-cli/make-azd-compatible?source=recommendations&pivots=azd-create#azd-conventions), knowing that not all guidelines are necesarilly used in our Trainer-Demo-Deploy scenarios.

The Azure Developer CLI (azd) tool helps you with the process of _creating_ the template with `azd init` as the first step, followed by creation of the `infra/` folder, updating of the `azure.yaml` file, and validation of template using `azd up` to provision and deploy resources.

:::tip READ THE DOCS
Learn more about [making your codebase `azd`compatible](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/make-azd-compatible)
:::
