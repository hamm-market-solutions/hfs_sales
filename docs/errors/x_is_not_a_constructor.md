# X is not a Constructor

## Error
```bash
⨯ TypeError: _ is not a constructor
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

We were getting this error when running the project in production. The login form was rendered correctly. When you submitted the form with the credentials to the server action to handle it, the error occured.

## Solution

We used the `useActionState` hook to trigger the server action and get its messages to display to the user. This hook was causing the error. Instead we are now passing the server action directly to the `Form` element.
