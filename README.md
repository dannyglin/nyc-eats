# NYC Eats

NYC Eats helps you pick a restaurant from New York City’s five boroughs. Spin the Meal Machine, filter by borough and cuisine, and browse recent picks. Restaurant listings come from NYC Open Data.

## Local preview

Build and serve the static site with:

```sh
npm run build:static
python3 -m http.server 8000 --directory dist
```

Then open <http://localhost:8000>. The static build uses the system shell and does not require installing the app dependencies.

## Deployment

NYC Eats is deployed on Cloudflare Pages at <https://nyc-eats.pages.dev>. The Pages project builds this repository's static site from the `main` branch with `npm run build:static` and publishes the `dist` directory. Pushes to `main` trigger production deployments.

See [DEPLOY.md](DEPLOY.md) for setup details and the separate Wrangler Workers deployment option.
