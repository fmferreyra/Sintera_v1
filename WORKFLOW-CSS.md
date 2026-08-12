# Workflow: Editar CSS del tema Sintera

## Estructura de archivos

Los estilos están divididos en archivos fuente dentro de:
```
redmine/themes/sintera/stylesheets/
```

| Archivo                   | Qué editar ahí                                   |
|---------------------------|--------------------------------------------------|
| `tokens.css`              | Variables CSS: colores, sombras, radios          |
| `global.css`              | Estilos base, links, header, menú principal      |
| `components.css`          | Botones, formularios, tablas, flash, paginación  |
| `sidebar.css`             | Side menu desktop: layout, iconos, perfil        |
| `sidebar-responsive.css`  | Comportamiento mobile (media query ≤1024px)      |
| `login.css`               | Página de login                                  |

> **No editar `application.css` directamente** — es un archivo generado.

---

## Pasos para aplicar un cambio

### 1. Editar el archivo parcial correspondiente

Por ejemplo, para cambiar el ancho de la sidebar:

```
redmine/themes/sintera/stylesheets/sidebar.css
```

Buscar `--sintera-side-menu-width` y cambiar el valor.

---

### 2. Regenerar `application.css`

Desde la raíz del proyecto:

```powershell
powershell.exe -ExecutionPolicy Bypass -File scripts/build-theme-css.ps1
```

Salida esperada:
```
application.css rebuilt (53529 bytes)
```

---

### 3. Recompilar los assets dentro del contenedor

```powershell
docker compose exec app bash -lc "bundle exec rake assets:clobber && bundle exec rake assets:precompile"
```

Salida esperada (entre otras líneas):
```
Writing themes/sintera/application-XXXXXXXX.css
```

---

### 4. Reiniciar el contenedor

```powershell
docker compose restart app
```

---

### 5. Verificar en el navegador

Recargar la página. Si los cambios no aparecen, hacer hard refresh (`Ctrl+Shift+R`).

---

## Resumen (un solo bloque para copiar/pegar)

```powershell
powershell.exe -ExecutionPolicy Bypass -File scripts/build-theme-css.ps1
docker compose exec app bash -lc "bundle exec rake assets:clobber && bundle exec rake assets:precompile"
docker compose restart app
```

---

## Notas

- El archivo `application.css` es generado automáticamente por el script. Puede estar commiteado en git como referencia, pero siempre se regenera antes de precompilar.
- Para cambios en `theme.js` (JavaScript) NO hace falta correr el build script — solo los pasos 3 y 4.
- Para cambios en `es.yml` (traducciones) se necesita recrear el contenedor: `docker compose down app && docker compose up app -d`.
