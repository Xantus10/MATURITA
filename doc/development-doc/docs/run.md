# Running the app

## Development

In development environment as of this day, it is recommended to do the following

1. Dev MongoDB can be run locally either with a separate install or a separate container
2. Nginx can be handled with a portable executable
3. ENV variables are to be passed via .env file in each separate directory (frontend, backend)
4. To run both frontend and backend
      1. Navigate to their respective directories
      2. Run `npm run build`
      3. If there were no errors run `npm run start`

## Production

### Microsoft Entra Tenant setup

To link the application to the Entra Tenant, do the following

1. Navigate to the tenant properties page
2. In the column under `Users` click on the number beside `Applications`
3. Now click on `New application`
4. Enter a name for the application (Doesn't really matter)
5. Select the option *Accounts in this organizational directory only* (It should be pre-selected)
6. For the redirect URI, select `SPA` and enter the URL the app is hosted on (Method should be https:// for production)
7. After creating write down the `application (client) id` and `tenant id` and add them to .env

Now the application is able to authenticate users. Next add permissions to create chats in msteams.

1. Navigate to `Manage/API permissions`
2. Add permission
3. Select `Microsoft Graph`
4. Select `Delegated permission`
5. Search for and add the `Channel.Create` permission
6. Confirm

### Running the app

Prerequesities: Have docker installed on your production device

1. Make `.env` file from `.env.example`, be sure to replace security related info like secrets and passwords
2. Run docker compose up
