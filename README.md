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

5. Edit the `nginx/conf/nginx.conf` and replace `<YOUR DOMAIN>` with the domain name in .env.

6. Install Docker and Docker-Compose:
You can use the included script `install_docker.sh` to install both Docker and Docker-Compose.

7. Run `openssl.sh` to generate a Diffie–Hellman param file.

8. Start the application using Docker Compose:
`docker-compose up -d`

9. Edit your crontab to add the ssl_renew script.
`sudo crontab -e`
`0 0 * * * ~/echo/ssl_renew.sh >> /var/log/cron.log 2>&1`

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/BlueFoxHost/echo/blob/production/LICENSE) file for details.
