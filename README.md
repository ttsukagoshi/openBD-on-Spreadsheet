<blockquote>
openBDを使用した確認ツールは<a href="https://github.com/ttsukagoshi/chrome-ext_openBD-checker">こちらのGoogle Chrome拡張機能</a>に引き継ぎました。<strong>本ツールは更新されません。</strong>
</blockquote>

# openBD情報チェッカー
[openBD](https://openbd.jp/)にある情報をGoogleスプレッドシート上で確認するツール

# 使用方法
1. サンプルスプレッドシート「[[Sample] openBD情報チェッカー](https://docs.google.com/spreadsheets/d/1j9dac3NpPtCQWxL_-oUvZVSc7IvaGKhNGR6AqqHP1_w/edit#gid=0)」を開き、「ファイル」＞「コピーを作成」にて複製。
1. 複製したファイルの黄色セルに、調べたい書籍のISBNコードを入力。複数のISBNコードを半角カンマ「`,`」で区切って入力することもできる。
1. メニューの「openBD」＞「調べる」を押すと、項目「書籍情報」の表にその書籍の概要が表示される。

# 留意事項等
- 本ツールはopenBD APIを使用していますが、同API開発者とは関係ない立場で開発されたものです。本ツール利用にあたっては、各自の責任で事前に公式サイトの[openBD API利用規約](https://openbd.jp/terms/)を確認してください。
- サンプルスプレッドシートでは書籍3冊までの同時照会を想定して表を組んでいますが、実際はもっと多くの数を同時照会できるかと思われます。その場合は、シートに列が自動的に追加されます。
