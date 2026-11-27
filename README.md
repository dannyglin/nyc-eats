# NYC Eats

NYC Eats helps you pick a restaurant from New York City’s five boroughs. Spin the Meal Machine, filter by borough and cuisine, and browse recent picks. Restaurant listings come from NYC Open Data.

## Local preview

Build and serve the static site with:

```sh
npm run build:static
python3 -m http.server 8000 --directory dist
```

Then open <http://localhost:8000>. The static build uses the system shell and does not require installing the app dependencies.

## Cloudflare Pages

The site is a static build. In Cloudflare Pages, connect this GitHub repository and configure production deployments to use the `main` branch with these build settings:

- Build command: `npm run build:static`
- Build output directory: `dist`

Each push to `main` will trigger a Pages build and deployment. The public Pages address is `https://nyc-eats.pages.dev` if that Pages project name is available in the Cloudflare account.

## Cloudflare Workers deployment

For a manual Workers deployment, authenticate Wrangler and run:

```sh
npx wrangler@4 deploy
```

This runs the static build and publishes `dist/` using the settings in [wrangler.jsonc](wrangler.jsonc). This Worker deployment is separate from the Git-connected Pages deployment.
