# Workflow: Despliegue en un servidor nuevo (Debian)

Esta guía cubre cómo levantar Sintera desde cero en un servidor Debian, para dos escenarios posibles según el cliente:

- **Escenario A:** el cliente accede solo por IP y puerto (sin dominio propio).
- **Escenario B:** el cliente tiene un dominio propio y quiere HTTPS.

La elección entre A y B se hace con `DOMAIN_NAME` y los puertos publicados en `.env`.

---

## 1. Requisitos previos

- Servidor Debian (11 o superior) con acceso SSH.
- Si es Escenario B: el DNS del dominio del cliente ya apuntando (registro A) a la IP pública del servidor.

---

## 2. Instalar Docker Engine + Compose plugin

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg git

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# opcional: usar docker sin sudo (requiere reiniciar sesion)
sudo usermod -aG docker $USER
```

---

## 3. Clonar el repositorio

```bash
git clone https://github.com/fmferreyra/Sintera_v1.git
cd Sintera_v1
```

---

## 4. Configurar `.env`

```bash
cp .env.example .env
nano .env
```

Completar siempre (contraseñas propias del servidor, nunca reutilizar las de desarrollo local):

```
POSTGRES_PASSWORD=<contraseña fuerte>
REDMINE_DB_PASSWORD=<misma contraseña que POSTGRES_PASSWORD>
SECRET_KEY_BASE=<generar nueva>
```

`SECRET_KEY_BASE` se genera con:

```bash
docker run --rm redmine:7.0.0 bin/rails secret
```

### 4.1 Escenario A — Solo IP, sin dominio

Dejar vacío:

```
DOMAIN_NAME=
HTTP_PORT=3000
HTTPS_PORT=3443
```

El proxy (Caddy) va a servir por HTTP en el puerto 3000. Se accede con `http://IP_DEL_SERVIDOR:3000`. El puerto 3443 queda reservado para HTTPS alternativo y no es necesario utilizarlo en este escenario.

### 4.2 Escenario B — Con dominio propio

```
DOMAIN_NAME=crm.cliente.com
LETSENCRYPT_EMAIL=soporte@sintera.com
HTTP_PORT=80
HTTPS_PORT=443
```

El proxy obtiene y renueva automáticamente el certificado HTTPS (Let's Encrypt) y redirige HTTP→HTTPS. Se accede con `https://crm.cliente.com`.

> No hace falta tocar `compose.yaml` ni ningún archivo del repo para elegir entre A y B: es solo esta variable de entorno.

---

## 5. Levantar los contenedores

```bash
docker compose up -d
```

Esto crea:
- Red interna Docker.
- Volúmenes persistentes (`sintera_postgres_data`, `sintera_redmine_files`, `sintera_caddy_data`, `sintera_caddy_config`).
- El theme y los plugins Sintera montados desde el repo (`redmine/themes`, `redmine/plugins`), aplicados desde el primer arranque.

---

## 6. Verificar

```bash
docker compose ps
docker compose logs -f proxy
docker compose logs -f app
```

Cuando `app` esté healthy y `proxy` sin errores:

- Escenario A: entrar por `http://IP_DEL_SERVIDOR:3000`.
- Escenario B: entrar por `https://crm.cliente.com` (puede tardar unos segundos el primer certificado).

---

## 7. Firewall (recomendado)

```bash
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp  # acceso por IP cuando no hay dominio
sudo ufw enable
```

---

## 8. Cambiar de escenario A a B más adelante

Si el cliente arranca sin dominio y después registra uno, no hace falta reinstalar nada:

```bash
nano .env
# completar DOMAIN_NAME y LETSENCRYPT_EMAIL
docker compose up -d
```

Los datos (Postgres, adjuntos) y los certificados previos no se pierden porque viven en volúmenes nombrados, no en el contenedor.

---

## 9. Comandos útiles de referencia

| Comando                                   | Qué hace                                          |
|--------------------------------------------|----------------------------------------------------|
| `docker compose ps`                         | Ver estado de los contenedores                     |
| `docker compose logs -f <servicio>`         | Ver logs en vivo (`app`, `db`, `proxy`)             |
| `docker compose restart <servicio>`         | Reiniciar un servicio puntual                      |
| `docker compose down`                       | Detener y quitar contenedores (conserva volúmenes) |
| `docker compose down -v`                    | Detener y **borrar también los volúmenes** (⚠️ destruye datos, no usar en producción sin motivo explícito) |
