# Echo

A utility used to ping servers. Currently closed source.

## Features

- Zero dependencies
- Simple and configurable codebase
- NGINX and Certbot bundled.

## Local Development

To run just the docker file with the Echo NodeJS app, run
`docker build .`
For a full enviroment, use docker compose.

## Deployment

Follow these steps to deploy the Echo application:

1. Clone the repository:
`git clone https://github.com/BlueFoxHost/echo.git`

2. Navigate to the project directory:
`cd echo`

3. Edit the `.env.example` file with your configuration settings.

4. Rename the `.env.example` file to `.env`.

5. Start the application using Docker Compose:
`docker-compose up -d`

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/BlueFoxHost/echo/blob/production/LICENSE) file for details.
