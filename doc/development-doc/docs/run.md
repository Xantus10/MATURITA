# Running the app

## Development

In development environment as of this day, it is recommended to do the following

1. Dev MongoDB can be run locally either with a separate install or a separate container
2. Nginx can be handled with a portable executable
3. To run both frontend and backend
      1. Navigate to their respective directories
      2. Run `npm run build`
      3. If there were no errors run `npm run start`

## Production

Prerequesities: Have docker installed on your production device

1. Make `.env` file from `.env.example`, be sure to replace security related info like secrets and passwords
2. Run docker compose up
