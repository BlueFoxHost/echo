# Echo

An open source utility used to ping servers.

## Features

- Minimal dependencies. (Docker, Docker Compose)
- Simple and configurable codebase
- NodeJS and Certbot already bundled. Just install Docker and Docker-Compose and go.

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

5. Install Docker and Docker-Compose:
You can use the included script `install_docker.sh` to install both Docker and Docker-Compose.

6. Run `openssl.sh` to generate a Diffie–Hellman param file.

7. Start the application using Docker Compose:
`docker-compose up -d`

8. Edit your crontab to add the ssl_renew script.
`sudo crontab -e`
`0 0 * * * ~/echo/ssl_renew.sh >> /var/log/cron.log 2>&1`

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/BlueFoxHost/echo/blob/production/LICENSE) file for details.
