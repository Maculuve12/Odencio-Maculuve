// ============================================================
// site-extras.js — funcionalidades compartilhadas por todas as páginas
// Requer: supabase-config.js carregado antes deste ficheiro
// ============================================================

// ---------- Botão flutuante do WhatsApp ----------
async function initWhatsAppButton(linkFallback) {
  let link = linkFallback;
  try {
    const { data } = await window.supabaseClient
      .from('contactos')
      .select('valor')
      .eq('plataforma', 'whatsapp')
      .eq('ativo', true)
      .limit(1)
      .maybeSingle();
    if (data && data.valor) link = data.valor;
  } catch (err) {
    console.warn('Não foi possível carregar o link do WhatsApp, a usar padrão.', err);
  }

  const btn = document.createElement('a');
  btn.href = link;
  btn.target = '_blank';
  btn.rel = 'noopener';
  btn.className = 'wa-float-btn';
  btn.title = 'Falar no WhatsApp';
  btn.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
  document.body.appendChild(btn);
}

// ---------- Animações suaves ao rolar (fade-in) ----------
function initScrollReveal() {
  const alvos = document.querySelectorAll('.reveal');
  if (!alvos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  alvos.forEach(el => observer.observe(el));
}

// ---------- Newsletter ----------
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  const input = document.getElementById('newsletterEmail');
  const btn = document.getElementById('newsletterBtn');
  const msg = document.getElementById('newsletterMsg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!email) return;

    btn.disabled = true;
    msg.textContent = '';
    msg.className = 'newsletter-msg';

    try {
      const { error } = await window.supabaseClient
        .from('newsletter')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505' || (error.message || '').toLowerCase().includes('duplicate')) {
          msg.textContent = 'Este e-mail já está inscrito. Obrigado!';
          msg.classList.add('ok');
        } else {
          throw error;
        }
      } else {
        msg.textContent = 'Inscrito com sucesso! Vais saber de tudo em primeira mão.';
        msg.classList.add('ok');
        form.reset();
      }
    } catch (err) {
      msg.textContent = 'Erro: ' + (err.message || JSON.stringify(err));
      msg.classList.add('erro');
      console.error('Erro newsletter:', err);
    } finally {
      btn.disabled = false;
    }
  });
}

// ---------- Partilha (WhatsApp + copiar link) ----------
function partilharWhatsApp(titulo, url) {
  const texto = encodeURIComponent(titulo + ' — ' + url);
  window.open('https://wa.me/?text=' + texto, '_blank');
}

// Partilha universal: abre o menu nativo do sistema (qualquer app/rede social).
// Se o navegador não suportar (ex: PC/desktop), volta para o WhatsApp como alternativa.
function nativeShare(titulo, url) {
  if (navigator.share) {
    navigator.share({ title: titulo, url: url }).catch(() => {});
  } else {
    partilharWhatsApp(titulo, url);
  }
}

function copiarLink(url, btnEl) {
  navigator.clipboard.writeText(url).then(() => {
    const original = btnEl.innerHTML;
    btnEl.innerHTML = '<i class="fa-solid fa-check"></i>';
    setTimeout(() => { btnEl.innerHTML = original; }, 1500);
  }).catch(() => {
    prompt('Copia o link:', url);
  });
}

// ---------- Inicialização automática ----------
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNewsletterForm();
});
