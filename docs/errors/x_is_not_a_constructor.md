# X is not a Constructor

## Error
```bash
⨯ TypeError: x is not a constructor
   at t.createPool (/html/hfs_sales/.next/server/chunks/993.js:1:261332)
   at eB (/html/hfs_sales/.next/server/chunks/993.js:24:33839)
   at 20470 (/html/hfs_sales/.next/server/chunks/452.js:1:6985)
   at t (/html/hfs_sales/.next/server/webpack-runtime.js:1:143)
   at 63445 (/html/hfs_sales/.next/server/chunks/452.js:1:16761)
   at t (/html/hfs_sales/.next/server/webpack-runtime.js:1:143)
   at 69984 (/html/hfs_sales/.next/server/app/login/page.js:1:59709)
   at Object.t [as require] (/html/hfs_sales/.next/server/webpack-runtime.js:1:143)
   at <unknown> (/html/hfs_sales/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:127:1282) {
 digest: '1499062802'
}
```

## Background

We were getting this error when running the project in production. The login form was rendered correctly. When you submitted the form with the credentials to the server action to handle it, the error occured. This only happens when a server action gets handled in a client component manually. Meaning via a wrapper function or hook:

**Wrapper Function**

```typescript
const [state, setState] = useState(null);

const handleForm = async (data: FormData) => {
  const res = await handleLogin(data);
  setState(res);
}

return (
  <div className="login-page">
    <Title title="Login" />
    <Form action={handleForm} className="flex flex-col gap-2">
      ...
    </Form>
  </div>
);
```

**Hook**

```typescript
const [state, setState] = useFormState(handleLogin, EmptyHfsError);

return (
  <div className="login-page">
    <Title title="Login" />
    <Form action={setState} className="flex flex-col gap-2">
      ...
    </Form>
    {<p className="text-red">{state.message.replaceAll('"', "")}</p>}
  </div>
);
```

Although we can pass the function to the Form `action` directly (<Form action={handleLogin}></Form>) and then it works correctly, we then can't display errors returned by the server action to the user.

## Reproduction Steps

*src/app/login/page.tsx*

1. Implement one of wrapper function or a hook to handle the server action
2. Replace the *.env.production* with the *.env.development* for a local production build
3. `npm run build`
4. `npm run start`
5. Try to log in with the local admin
    - admin@hfs.com
    - Test1234.

## Ideas

According to the Error we get, `t.createPool`, my first guess is that Next.js thinks we would use the database connection somewhere on the client side. Like it would call the server action but as a client side function, ignoring the `use server` tag in the *src/actions/auth/login.ts*.

## Solution

