import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import handlebars from 'vite-plugin-handlebars'

// サイト全体で共有するメタ情報
const SITE = {
  name: 'Algo AI',
  company: 'あるご合同会社',
  // 本番ドメインが確定したら .env の SITE_URL で上書きする
  defaultUrl: 'https://algo-ai.jp',
  ogImage: '/images/ogp.svg',
}

// ページごとの <title> / description / OGP / canonical を一元管理
const pages = {
  '/index.html': {
    title: '中小企業と福祉現場に、実務で使えるAIを。｜Algo AI',
    description:
      'Algo AIは、AI導入の相談から業務改善、AIアプリ開発、社内定着までを支援する法人向けAI活用支援サービスです。中小企業・福祉現場に寄り添い、現場で使えるAI活用を伴走支援します。',
    path: '/',
  },
  '/services.html': {
    title: 'サービス一覧｜AI導入・開発・福祉支援・統計｜Algo AI',
    description:
      'AI導入コンサルティング、AIアプリ・業務システム開発、福祉・就労支援向けAI活用支援、数学・統計コンサルティング。Algo AIが提供する4つのサービスの対象者・課題・成果を紹介します。',
    path: '/services.html',
  },
  '/welfare-ai.html': {
    title: '福祉・就労支援向けAI活用支援｜Algo AI',
    description:
      '就労継続支援A型・B型、福祉法人、NPO向けのAI活用支援。支援員の業務負担軽減、利用者の作業機会拡大、AIを活用した新しい仕事づくりを伴走支援します。',
    path: '/welfare-ai.html',
  },
  '/flow.html': {
    title: 'ご利用の流れ｜Algo AI',
    description:
      'お問い合わせから初回ヒアリング、課題整理、ご提案・お見積もり、導入・開発、運用支援・改善まで。Algo AIのご利用の流れを6ステップで説明します。',
    path: '/flow.html',
  },
  '/pricing-faq.html': {
    title: '料金・よくあるご質問｜Algo AI',
    description:
      'AI導入相談・開発・福祉支援・統計コンサルティングの料金の目安と、よくあるご質問をまとめました。初回相談は無料です。',
    path: '/pricing-faq.html',
  },
  '/company.html': {
    title: '会社概要｜あるご合同会社（Algo AI）',
    description:
      'Algo AIを運営するあるご合同会社の会社概要。所在地、事業内容、代表プロフィール、AI・IT開発と数学・統計コンサルティングの実績をご紹介します。',
    path: '/company.html',
  },
  '/contact.html': {
    title: 'お問い合わせ・無料相談｜Algo AI',
    description:
      'AI活用に関するご相談・お見積もりはこちら。フォームまたはLINEからお気軽にお問い合わせください。初回相談は無料です。',
    path: '/contact.html',
  },
  '/thanks.html': {
    title: '送信完了｜Algo AI',
    description: 'お問い合わせありがとうございます。送信が完了しました。',
    path: '/thanks.html',
    noindex: true,
  },
  '/privacy.html': {
    title: 'プライバシーポリシー｜Algo AI',
    description:
      'あるご合同会社（Algo AI）の個人情報保護方針。個人情報の取得・利用目的・第三者提供・安全管理・Cookieの取り扱いについて記載しています。',
    path: '/privacy.html',
  },
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.SITE_URL || SITE.defaultUrl).replace(/\/$/, '')
  const gaId = env.VITE_GA4_ID || ''
  const lineUrl = env.VITE_LINE_URL || '#'
  const contactEndpoint = env.VITE_CONTACT_ENDPOINT || '/api/contact.php'

  return {
    plugins: [
      tailwindcss(),
      handlebars({
        partialDirectory: resolve(__dirname, 'partials'),
        context(pagePath) {
          const meta = pages[pagePath] || {}
          return {
            site: SITE,
            siteUrl,
            gaId,
            lineUrl,
            contactEndpoint,
            page: {
              title: meta.title || `${SITE.name}`,
              description: meta.description || '',
              canonical: siteUrl + (meta.path || pagePath),
              ogImage: siteUrl + SITE.ogImage,
              noindex: meta.noindex || false,
            },
          }
        },
      }),
    ],
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: Object.keys(pages).reduce((acc, key) => {
          const name = key.replace(/^\//, '').replace(/\.html$/, '')
          acc[name] = resolve(__dirname, key.replace(/^\//, ''))
          return acc
        }, {}),
      },
    },
  }
})
