# Algo AI 公式サイト

このフォルダは、あるご合同会社のAI活用支援サイトです。
複数のHTMLがありますが、これは「同じサイトが重複している」のではなく、1つのサイトを複数ページで構成しているためです。

## 編集する主な場所

通常の修正は、以下を編集します。

- `index.html` トップページ
- `services.html` サービス
- `welfare-ai.html` 福祉AI
- `works.html` 実績
- `column.html` コラム一覧
- `col-*.html` 各コラム記事
- `flow.html` ご利用の流れ
- `pricing-faq.html` 料金・FAQ
- `company.html` 会社概要
- `contact.html` お問い合わせ
- `privacy.html` プライバシーポリシー
- `thanks.html` 送信完了
- `partials/header.html` 共通ヘッダー
- `partials/footer.html` 共通フッター
- `partials/head-meta.html` 共通メタ情報
- `src/css/style.css` 共通スタイル
- `src/js/main.js` 共通JavaScript
- `public/` 公開用画像・favicon・APIなど

## 触らないもの

- `node_modules/` はnpm依存パッケージです。編集しません。
- `dist/` はビルド結果です。直接編集しません。
- `.env` はローカル設定です。GitHubへ公開しません。

## 退避したもの

作業画面が散らかる原因になっていたローカル作業ファイルは、次へ退避しました。

- `_archive/local-work-20260630/`

ここは通常編集しません。

## よく使うコマンド

```powershell
npm.cmd run build
```

ビルド結果は `dist/` に出ます。