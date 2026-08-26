/* links.js — lee links.json y pinta la página.
   Nunca se editan botones ni secciones aquí: se editan en links.json. */

(function () {
  'use strict';

  var ICONOS = {
    web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9.2l5 2.8-5 2.8z" fill="currentColor" stroke="none"/></svg>',
    playlist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11M3 11h11M3 16h7"/><path d="M16 12.5l5 2.9-5 2.9z" fill="currentColor" stroke="none"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 6.2A5.2 5.2 0 0 0 19.5 10"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.6a8.4 8.4 0 0 1-12.3 7.5L3.5 20.5l1.5-5A8.4 8.4 0 1 1 21 11.6z"/><path d="M8.9 8.6c.3-.7.6-.7.9-.7h.6c.2 0 .5 0 .7.6l.7 1.6c.1.3 0 .5-.1.7l-.4.5c-.1.2-.3.4-.1.7a6 6 0 0 0 2.8 2.4c.3.1.5.1.7-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.3.1.5.3.5.5v.6c-.1.4-.4 1-1.1 1.2a3 3 0 0 1-1.8.1a10 10 0 0 1-6.3-5.7c-.3-.8-.3-1.7.1-2.4z"/></svg>',
    canal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h3l6 4V5L7 9H4z"/><path d="M17.5 8.5a5 5 0 0 1 0 7"/><path d="M20 6a8.5 8.5 0 0 1 0 12"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 10.5V17"/><circle cx="7.5" cy="7.3" r="1"/><path d="M11.5 17v-3.6a2.4 2.4 0 0 1 4.8 0V17"/><path d="M11.5 10.5V17"/></svg>',
    calendario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    proyecto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6"/><path d="M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6"/></svg>',
    enlace: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7l-1.4 1.4"/><path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.8 2.8a4 4 0 0 0 5.7 5.7l1.4-1.4"/></svg>'
  };

  var FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';

  var PENDIENTE = /^PENDIENTE_/;

  function esPendiente(valor) {
    return !valor || PENDIENTE.test(String(valor));
  }

  /* Devuelve '' si falta o trae caracteres que WhatsApp no admite en un
     usuario (3-35, minusculas, digitos, punto y guion bajo), para que las
     guardas oculten los botones en vez de generar un wa.me roto. */
  function usuarioDe(whatsapp) {
    var u = (whatsapp && whatsapp.usuario) || '';
    return /^[a-z0-9._]{3,35}$/.test(u) ? u : '';
  }

  /* Un botón se muestra si está activo y no tiene valores pendientes.
     La pertenencia a una campaña ya no se filtra aquí: la define
     en qué bloque del JSON vive el botón. */
  function visible(boton, usuarioWhatsapp) {
    if (boton.activo === false) return false;
    if (boton.tipo === 'whatsapp') return !esPendiente(usuarioWhatsapp);
    return !esPendiente(boton.url);
  }

  function urlDelBoton(boton, usuarioWhatsapp) {
    if (boton.tipo !== 'whatsapp') return boton.url;
    var texto = boton.mensaje ? '?text=' + encodeURIComponent(boton.mensaje) : '';
    return 'https://wa.me/' + usuarioWhatsapp + texto;
  }

  /* Etiqueta de destino para GA4: agrupa clics por plataforma sin
     tener que mantener una lista de IDs en el contenedor de GTM. */
  function destinoDe(boton, url) {
    if (boton.tipo === 'whatsapp') return 'whatsapp';
    var u = String(url || '').toLowerCase();
    if (u.indexOf('youtube.com') !== -1 || u.indexOf('youtu.be') !== -1) return 'youtube';
    if (u.indexOf('instagram.com') !== -1) return 'instagram';
    if (u.indexOf('tiktok.com') !== -1) return 'tiktok';
    if (u.indexOf('linkedin.com') !== -1) return 'linkedin';
    if (u.indexOf('whatsapp.com') !== -1) return 'whatsapp';
    if (u.indexOf('docs.google.com/forms') !== -1) return 'formulario';
    if (u.indexOf('angelgarciadatablog.com') !== -1) return 'web';
    return 'otro';
  }

  function crearBoton(boton, contexto) {
    var esWhatsapp = boton.tipo === 'whatsapp';
    var destino = destinoDe(boton, esWhatsapp ? '' : boton.url);

    var a = document.createElement('a');
    a.className = 'boton' + (boton.destacado ? ' destacado' : '');
    a.target = '_blank';
    a.rel = 'noopener';

    /* Desde 2026-08-26 el href va directo tambien en los de WhatsApp: el
       enlace es wa.me/<usuario>, no lleva numero, y no hay nada que un bot
       pueda cosechar del HTML. Antes nacian con href="#" y se armaban al
       interactuar solo para esconder el numero de Googlebot. */
    a.href = esWhatsapp ? urlDelBoton(boton, contexto.usuario) : boton.url;

    var icono = document.createElement('span');
    // El modificador lleva el nombre del icono para poder darle color propio
    // desde el CSS (hoy solo lo usa whatsapp; ver .boton-icono--whatsapp).
    icono.className = 'boton-icono' + (boton.icono ? ' boton-icono--' + boton.icono : '');
    icono.setAttribute('aria-hidden', 'true');
    icono.innerHTML = ICONOS[boton.icono] || ICONOS.enlace;

    var texto = document.createElement('span');
    texto.className = 'boton-texto';

    var titulo = document.createElement('span');
    titulo.className = 'boton-titulo';
    titulo.textContent = boton.titulo;
    texto.appendChild(titulo);

    if (boton.subtitulo) {
      var sub = document.createElement('span');
      sub.className = 'boton-subtitulo';
      sub.textContent = boton.subtitulo;
      texto.appendChild(sub);
    }

    var flecha = document.createElement('span');
    flecha.className = 'boton-flecha';
    flecha.setAttribute('aria-hidden', 'true');
    flecha.innerHTML = FLECHA;

    a.appendChild(icono);
    a.appendChild(texto);
    a.appendChild(flecha);

    a.addEventListener('click', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'link_click',
        link_id: boton.id,
        link_destino: destino,
        link_seccion: contexto.seccion,
        link_posicion: contexto.posicion,
        campana: contexto.campanaActiva
      });
    });

    return a;
  }

  /* Devuelve el <section> pintado, o null si no quedó ningún botón visible
     (así una sección incompleta no deja un título huérfano en la página). */
  function crearSeccion(idSeccion, datosSeccion, estado) {
    if (!datosSeccion) return null;

    var visibles = (datosSeccion.botones || []).filter(function (b) {
      return visible(b, estado.usuario);
    });
    if (visibles.length === 0) return null;

    var seccion = document.createElement('section');
    seccion.className = 'seccion seccion--' + idSeccion;

    if (datosSeccion.titulo) {
      var h2 = document.createElement('h2');
      h2.className = 'seccion-titulo';
      h2.textContent = datosSeccion.titulo;
      seccion.appendChild(h2);
    }

    if (datosSeccion.descripcion) {
      var p = document.createElement('p');
      p.className = 'seccion-descripcion';
      p.textContent = datosSeccion.descripcion;
      seccion.appendChild(p);
    }

    var lista = document.createElement('div');
    lista.className = 'lista-botones';

    visibles.forEach(function (boton, i) {
      lista.appendChild(crearBoton(boton, {
        seccion: idSeccion,
        posicion: i + 1,
        usuario: estado.usuario,
        campanaActiva: estado.campanaActiva
      }));
      estado.total++;
    });

    seccion.appendChild(lista);
    return seccion;
  }

  function pintarPerfil(perfil) {
    var avatar = document.getElementById('perfil-avatar');
    if (perfil.avatar && !esPendiente(perfil.avatar)) {
      var img = document.createElement('img');
      img.src = perfil.avatar;
      img.alt = perfil.nombre || '';
      // Si la imagen no carga, quedan las iniciales en vez de un cuadro roto.
      img.addEventListener('error', function () {
        avatar.textContent = perfil.iniciales || '';
      });
      avatar.appendChild(img);
    } else {
      avatar.textContent = perfil.iniciales || '';
    }

    document.getElementById('perfil-nombre').textContent = perfil.nombre || '';
    document.getElementById('perfil-tagline').textContent = perfil.tagline || '';
    if (perfil.nombre) document.title = perfil.nombre + ' — Links';
  }

  function pintar(datos) {
    // Interruptor temporal para comparar estilos de botón en móvil.
    // Cuando se elija uno, se deja fijo y se borran las otras variantes.
    var orden = datos.orden_secciones || ['campana', 'personales', 'permanentes'];

    // Si la sección de campaña no se pinta, no hay campaña que reportar:
    // mandar "sql" a GA4 mientras la página no muestra nada de SQL ensucia
    // los informes. La única fuente de verdad es lo que se ve en pantalla.
    var hayCampana = orden.indexOf('campana') !== -1;

    var estado = {
      campanaActiva: hayCampana ? (datos.campana_activa || '') : '',
      usuario: usuarioDe(datos.whatsapp),
      total: 0
    };

    pintarPerfil(datos.perfil || {});

    var contenedor = document.getElementById('secciones');
    var campana = hayCampana ? (datos.campanas || {})[estado.campanaActiva] : null;

    orden.forEach(function (idSeccion) {
      // "campana" es la sección especial: su contenido sale del bloque
      // de la campaña activa, no de "secciones".
      var datosSeccion = idSeccion === 'campana'
        ? campana
        : (datos.secciones || {})[idSeccion];

      var nodo = crearSeccion(idSeccion, datosSeccion, estado);
      if (nodo) contenedor.appendChild(nodo);
    });

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'links_page_view',
      campana: estado.campanaActiva,
      campana_nombre: (campana && campana.nombre) || '',
      botones_visibles: estado.total
    });
  }

  fetch('./links.json', { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(pintar)
    .catch(function (e) {
      document.getElementById('estado-error').hidden = false;
      console.error('[links] no se pudo cargar links.json:', e);
    });
})();
