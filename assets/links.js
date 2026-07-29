/* links.js — lee links.json y pinta la página.
   Nunca se editan botones aquí: se editan en links.json. */

(function () {
  'use strict';

  var ICONOS = {
    web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9.2l5 2.8-5 2.8z" fill="currentColor" stroke="none"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 6.2A5.2 5.2 0 0 0 19.5 10"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.6a8.4 8.4 0 0 1-12.3 7.5L3.5 20.5l1.5-5A8.4 8.4 0 1 1 21 11.6z"/><path d="M8.9 8.6c.3-.7.6-.7.9-.7h.6c.2 0 .5 0 .7.6l.7 1.6c.1.3 0 .5-.1.7l-.4.5c-.1.2-.3.4-.1.7a6 6 0 0 0 2.8 2.4c.3.1.5.1.7-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.3.1.5.3.5.5v.6c-.1.4-.4 1-1.1 1.2a3 3 0 0 1-1.8.1a10 10 0 0 1-6.3-5.7c-.3-.8-.3-1.7.1-2.4z"/></svg>',
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

  /* Un botón se muestra si está activo, no tiene valores pendientes,
     y su campaña es la activa (o "*" = siempre visible). */
  function visible(boton, campanaActiva, numeroWhatsapp) {
    if (boton.activo === false) return false;

    var campanas = boton.campanas || ['*'];
    if (campanas.indexOf('*') === -1 && campanas.indexOf(campanaActiva) === -1) return false;

    if (boton.tipo === 'whatsapp') return !esPendiente(numeroWhatsapp);
    return !esPendiente(boton.url);
  }

  function urlDelBoton(boton, numeroWhatsapp) {
    if (boton.tipo !== 'whatsapp') return boton.url;
    var texto = boton.mensaje ? '?text=' + encodeURIComponent(boton.mensaje) : '';
    return 'https://wa.me/' + numeroWhatsapp + texto;
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
    if (u.indexOf('chat.whatsapp.com') !== -1) return 'whatsapp';
    if (u.indexOf('angelgarciadatablog.com') !== -1) return 'web';
    return 'otro';
  }

  function crearBoton(boton, campanaActiva, numeroWhatsapp, posicion) {
    var url = urlDelBoton(boton, numeroWhatsapp);
    var destino = destinoDe(boton, url);

    var a = document.createElement('a');
    a.className = 'boton' + (boton.destacado ? ' destacado' : '');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';

    var icono = document.createElement('span');
    icono.className = 'boton-icono';
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
        link_posicion: posicion,
        campana: campanaActiva
      });
    });

    return a;
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
    var campanaActiva = datos.campana_activa || '';
    var numero = (datos.whatsapp && datos.whatsapp.numero) || '';
    var contenedor = document.getElementById('lista-botones');

    pintarPerfil(datos.perfil || {});

    var visibles = (datos.botones || []).filter(function (b) {
      return visible(b, campanaActiva, numero);
    });

    // Los destacados de la campaña activa van arriba; el resto conserva el orden del JSON.
    visibles.sort(function (a, b) {
      return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0);
    });

    visibles.forEach(function (boton, i) {
      contenedor.appendChild(crearBoton(boton, campanaActiva, numero, i + 1));
    });

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'links_page_view',
      campana: campanaActiva,
      botones_visibles: visibles.length
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
