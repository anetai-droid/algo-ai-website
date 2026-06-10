import '../css/style.css'

/* =========================================================
 * Algo AI — フロントエンドの最小限のインタラクション
 * =======================================================*/

function track(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

function initMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]')
  const menu = document.querySelector('[data-mobile-menu]')
  if (!toggle || !menu) return

  const setOpen = (open) => {
    menu.classList.toggle('hidden', !open)
    toggle.setAttribute('aria-expanded', String(open))
    document.body.classList.toggle('overflow-hidden', open)
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true'
    setOpen(open)
  })

  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => setOpen(false))
  )

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false)
  })
}

function initFaq() {
  document.querySelectorAll('details.faq').forEach((el) => {
    el.addEventListener('toggle', () => {
      if (el.open) {
        const q = el.querySelector('summary')?.textContent?.trim() || ''
        track('faq_open', { question: q })
      }
    })
  })
}

function initFloatingCta() {
  const cta = document.querySelector('[data-floating-cta]')
  if (!cta) return
  const onScroll = () => {
    cta.classList.toggle('translate-y-40', window.scrollY < 400)
    cta.classList.toggle('opacity-0', window.scrollY < 400)
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
}

function initTracking() {
  document.querySelectorAll('[data-cta]').forEach((el) =>
    el.addEventListener('click', () =>
      track('cta_click', { label: el.dataset.cta || el.textContent.trim() })
    )
  )
  document.querySelectorAll('[data-line]').forEach((el) =>
    el.addEventListener('click', () => track('line_click'))
  )
  document.querySelectorAll('[data-service-detail]').forEach((el) =>
    el.addEventListener('click', () =>
      track('service_detail_click', { service: el.dataset.serviceDetail || '' })
    )
  )
}

function initLineLinks() {
  // LINE公式アカウントURLが未設定（lineUrl が空 → "#"）のときは
  // 壊れた導線を表示しない。URLが入れば自動的に表示される。
  document.querySelectorAll('[data-line]').forEach((el) => {
    const href = el.getAttribute('href')
    if (!href || href === '#') {
      el.style.display = 'none'
    }
  })
}

function initContactForm() {
  const form = document.querySelector('[data-contact-form]')
  if (!form) return

  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()) return
    track('contact_submit')
    const btn = form.querySelector('button[type="submit"]')
    if (btn) {
      btn.disabled = true
      btn.dataset.original = btn.textContent
      btn.textContent = '送信中…'
    }
    void e
  })
}

function initReveal() {
  const els = document.querySelectorAll('[data-reveal]')
  if (!els.length) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'))
    return
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  )
  els.forEach((el) => io.observe(el))
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header')
  if (!header) return
  const onScroll = () => {
    header.setAttribute('data-scrolled', String(window.scrollY > 8))
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
}

function initActiveNav() {
  const path = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/'
  document.querySelectorAll('[data-nav-path]').forEach((el) => {
    const target = el.dataset.navPath
    if (target === path || (target !== '/' && path.startsWith(target))) {
      el.setAttribute('aria-current', 'page')
      el.classList.add('text-navy', 'font-bold')
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu()
  initFaq()
  initFloatingCta()
  initTracking()
  initLineLinks()
  initContactForm()
  initActiveNav()
  initReveal()
  initHeaderScroll()
})
