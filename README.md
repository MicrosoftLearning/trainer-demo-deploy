# Welcome!

If you are looking for the Trainer Demo Deploy site, please visit our main site: https://aka.ms/trainer-demo-deploy. You'll find all the latest deployments there.


# Website

[![Deploy to GitHub Pages](https://github.com/Azure/awesome-azd/actions/workflows/deploy-docusaurus.yml/badge.svg)](https://github.com/Azure/awesome-azd/actions/workflows/deploy-docusaurus.yml)

[![pages-build-deployment](https://github.com/Azure/awesome-azd/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/Azure/awesome-azd/actions/workflows/pages/pages-build-deployment)

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ npm ci
```

### Local Development

```
$ npm run start
```

### Local Development (Docker)

Dev server (hot reload):

```
$ docker compose up --build dev
```

Then open:

`http://localhost:3000/trainer-demo-deploy/`

### Local Development (Docker)

Dev server (hot reload):

```
$ docker compose up --build dev
```

Then open:

`http://localhost:3000/trainer-demo-deploy/`

### Local Development (Dev Container)

If you use VS Code, you can develop in a preconfigured container:

1. Install the **Dev Containers** extension.
2. Run **Dev Containers: Reopen in Container**.
3. The container runs `npm ci` on first create. Then start the dev server:

```
$ npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

Note: this site is configured for GitHub Pages with a base URL of `/trainer-demo-deploy/`, so the local URL is typically:

`http://localhost:3000/trainer-demo-deploy/`

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Serve the production build (optional)

```
$ npm run serve
```

Then open:

`http://localhost:3000/trainer-demo-deploy/`

### Serve the production build (Docker)

```
$ docker compose --profile prod up --build prod
```

Then open:

`http://localhost:8080/trainer-demo-deploy/`

### Serve the production build (Docker)

```
$ docker compose --profile prod up --build prod
```

Then open:

`http://localhost:8080/trainer-demo-deploy/`

### Tests

```
$ npm test
```

### Deployment

This repo deploys to GitHub Pages via GitHub Actions (see `.github/workflows/test-deploy.yml`).
