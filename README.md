# HFS Sales

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [drizzle](https://orm.drizzle.team/)

## How to Use

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run migrations

```bash
npx drizzle-kit migrate
```

### Seed database

```bash
npm run seed -- up
```

## Update production build

```bash
git pull
npm i
npm run build
source .env.production && DATABASE_URL=$DATABASE_URL npx drizzle-kit migrate
mwservicectl restart
```
