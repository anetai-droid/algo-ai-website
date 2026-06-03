<?php
/**
 * お問い合わせフォーム処理（レンタルサーバーのPHP想定）
 * - 管理者へ通知メール
 * - 相談者へ自動返信メール
 * - 送信完了後 thanks.html へリダイレクト
 *
 * 送信先メール等の実値は同階層の config.php に置く（.gitignore 済み）。
 * config.php が無い場合は config.sample.php をコピーして作成すること。
 */

mb_language('Japanese');
mb_internal_encoding('UTF-8');

// --- 設定読み込み ---
$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    exit('設定ファイル(config.php)がありません。config.sample.php をコピーして作成してください。');
}
$config = require $configPath;

// --- POST以外は拒否 ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// --- 入力取得 & サニタイズ ---
function clean($key)
{
    $v = isset($_POST[$key]) ? trim($_POST[$key]) : '';
    return preg_replace('/[\r\n]+/', ' ', $v); // ヘッダインジェクション対策（改行除去）
}

$company  = clean('company');
$name     = clean('name');
$email    = clean('email');
$tel      = clean('tel');
$service  = clean('service');
$method   = clean('contact_method');
$message  = isset($_POST['message']) ? trim($_POST['message']) : '';
$agreed   = isset($_POST['privacy_agree']);

// --- バリデーション ---
$errors = [];
if ($name === '')   $errors[] = 'お名前';
if ($message === '') $errors[] = '相談内容';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'メールアドレス';
if (!$agreed) $errors[] = 'プライバシーポリシーへの同意';

if ($errors) {
    http_response_code(400);
    exit('入力に不備があります：' . implode('、', $errors));
}

// --- 管理者への通知 ---
$adminBody = "Algo AI サイトからお問い合わせがありました。\n\n"
    . "会社名・団体名: {$company}\n"
    . "お名前: {$name}\n"
    . "メール: {$email}\n"
    . "電話番号: {$tel}\n"
    . "希望サービス: {$service}\n"
    . "希望連絡方法: {$method}\n"
    . "------------------------------\n"
    . "相談内容:\n{$message}\n";

$adminHeaders = 'From: ' . $config['from_email'] . "\r\n"
    . 'Reply-To: ' . $email . "\r\n";

$sent = mb_send_mail($config['admin_email'], $config['admin_subject'], $adminBody, $adminHeaders);

// --- 相談者への自動返信 ---
$replyBody = "{$name} 様\n\n"
    . "この度はAlgo AIへお問い合わせいただき、誠にありがとうございます。\n"
    . "以下の内容で受け付けいたしました。担当者より通常2〜3営業日以内にご連絡いたします。\n\n"
    . "------------------------------\n"
    . "希望サービス: {$service}\n"
    . "相談内容:\n{$message}\n"
    . "------------------------------\n\n"
    . "なお、本メールは送信専用です。ご返信いただいてもお答えできない場合があります。\n\n"
    . "あるご合同会社 / Algo AI\n";

$replyHeaders = 'From: ' . $config['from_email'] . "\r\n";
mb_send_mail($email, $config['auto_reply_subject'], $replyBody, $replyHeaders);

// --- 完了ページへ ---
if ($sent) {
    header('Location: ' . $config['redirect_to'], true, 303);
    exit;
}

http_response_code(500);
exit('送信に失敗しました。お手数ですが時間をおいて再度お試しください。');
