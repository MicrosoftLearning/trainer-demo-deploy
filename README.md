# Welcome!

If you are looking for the Trainer Demo Deploy site, please visit our main site: https://aka.ms/trainer-demo-deploy. You'll find all the latest deployments there.


# Website

[![Deploy to GitHub Pages](https://github.com/Azure/awesome-azd/actions/workflows/deploy-docusaurus.yml/badge.svg)](https://github.com/Azure/awesome-azd/actions/workflows/deploy-docusaurus.yml)

[![pages-build-deployment](https://github.com/Azure/awesome-azd/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/Azure/awesome-azd/actions/workflows/pages/pages-build-deployment)

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
