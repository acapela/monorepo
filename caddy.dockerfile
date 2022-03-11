FROM caddy:2.4.6

COPY Caddyfile /etc/caddy/Caddyfile
COPY ./frontend/dist /var/www/frontend

EXPOSE 3000
