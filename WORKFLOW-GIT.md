# Workflow: Subir cambios a GitHub

## Repositorio

- **URL:** https://github.com/fmferreyra/Sintera_v1.git
- **Rama principal:** `main`

---

## Antes de commitear — verificar qué archivos cambiar

```powershell
git status
```

---

## Archivos importantes a incluir siempre

| Archivo/Carpeta                                        | Por qué incluirlo                          |
|-------------------------------------------------------|--------------------------------------------|
| `compose.yaml`                                        | Configuración de Docker (volúmenes, etc.)  |
| `redmine/themes/sintera/stylesheets/*.css`            | Estilos del tema (fuente + generado)       |
| `redmine/themes/sintera/javascripts/theme.js`         | Lógica JS del tema                         |
| `redmine/config/locales/es.yml`                       | Traducciones personalizadas al español     |
| `scripts/build-theme-css.ps1`                         | Script de build del CSS                    |
| `WORKFLOW-CSS.md`                                     | Este instructivo                           |
| `WORKFLOW-GIT.md`                                     | Este instructivo                           |

## Archivos que NO deben subirse

Verificar que `.gitignore` los cubra:

| Archivo/Carpeta          | Razón                                    |
|--------------------------|------------------------------------------|
| `.env`                   | Contraseñas y secrets locales            |
| `redmine/files/*`        | Archivos subidos por usuarios            |

---

## Pasos para subir cambios

### 1. Regenerar `application.css` (si editaste CSS)

```powershell
powershell.exe -ExecutionPolicy Bypass -File scripts/build-theme-css.ps1
```

### 2. Agregar todos los archivos modificados

```powershell
git add .
```

Para ser más selectivo:

```powershell
git add redmine/themes/sintera/stylesheets/
git add redmine/themes/sintera/javascripts/theme.js
git add redmine/config/locales/es.yml
git add compose.yaml
git add scripts/
git add WORKFLOW-CSS.md WORKFLOW-GIT.md
```

### 3. Verificar qué se va a commitear

```powershell
git status
git diff --staged --stat
```

### 4. Hacer el commit con un mensaje descriptivo

```powershell
git commit -m "descripción breve del cambio"
```

Ejemplos de buenos mensajes:
```
git commit -m "Sidebar: reducir ancho en mobile a 260px"
git commit -m "Tema: agregar colores secundarios al token de diseño"
git commit -m "es.yml: renombrar proyecto→equipo en la interfaz"
```

### 5. Subir a GitHub

```powershell
git push origin main
```

---

## Si es la primera vez en un servidor nuevo

```powershell
git clone https://github.com/fmferreyra/Sintera_v1.git
cd Sintera_v1
cp .env.example .env
# Editar .env con los valores reales
docker compose up -d
```

---

## Comandos útiles de referencia

| Comando                        | Qué hace                                        |
|--------------------------------|-------------------------------------------------|
| `git status`                   | Ver archivos modificados/sin trackear           |
| `git diff`                     | Ver cambios no stageados                        |
| `git diff --staged`            | Ver cambios listos para commitear               |
| `git log --oneline -10`        | Ver los últimos 10 commits                      |
| `git stash`                    | Guardar cambios temporalmente sin commitear     |
| `git stash pop`                | Recuperar cambios guardados con stash           |
| `git pull origin main`         | Traer cambios remotos antes de pushear          |
