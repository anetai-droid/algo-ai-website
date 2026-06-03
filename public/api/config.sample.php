<?php
/**
 * フォーム設定のサンプル。
 * このファイルを config.php にコピーし、実値を設定してください。
 *   cp config.sample.php config.php
 * config.php は .gitignore 済みなので GitHub には公開されません。
 */
return [
    // 問い合わせの送信先メールアドレス（管理者）
    'admin_email' => 'info@example.com',

    // 送信元（From）に使うメールアドレス。サーバーのドメインと一致させる。
    'from_email' => 'no-reply@example.com',

    // 件名
    'admin_subject' => '【Algo AI】お問い合わせがありました',
    'auto_reply_subject' => '【Algo AI】お問い合わせを受け付けました',

    // 送信完了後にリダイレクトするページ
    'redirect_to' => '/thanks.html',
];
