This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Local environment

The transfer API and chat assistant run locally through the Next.js development
server. Copy the values into [`.env.local`](./.env.local):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `HINDSIGHT_API_KEY`
- `HINDSIGHT_BASE_URL` (optional; defaults to `https://api.hindsight.vectorize.io`)
- `HINDSIGHT_BANK_ID` (optional; defaults to `copify-assistant`)

The Supabase migration in [`supabase/migration.sql`](./supabase/migration.sql) must
also be applied to the project before creating transfers.

The chat assistant uses Hindsight's memory and reflection API. Add
`HINDSIGHT_API_KEY` only in `.env.local`; never prefix it with `NEXT_PUBLIC_`, because
that would expose the key in the browser. Restart `npm run dev` after changing
environment variables.
