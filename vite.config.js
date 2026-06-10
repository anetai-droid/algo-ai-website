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
  ogImage: '/images/ogp.png',
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
  '/co-creation.html': {
    title: '就労支援との協働モデル｜共に成長するチーム｜Algo AI',
    description:
      '就労支援の方々が、データ整理・テスト・ドキュメント制作などの工程に実作業スタッフとして参加。AIツールで生産性を高めながら、品質と社会的価値を同時に生み出すAlgo AIの協働モデルを紹介します。',
    path: '/co-creation.html',
  },
  '/works.html': {
    title: '開発実績・プロジェクト例｜AIアプリ・数理統計開発｜Algo AI',
    description:
      'ベイズ統計による需要予測、AI経理、数学問題集の自動生成、HP脆弱性診断、学会論文チェックなど。数学・統計に裏打ちされたAlgo AIの開発実績・プロジェクト例をご紹介します。',
    path: '/works.html',
  },
  '/column.html': {
    title: 'コラム・知識｜AI活用・数学統計・就労支援｜Algo AI',
    description:
      '中小企業のAI導入、ChatGPTの業務活用、就労支援現場でのAI活用、データ分析の外注、AIアプリ開発の費用相場など。法人のAI活用に役立つ知識をまとめています。',
    path: '/column.html',
  },
  '/col-ai-start.html': {
    title: '中小企業がAIを導入する前に知っておくべき5つのこと｜Algo AI',
    description:
      'AI導入で失敗しないために、中小企業が着手前に押さえておきたい5つのポイントを、目的設定・小さく始める考え方・体制づくりの観点から解説します。',
    path: '/col-ai-start.html',
  },
  '/col-chatgpt-guide.html': {
    title: 'ChatGPTを業務に使う方法：中小企業の実践ガイド｜Algo AI',
    description:
      'ChatGPTを業務で安全かつ実用的に使うための基本ステップ、向いている業務・注意点、社内ルールの作り方を、中小企業向けにわかりやすく整理しました。',
    path: '/col-chatgpt-guide.html',
  },
  '/col-welfare-ai.html': {
    title: '就労支援事業所のAI活用：業務効率化の進め方｜Algo AI',
    description:
      '就労支援・福祉の現場でAIを活用して支援員の業務負担を減らすための考え方と進め方を、記録作成や情報整理などの場面に沿って整理します。',
    path: '/col-welfare-ai.html',
  },
  '/col-app-cost.html': {
    title: 'AIアプリ開発の費用相場と発注前に確認すべきポイント｜Algo AI',
    description:
      'AIアプリ・業務システム開発の費用が何で決まるのか、見積もりの考え方、発注前に確認しておきたいポイントを、相場感の考え方とあわせて解説します。',
    path: '/col-app-cost.html',
  },
  '/col-data-outsource.html': {
    title: 'データ分析を外注するメリットと業者の選び方｜Algo AI',
    description:
      'データ分析・統計を外注するメリットと、外注先を選ぶときに確認したいポイント（専門性・進め方・コミュニケーション）を整理します。',
    path: '/col-data-outsource.html',
  },
  '/col-subsidy.html': {
    title: 'AI導入に使える補助金・助成金の調べ方｜Algo AI',
    description:
      'AI導入・IT投資に活用できる補助金・助成金の一般的な考え方と、最新情報の調べ方・確認のポイントを整理します。制度の要件は必ず最新の公募要領をご確認ください。',
    path: '/col-subsidy.html',
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
  // LINE公式アカウントURLが未設定なら、関連UI（導線・文言・連絡方法の選択肢）を
  // ビルド時に出力しない。URLが入れば全て自動的に有効化される。
  const hasLine = Boolean(env.VITE_LINE_URL && env.VITE_LINE_URL !== '#')
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
            hasLine,
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
