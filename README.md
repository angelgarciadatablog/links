# links

Página de enlaces (tipo Linktree) de Angel García, servida en **https://www.angelgarciadatablog.com/links/**.

Repo aparte del blog a propósito: cambia cuando cambia la oferta, no cuando se publica un post.

---

## 1. Cómo cambiar la página

**Todo se edita en `links.json`. Nunca se tocan `index.html` ni `assets/links.js` para añadir o quitar botones.**

### 1.1 Cambiar de campaña

Una sola línea:

```json
"campana_activa": "sql"
```

Cambia a `"google-analytics"`, `"bigquery"` o `"fabric"` y los botones de esa campaña aparecen; los de las otras desaparecen. Los botones con `"campanas": ["*"]` (blog, YouTube, comunidad, redes, sesión de descubrimiento) se ven siempre.

Para dejar la página sin campaña activa: `"campana_activa": ""`. Solo quedan los `["*"]`.

### 1.2 Añadir un botón

Copiar un bloque de `botones` y ajustar:

| Campo | Qué hace |
|---|---|
| `id` | Identificador único. **Es lo que se ve en GA4** — no cambiarlo una vez que tenga datos. |
| `titulo` | Texto principal. |
| `subtitulo` | Línea gris debajo. Opcional, dejar `""` para omitirla. |
| `tipo` | `"whatsapp"` (arma el link `wa.me` con mensaje precargado) o `"externo"` (usa `url`). |
| `mensaje` | Solo para `tipo: whatsapp`. Texto que le aparece ya escrito a quien te escribe. |
| `url` | Solo para `tipo: externo`. |
| `icono` | `web`, `youtube`, `instagram`, `tiktok`, `whatsapp`, `linkedin`, `calendario`, `proyecto`, `enlace`. |
| `destacado` | `true` = fondo azul y sube al tope de la lista. **Máximo 1 o 2 por campaña**, si no pierde el efecto. |
| `activo` | `false` = apagado sin borrarlo del archivo. |
| `campanas` | `["*"]` siempre visible, o `["sql"]` solo en esa campaña. Acepta varias: `["sql","bigquery"]`. |

### 1.3 Orden de los botones

Es el orden del array, con una excepción: **los `destacado: true` suben automáticamente al tope.** Para reordenar el resto, mover los bloques dentro del JSON.

### 1.4 Foto de perfil

Dejar el archivo en `img/` y apuntarlo:

```json
"avatar": "./img/perfil.jpg"
```

Si está vacío o la imagen falla, se muestran las iniciales. Recomendado: cuadrada, 400×400 px o más.

---

## 2. Pendientes de completar en `links.json`

Los valores que empiezan con `PENDIENTE_` **hacen que el botón no se muestre** (protección para no publicar un link roto). Faltan:

- [ ] `whatsapp.numero` — solo dígitos, con código de país, sin `+`. Sin esto **ningún botón de WhatsApp aparece**, incluidas las asesorías.
- [ ] `comunidad-whatsapp` → `url` (link de invitación `chat.whatsapp.com/...`) y poner `"activo": true`
- [ ] `instagram` → `url` y poner `"activo": true`
- [ ] `tiktok` → `url` y poner `"activo": true`
- [ ] `proyecto-sql-gratuito` → hoy apunta al canal; cambiar a la URL del video del proyecto cuando exista

---

## 3. Probar en local

`links.json` se carga con `fetch`, y `fetch` **no funciona abriendo el archivo con doble clic** (`file://` lo bloquea por CORS). Hay que levantar un servidor:

```bash
cd ~/repositorios/proyectos/proyecto-links/links
python3 -m http.server 8000
```

Y abrir http://localhost:8000

---

## 4. Publicación

GitHub Pages, project site. El repo **debe llamarse `links`** — el nombre del repo es el que forma la URL `angelgarciadatablog.com/links/`. Renombrarlo rompe todos los links ya repartidos en las bios.

No lleva `CNAME` propio: el dominio se hereda del repo de la web principal (`web-angelgarciadatablog`), igual que `youtube-insights-dashboard`.

Publicar = `git push` a `main`. No hay build ni script.

---

## 5. Tracking

### 5.1 Qué envía la página

Contenedor **GTM-KDXJ37SD** (el mismo del blog), pegado a mano en `index.html`.

> ⚠️ Este repo **no pasa por `publish.py`**, que es quien bakea el snippet de GTM en el blog. Si algún día se cambia el contenedor, hay que actualizarlo aquí a mano. Es exactamente el motivo por el que `youtube-insights-dashboard` estuvo sin reportar nada hasta el 2026-07-08.

Dos eventos al `dataLayer`:

| Evento | Cuándo | Parámetros |
|---|---|---|
| `links_page_view` | Al cargar | `campana`, `botones_visibles` |
| `link_click` | Al hacer clic en cualquier botón | `link_id`, `link_destino`, `link_posicion`, `campana` |

- `link_destino`: `whatsapp`, `youtube`, `instagram`, `tiktok`, `linkedin`, `web`, `otro`. Permite ver el reparto por plataforma sin mantener una lista de IDs en GTM.
- `link_posicion`: 1, 2, 3… Sirve para saber si un botón rinde poco o simplemente está muy abajo.

### 5.2 Qué falta configurar en GTM (una vez)

1. Variables de capa de datos: `link_id`, `link_destino`, `link_posicion`, `campana`
2. Activador de evento personalizado: `evento - link_click`
3. Etiqueta GA4 (`G-S8EKWB6DLM`) con esos cuatro parámetros
4. **Registrar `link_id`, `link_destino` y `campana` como dimensiones personalizadas en GA4.** Sin esto los datos llegan y se guardan, pero solo se ven en tiempo real y exploraciones — no en informes.

Mismo patrón que la etiqueta `lead_form_submit` del blog. Gotcha ya conocido: en "Nombre de la variable de capa de datos" va la clave en texto plano (`link_id`), nunca con `{{}}`.

### 5.3 UTMs — van en las bios, no en la página

Lo que hay que atribuir es **de dónde llega la gente a esta página**. Se pone en el link de cada bio:

| Dónde | URL a pegar |
|---|---|
| Instagram | `https://www.angelgarciadatablog.com/links/?utm_source=instagram&utm_medium=bio` |
| TikTok | `https://www.angelgarciadatablog.com/links/?utm_source=tiktok&utm_medium=bio` |
| YouTube | `https://www.angelgarciadatablog.com/links/?utm_source=youtube&utm_medium=bio` |

**Los links que salen de aquí hacia el blog no llevan UTM a propósito.** Mismo dominio y mismo GA4: el evento `link_click` ya dice que el salto ocurrió, y añadir parámetros de campaña a mitad de la navegación puede alterar cómo GA4 agrupa la sesión (comportamiento que no está verificado contra la documentación oficial — no cambiar sin comprobarlo).

### 5.4 El tracking que no depende de GA4

Cada botón de WhatsApp lleva su propio mensaje precargado ("*...me interesa la asesoría full day de SQL*"). El mensaje que llega ya dice de qué campaña vino el lead, sin abrir ningún informe.

---

## 6. Estructura

```
links/
  index.html          ← estructura + snippet de GTM (no lleva contenido)
  links.json          ← LA fuente de verdad: perfil, campaña y botones
  assets/
    links.css         ← estilos (paleta copiada del blog)
    links.js          ← lee el JSON, pinta los botones, empuja los eventos
  img/
    favicon.png
```
