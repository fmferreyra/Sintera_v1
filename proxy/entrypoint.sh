#!/bin/sh
set -e

# Sin dominio: HTTP simple en :80 (acceso por IP). Con dominio: HTTPS automatico via Let's Encrypt.
if [ -n "$DOMAIN_NAME" ]; then
	ADDRESS="$DOMAIN_NAME"
else
	ADDRESS=":80"
fi

cat > /etc/caddy/Caddyfile <<EOF
{
	email ${LETSENCRYPT_EMAIL:-admin@example.com}
}

$ADDRESS {
	reverse_proxy app:3000
}
EOF

exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
