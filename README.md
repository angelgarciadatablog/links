# links

Página de enlaces (tipo Linktree) de Angel García, servida en **https://www.angelgarciadatablog.com/links/**.

Repo aparte del blog a propósito: cambia cuando cambia la oferta, no cuando se publica un post.

---

## 1. Cómo está organizada la página

Qué secciones se pintan, y en qué orden, lo decide una línea de `links.json`:

```json
"orden_secciones": ["personales", "permanentes"]
```

| Sección | Qué contiene | De dónde sale | Hoy |
|---|---|---|---|
| `personales` | Blog, YouTube, canal de WhatsApp, Instagram, TikTok, LinkedIn | `secciones.personales` | ✅ visible |
| `permanentes` | Sesión de descubrimiento de 20 min | `secciones.permanentes` | ✅ visible |
| `campana` | Los botones de la campaña activa | `campanas[campana_activa]` | ⬜ **apagada** |

**Una sección fuera de `orden_secciones` no se pinta, pero sus datos siguen intactos en el archivo.** Es un interruptor, no un borrado: la campaña vuelve añadiendo `"campana"` a la lista.

Una sección **sin botones visibles tampoco se pinta**: nunca queda un título huérfano.

La sección de campaña es la única que se distingue visualmente (marco azul y título en color de acento), porque es la que recibe el tráfico de TikTok.

---

## 2. Qué es una campaña

Una campaña es el proyecto o tema en el que Ángel está metido en ese momento. Se materializa en:

- Un **video largo de YouTube** (o una playlist) que explica el proyecto completo.
- **Videos cortos en TikTok** sobre ese mismo tema, que empujan a la gente hacia el video largo.

Esta página es el puente entre las dos cosas: TikTok manda a `links`, y `links` manda al video/playlist.

Por eso la campaña **no es un flag**, es un bloque con identidad propia dentro de `campanas`:

```json
"campanas": {
  "sql": {
    "nombre": "SQL desde cero",
    "titulo": "En lo que estoy ahora: SQL desde cero",
    "descripcion": "El proyecto completo, explicado paso a paso.",
    "botones": [ ... ]
  }
}
```

### 2.1 Encender y apagar la campaña

Hoy la sección **está apagada** (2026-07-28): `orden_secciones` no incluye `"campana"`. Los cuatro bloques de campaña siguen guardados y listos.

Para encenderla:

```json
"orden_secciones": ["personales", "campana", "permanentes"]
```

Y para elegir cuál se muestra:

```json
"campana_activa": "sql"
```

Cambia a `"google-analytics"`, `"bigquery"` o `"fabric"`. La sección se reemplaza entera; las otras dos no se tocan.

> **Mientras la campaña esté apagada, el parámetro `campana` que se envía a GA4 va vacío**, aunque `campana_activa` diga `"sql"`. Es a propósito: reportar una campaña que la página no muestra ensuciaría los informes. La única fuente de verdad es lo que se ve en pantalla.

### 2.2 Crear una campaña nueva

Añadir un bloque a `campanas` con su clave (kebab-case, sin espacios) y sus botones. La receta que funciona son **dos botones**:

1. El destino de la campaña — video o playlist de YouTube. Con `"destacado": true`.
2. La asesoría full day de ese tema — a WhatsApp con mensaje precargado.

> **La clave de la campaña viaja a GA4** en el parámetro `campana`. Elegirla bien la primera vez: cambiarla después parte los informes históricos en dos.

---

## 3. Cómo editar botones

**Todo se edita en `links.json`. Nunca se tocan `index.html` ni `assets/links.js`.**

| Campo | Qué hace |
|---|---|
| `id` | Identificador único. **Es lo que se ve en GA4** — no cambiarlo una vez que tenga datos. |
| `titulo` | Texto principal. |
| `subtitulo` | Línea gris debajo. `""` para omitirla. |
| `tipo` | `"whatsapp"` (arma el link `wa.me` con mensaje precargado) o `"externo"` (usa `url`). |
| `mensaje` | Solo `tipo: whatsapp`. Texto que le aparece ya escrito a quien te escribe. |
| `url` | Solo `tipo: externo`. |
| `icono` | `web`, `youtube`, `playlist`, `instagram`, `tiktok`, `whatsapp`, `canal`, `linkedin`, `calendario`, `proyecto`, `enlace`. |
| `destacado` | `true` = fondo azul. Se usa dentro de la sección de campaña, **1 por sección**. |
| `activo` | `false` = apagado sin borrarlo del archivo. |

