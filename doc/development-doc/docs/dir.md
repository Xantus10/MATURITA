# Directory structure of the app

## Root directory

```
/backend      -- Express backend files
/db           -- Production mongodb init script
/doc          -- All the documentation
/frontend     -- React frontend files
/nginx        -- Nginx files
compose.yaml  -- Docker compose file to dockerize the whole app
README.md     -- Basic project readme (Czech version included)
```

## The sub structures

### Backend

```
/dist         -- The build directory
/images       -- The uploaded images storage
/node_modules -- Standard npm libraries
/src          -- Source files
  | /config       -- Files for overall app configuration (env)
  | /db           -- Database interaction (Mongoose)
      | /interfaces   -- Basic interface structure of collections
      | /models       -- Conversion of IFs into usable models
      | conn.ts       -- Databse connection script
  | /middlewares  -- Custom Express.js middlewares
  | /oauth        -- Anything concerning OAuth 2.0 validation
  | /routes       -- API routes featured in the app
  | /util         -- Utility scripts
  | custom.d.ts   -- Retyping imported types to add fields
  | index.ts      -- Main app file
Dockerfile    -- Dockerfile for dockerizing backend
package.json  -- External packages + npm scripts
tsconfig.json -- TS configuration
```

### Db

```
Dockerfile    -- Dockerfile for dockerizing mongodb
init.sh       -- Mongo docker init script (create user+call `create.js`)
create.js     -- Create all collections, indexes and such
```

### Doc

```
/development-doc    -- This documentation
BE-API.html         -- Redoc built API documentation
BE-API.yaml         -- OpenAPI documentation source file
mongodb-schema.mml  -- Mongo graphical model
mongodb-schema.txt  -- Main mongo model documentation
```

### Frontend

```
/dist         -- The build directory
/node_modules -- Standard npm libraries
/public       -- React static files
  | /locales      -- Localization json files
      | /cs           -- Czech localization
      | /en           -- English localization
/src          -- Source code
  | /Components   -- Custom reusable components for the app
      | /Clickables   -- Components whose primary purpose is to be clicked
      | /Displays     -- Components whose primary purpose is to display (json) data
      | /Overlays     -- Components whose primary focus is on displaying an overlay
  | /Pages        -- App pages to render
      | /Admin        -- Admin pages
  | /styles       -- Postcss style files
  | /Util         -- Utility scripts
  | App.tsx       -- Main application (Pages router)
  | i18n.ts       -- Init of localization system + plugins
  | i18next.d.ts  -- Type definitions for localization
  | main.css      -- App wide css
  | main.tsx      -- Topmost application config + initialization
  | vite-env.d.ts -- Environment variables loading
Dockerfile    -- Dockerfile for dockerizing frontend
index.html    -- Index file for react
package.json  -- External packages + npm scripts
postcss.config.cjs  -- Postcss plugins
serve.json    -- Configuration for serve (Our production frontend serving server)
tsconfig.json -- TS configuration
```
