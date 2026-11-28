# Deployment

## Cloudflare Pages

The production site is <https://nyc-eats.pages.dev>.

Connect the GitHub repository `dannyglin/nyc-eats` to Cloudflare Pages and set:

- Production branch: `main`
- Build command: `npm run build:static`
- Build output directory: `dist`

Every push to `main` triggers a Pages build and deployment. The static build uses the system shell and does not require installing the app dependencies.

## Cloudflare Workers

The repository also includes [wrangler.jsonc](wrangler.jsonc) for manually publishing the static output as a Worker. Authenticate Wrangler, then run:

```sh
npx wrangler@4 deploy
```

This Worker deployment is separate from the Git-connected Pages deployment.