El orden en la página es el orden del array. Para reordenar, mover los bloques.

### 3.1 Foto de perfil

`img/perfil.png` — copia local de 256×256 px (103 KB) del original que vive en `storage.googleapis.com/angel-assets/profile/`, el mismo que usan las otras páginas.

**Es una copia deliberada, no un enlace al bucket.** La página se carga desde una bio de TikTok, casi siempre en móvil con datos: una petición externa menos importa, y el original de 720×720 pesaba 544 KB para mostrarse a 96 px.

Contrapartida: si cambias la foto en el bucket, **esta no se actualiza sola**. Hay que volver a copiarla:

```bash
curl -s -o img/perfil.png "https://storage.googleapis.com/angel-assets/profile/<archivo>.png"
sips -Z 256 img/perfil.png
```

Si prefieres que se actualice sola, pon la URL completa del bucket en `"avatar"` y listo — funciona igual, solo cambia el compromiso.

Si `avatar` está vacío o la imagen falla al cargar, se muestran las iniciales de `"iniciales"`.

---

## 4. Pendientes de completar en `links.json`

Los valores que empiezan con `PENDIENTE_` **ocultan su botón** (protección para no publicar links rotos). Faltan:

- [x] `whatsapp.numero_partes` — completado 2026-07-28
- [x] `instagram` → `url` — completado 2026-07-28
- [x] `tiktok` → `url` — completado 2026-07-28
- [ ] En cada campaña, `campana-<tema>-video` → `url` del video o playlist de YouTube (no urge: la sección de campaña está apagada)

**Estado: las dos secciones activas están completas — 7 botones visibles, ninguno oculto.**

---

## 5. Probar en local

`links.json` se carga con `fetch`, y `fetch` **no funciona abriendo el archivo con doble clic** (`file://` lo bloquea por CORS). Hay que levantar un servidor:

```bash
cd ~/repositorios/proyectos/proyecto-links/links
python3 -m http.server 8000
```

Y abrir http://localhost:8000

---

## 6. Publicación

GitHub Pages, project site. El repo **debe llamarse `links`** — el nombre del repo forma la URL `angelgarciadatablog.com/links/`. Renombrarlo rompe todos los links ya repartidos en las bios.

No lleva `CNAME` propio: el dominio se hereda del repo de la web principal (`web-angelgarciadatablog`), igual que `youtube-insights-dashboard`.

Publicar = `git push` a `main`. No hay build ni script.

---

## 7. Tracking

### 7.1 Qué envía la página

Contenedor **GTM-KDXJ37SD** (el mismo del blog), pegado a mano en `index.html`.

> ⚠️ Este repo **no pasa por `publish.py`**, que es quien bakea el snippet de GTM en el blog. Si algún día se cambia el contenedor, hay que actualizarlo aquí a mano. Es exactamente el motivo por el que `youtube-insights-dashboard` estuvo sin reportar nada hasta el 2026-07-08.

| Evento | Cuándo | Parámetros |
|---|---|---|
| `links_page_view` | Al cargar | `campana`, `campana_nombre`, `botones_visibles` |
| `link_click` | Al hacer clic en cualquier botón | `link_id`, `link_destino`, `link_seccion`, `link_posicion`, `campana` |

- `link_seccion`: `personales`, `campana` o `permanentes`. **Es el parámetro que responde la pregunta del negocio**: ¿la gente viene por la campaña o solo a buscar tus redes?
- `link_destino`: `whatsapp`, `youtube`, `instagram`, `tiktok`, `linkedin`, `web`, `otro`. Reparto por plataforma sin mantener una lista de IDs en GTM.
- `link_posicion`: 1, 2, 3… dentro de su sección. Distingue un botón que rinde poco de uno que solo está muy abajo.
- `campana`: presente en **todos** los eventos, también en los clics a links personales. Permite comparar campañas entre sí sobre la misma página.

### 7.2 Qué falta configurar en GTM (una vez)

