# Adding new features

If you are reading this documentation, it is possible, that you are tasked not only with maintaining the application, but also expanding it. Here are a few common workflows for feature adding.

## The main workflow

For most additions, it is customary to proceed according to these steps
1. Add the feature
2. Test the feature
3. Repair bugs
**And don't forget to document (Either at the beginning or at the end)**

## Documenting

| Feature | Where to document |
|---------|-------------------|
| DB changes | In `mongo-schema.txt` and mongo model |
| API changes | In `BE-API.yaml` |
| Any new function or interface | Should feature JSDoc comments |

## Backend + DB features

### Adding new collection

1. Is new collection really necessary (Can it really not be embedded as an array or object?)
2. Add it to DB documentation (Comprehensive description to `mongo-schema.txt` and then add to model)
3. Add collection creation and indexing to `db/create.js`
4. Create basic interface for mongoose in `backend/src/db/interfaces`
5. Should the mongoose model need some static functions, add them to `Model<IF>`
6. Create the mongoose schema and model in `backend/src/db/models`
7. Use the mongoose model

### Adding new API routes

**Adding new routes to an existing file**

1. Navigate to the file under `backend/src/routes/*.ts`
2. Add the route to the router
3. Add any route-specific middleware
4. Add a handler arrow function for the route
5. In the handler make sure to handle possible errors with 4xx codes
6. Document the route in `BE-API.yaml`

**Adding routes for a new distinct feature**

1. Create a new file under `backend/src/routes/*.ts`
2. Comment at the top for the purpose of the routes in the file
3. Create `router` and add any middleware to it (Almost always add `loggedin` middleware)
4. Add routes to the router
5. Import and use the router in `backend/src/index.ts` (There is a place for the routes at the bottom)
6. Document the routes in `BE-API.yaml` (Add a new TAG at the beggining)

