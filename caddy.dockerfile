FROM caddy:2.4.6

COPY ./Caddyfile /etc/caddy/Caddyfile
COPY ./dist /var/www/frontend

EXPOSE 3000