1. Variables de capa de datos: `link_id`, `link_destino`, `link_seccion`, `link_posicion`, `campana`
2. Activador de evento personalizado: `evento - link_click`
3. Etiqueta GA4 (`G-S8EKWB6DLM`) con esos parámetros
4. **Registrar `link_id`, `link_seccion` y `campana` como dimensiones personalizadas en GA4.** Sin esto los datos llegan y se guardan, pero solo se ven en tiempo real y exploraciones — no en informes.

Mismo patrón que la etiqueta `lead_form_submit` del blog. Gotcha ya conocido: en "Nombre de la variable de capa de datos" va la clave en texto plano (`link_id`), nunca con `{{}}`.

### 7.3 UTMs — van en las bios, no en la página

Lo que hay que atribuir es **de dónde llega la gente a esta página**. Se pone en el link de cada bio:

| Dónde | URL a pegar |
|---|---|
| Instagram | `https://www.angelgarciadatablog.com/links/?utm_source=instagram&utm_medium=bio` |
| TikTok | `https://www.angelgarciadatablog.com/links/?utm_source=tiktok&utm_medium=bio` |
| YouTube | `https://www.angelgarciadatablog.com/links/?utm_source=youtube&utm_medium=bio` |
| Canal de WhatsApp | `https://www.angelgarciadatablog.com/links/?utm_source=whatsapp&utm_medium=canal` |

Con esto se cierra el círculo de la campaña: `utm_source` dice de qué red vino, `campana` dice qué se le mostró, y `link_seccion` dice si mordió el anzuelo.

**Los links que salen de aquí hacia el blog no llevan UTM a propósito.** Mismo dominio y mismo GA4: el evento `link_click` ya registra el salto. Añadir parámetros de campaña a mitad de navegación puede alterar cómo GA4 agrupa la sesión — comportamiento **no verificado** contra documentación oficial, no cambiar sin comprobarlo.

### 7.4 El tracking que no depende de GA4

Cada botón de WhatsApp lleva su propio mensaje precargado ("*...me interesa la asesoría full day de SQL*"). El mensaje que llega ya dice de qué campaña vino el lead, sin abrir ningún informe.

---

## 8. El número de WhatsApp

### 8.1 Por qué está troceado

```json
"whatsapp": { "numero_partes": ["51", "967", "130", "241"] }
```

El número viaja **dentro de la propia URL** de `wa.me`, y los enlaces `wa.me` publicados en HTML terminan indexados por buscadores. Por eso:

1. El número se guarda partido en `links.json` y se une en memoria al cargar.
2. Los botones de WhatsApp nacen con `href="#"`.
3. La URL real se escribe en el `href` recién cuando alguien va a usar el botón (`mousedown`, toque, o foco por teclado). Googlebot renderiza JavaScript pero **no dispara eventos de interacción**, así que nunca ve el número armado.

> **Qué NO es esto.** Es un obstáculo contra bots, no contra personas. Quien haga clic ve el número igual, y quien abra el código lo encuentra en 30 segundos. La protección de verdad es **un número dedicado al negocio**, distinto del personal. Esto solo evita la cosecha automática.

### 8.2 Cambiar el número

Editar `numero_partes`. Los cortes son arbitrarios — puede ser `["51","967","130","241"]` o `["519","6713","0241"]`, da igual mientras al unirlos queden solo dígitos, empiecen por el código de país y sumen entre 8 y 15 caracteres.

Si el resultado no cumple ese formato, `links.js` lo trata como vacío y **oculta todos los botones de WhatsApp** en vez de generar un link roto. Un número mal escrito se nota porque desaparecen las secciones comerciales.

### 8.3 Si se cambia de número

Los `id` de los botones no cambian, así que **el historial de GA4 sigue siendo comparable**. Lo único a revisar: los enlaces `wa.me` viejos que ya se hayan compartido por fuera de la página dejan de funcionar.

---

## 9. Estructura

```
links/
  index.html          ← estructura + snippet de GTM (no lleva contenido)
  links.json          ← LA fuente de verdad: perfil, secciones y campañas
  assets/
    links.css         ← estilos (paleta copiada del blog)
    links.js          ← lee el JSON, pinta las secciones, empuja los eventos
  img/
    favicon.png
```
