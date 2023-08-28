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

- git clone https://github.com/BlueFoxHost/echo.git
- cd echo
- nano .env.example
- REMEMBER TO RENAME IT TO .env
- docker-compose up -d

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/BlueFoxHost/echo/blob/production/LICENSE) file for details.
