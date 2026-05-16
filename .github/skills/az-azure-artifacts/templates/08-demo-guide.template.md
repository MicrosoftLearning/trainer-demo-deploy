# Demo Guide - {project-name}

📑 Demo Guide Contents

use the below markdown example literally as the structure, obviously updating with the scenario specicific content

[comment]: <> (please keep all comment items at the top of the markdown file)
[comment]: <> (please do not change the \*\*\*, as well as <div> placeholders for Note and Tip layout)
[comment]: <> (please keep the ### 1. and 2. titles as is for consistency across all demoguides)
[comment]: <> (section 1 provides a bullet list of resources + clarifying screenshots of the key resources details)
[comment]: <> (section 2 provides summarized step-by-step instructions on what to demo)

[comment]: <> (this is the section for the Note: item; please do not make any changes here)

---

### {projectname} - demo scenario

<div style="background: lightgreen; 
            font-size: 14px; 
            color: black;
            padding: 5px; 
            border: 1px solid lightgray; 
            margin: 5px;">

**Note:** Below demo steps should be used **as a guideline** for doing your own demos. Please consider contributing to add additional demo steps.

</div>

[comment]: <> (this is the section for the Tip: item; consider adding a Tip, or remove the section between <div> and </div> if there is no tip)

---

### 1. What Resources are getting deployed

{project description in max 5 lines}

below are just some examples, update with the actual scenario names from the templates and deployment

- rg-%azdenvironmentname - Azure Resource Group.
- TMLABAppSvcPlan-%region% - Azure App Service Plan in each region
- TMLABWebApp-%region% - Azure App Service with static HTML webpage in each region
- TMProfile - Traffic Manager Profile with endpoints

<img src="https://raw.githubusercontent.com/{githubaccount}/{projectname}/refs/heads/main/demoguide/TM/ResourceGroup_Overview.png" alt="Traffic Manager Resource Group" style="width:70%;">
<br></br>

<img src="https://raw.githubusercontent.com/{githubaccount}/{projectname}/refs/heads/main/demoguide/TM/TrafficMgr_Profile.png" alt="Traffic Manager Profile with Endpoints" style="width:70%;">
<br></br>

<img src="https://raw.githubusercontent.com/{githubaccount}/{projectname}/refs/heads/main/demoguide/TM/TrafficMgr_WebApp.png" alt="Sample WebApp" style="width:70%;">
<br></br>

### 2. What can I demo from this scenario after deployment

<use this below example as a scenario for what a good demo flow looks like

>

1. Navigate to the Resource Group, and explain the different Azure resources deployed in each region.
1. Open one of the WebApp Resources in a region; navigate to the URL and open the actual website.
1. Do the same for a WebApp in a different region, highlighting they are 3 identical websites.
1. Navigate to the **Traffic Manager Profile**, highlighting the 3 different endpoints. Open one of the endpoints and emphasize the region it points to
1. Browse to the Traffic Manager URL using its DNS Name property (https://tmlabxyz.trafficmanager.net). As there is no TLS certificate configured for the website, nor the Traffic Mgr load balancer, it will throw an error.

<img src="https://raw.githubusercontent.com/{githubaccount}/{projectname}/refs/heads/main/demoguide/TM/TrafficMgr_Browser_Error.png" alt="Traffic Manager URL Browser Certificate Error" style="width:70%;">
<br></br>

1. From the Browser error appearing, click **Continue to... (not recommended)**
1. Highlight the website is showing through the load balancing Traffic Manager URL. It should say the region is "Central US".

1. Navigate back to the Azure App Service resource in Central US.
1. Stop the App Service
1. Once stopped, navigate to the tmlabwebapp-centralUS web page; refresh the page and confirm it shows stopped.

<img src="https://raw.githubusercontent.com/{githubaccount}/{projectname}/refs/heads/main/demoguide/TM/WebApp_Stopped.png" alt="WebApp Is Stopped" style="width:70%;">
<br></br>

1. Switch back to the Traffic Manager Profile, and confirm (or refresh until...) the **Endpoint 0** shows a state of **Degraded**

<img src="https://raw.githubusercontent.com/petender/{githubaccount}/{projectname}/refs/heads/main/demoguide/TM/TrafficMgr_Endpoint_Degraded.png" alt="Traffic Mgr Endpoint Degraded" style="width:70%;">
<br></br>

[comment]: <> (this is the closing section of the demo steps. Please do not change anything here to keep the layout consistant with the other demoguides.)
<br></br>

---

<div style="background: lightgray; 
            font-size: 14px; 
            color: black;
            padding: 5px; 
            border: 1px solid lightgray; 
            margin: 5px;">

**Note:** This is the end of the current demo guide instructions.

</div>
