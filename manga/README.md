# Orelop Static

![screenshot](https://github.com/hilosiva/orelop-static/blob/main/public/ogp.png)

## 概要

Orelop Static は、俺流の静的サイト開発環境です。
フロントエンドツールには「[Vite](https://ja.vitejs.dev/)」を利用しているため、高速に静的サイトを開発することが可能です。

- HTML + CSS（Scss/Sass）+ JavaScript（TypeScript）による開発が可能
- CSS ファイルにおいてもファイル分割やスタイルのネスト（入れ子）が可能
- CSS ファイル内でカスタムメディアクエリや、`fluid()` が利用可能
- 画像や CSS ファイル、JavaScript ファイルはビルド時にハッシュ値をファイル名に付与
- 画像はビルド時に圧縮し、WebP・AVIF ファイルを生成（htaccess で最適な画像をレスポンス）


## 準備

Orelop Static を利用するには、あらかじめ以下のツールをマシンにインストールしておいて下さい。

- [Node.js](https://nodejs.org/ja) >= 22.12.0


## インストール

1. ターミナルを開き、「Orelop Static」を初期化したいディレクトリに移動します。

```bash
cd /path/to/project-directory
```

2. 以下のコマンドを実行して、「Orelop Static」をインストールします。

■ pnpm（推奨）
```bash
pnpm create orelop@latest
```

■ npm
```bash
npm create orelop@latest
```

■ yarn
```bash
yarn create orelop@latest
```

プロジェクト名を聞かれるのでプロジェクト名を入力してエンターしてください。
続いて、利用する CSS のプリプロセッサーやフレームワーク（Sass や Tailwind CSS）や、
JavaScript のライブラリ（GSAP や Lenis、Rola）などを任意で選択してください。


## スタートページの削除

初期状態ではウェルカムページが表示されます。実際の開発を始める前に以下の手順でスタートページを削除してください。

1. `src/scripts/start.ts` を削除する
2. `src/scripts/main.ts` を開き、末尾にある `import "./start";` の行を削除する

なお、`<title>` タグはプロジェクト作成時に入力したプロジェクト名に自動置換済みのため、変更は不要です。


## 開発用サーバーの起動

以下のコマンドで開発用サーバーを起動できます。

■ pnpm（推奨）
```
pnpm dev
```

■ npm
```
npm run dev
```

■ yarn
```
yarn dev
```


## HTML の開発

HTML ファイルは「src」ディレクトリに配置して下さい。

### Public ディレクトリ内のアセット

「Public」ディレクトリ内に保存したファイルは、ビルド後に納品用テーマディレクトリとして「dist」ディレクトリにコピーされます。


## CSS/Sass の開発

「Orelop Static」は、CSS、Sass のどちらの開発にも対応しています。

CSS で開発するには「src/styles/」ディレクトリ内にある「global.css」を利用し、
Sass で開発する場合は、「global.css」を「global.scss」に変更してください。

（HTML ファイルの `<link>` 要素の `href` 属性も `scss` に変更してください。）


### ベースCSS

「global.css」にはデフォルトで以下の記述により俺流のベーススタイルの CSS を読みこんでいます。

```css
@import "vaultcss";
```

これにより、俺流のリセットや便利なカスタムプロパティなどが利用できます。

不必要な場合は削除してください。
また、reset のみ利用したい場合には、以下のように reset スタイルのみ読み込むことも可能です。

```css
@import "vaultcss/reset";
```


### ネスティングルール

「Orelop Static」は、「[CSS Nesting Module](https://www.w3.org/TR/css-nesting-1/)」に対応しているため、スタイルルールのネスト（入れ子）が利用できます。

例

```css
.hero__figure {
  height: 100vh;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
```

### カスタムメディアクエリ

カスタムメディアクエリを使うことも可能です。

`vaultcss init` を実行すると `src/styles/tokens/mediaqueries.css` が生成されます。このファイルには `/* @vaultcss mediaqueries */` マーカーが含まれており、`vite-plugin-vaultcss` がプロジェクトルートから3階層以内を自動でスキャンして検出・登録します。

ブレークポイントをカスタマイズしたい場合は、`src/styles/tokens/mediaqueries.css` を直接編集してください。

`vite.config.ts` の `vaultcss()` オプションで追加・上書きすることも可能です。

```ts
export default defineConfig({
  plugins: [
    vaultcss({
      customMedia: {
        "--sm": "(width >= 640px)",
        "--lg": "(width >= 1024px)",
      },
    }),
  ],
})
```

カスタムメディアクエリを登録することで、以下のように少ない記述量でレスポンシブ対応が可能です。

```css
.section {
  display: block grid;
  grid-template-columns: repeat(var(--cols, 1), minmax(0, 1fr));

  @media (--md) {
    --cols: 2;
  }

  @media (--lg) {
    --cols: 3;
  }
}
```


### @import

`@import` による、CSS ファイルの分割にも対応しています。

例：「base」ディレクトリ内の「reset.css」と「components」ディレクトリ内の「hero.css」の読み込み

```css
@layer settings, base, general, vendors, components;

@import "base/reset.css" layer(base);
@import "components/hero.css" layer(components);
```

Sass の場合は、glob パターンによる読み込みにも対応しています。

例：「foundation」ディレクトリと「layout」ディレクトリ内にあるすべての .scss ファイルの読み込み

```scss
@use "foundation/**/*.scss";
@use "layout/**/*.scss";
```

### 分割したCSSファイルで画像を参照する

`@import` で読み込む分割ファイルに `background-image` などで画像を参照する場合、相対パスはバンドル時に元ファイルの位置を基準に解決しようとするためパスが壊れることがあります。
`@` エイリアスを使うと、Vite がビルド時に `src/` からのパスとして正しく解決してくれます。

```css
/* ❌ 相対パスはバンドル後にパスが壊れる場合がある */
.hero {
  background-image: url("../../assets/images/hero.jpg");
}

/* ✅ @ エイリアスを使うと src/ からのパスでViteが解決してくれる */
.hero {
  background-image: url("@/assets/images/hero.jpg");
}
```

### オリジナル関数

CSS ファイル内では、下記のオリジナル関数が利用可能です。

- `fluid()` : 最小値・最大値から `clamp()` / `max()` / `min()` / `calc()` を生成

```css
/* 基本（clamp 出力） */
p {
  font-size: fluid(16px 24px);
  /* → clamp(1rem, calc(.878641rem + .517799vi), 1.5rem) */
}

/* snap モード: カンプサイズ基準で外挿 */
.catch {
  font-size: fluid(40px 80px, snap);
}

/* 上限なし */
.hero {
  font-size: fluid(24px 48px, free-max);
}
```

| キーワード | 出力 | 説明 |
|---|---|---|
| （なし） | `clamp()` | 上下限あり（デフォルト） |
| `snap` | `clamp()` | カンプサイズを基点に外挿 |
| `fit` | `clamp()` | global snap 時に classic に戻す |
| `free-max` | `max()` | 上限なし |
| `free-min` | `min()` | 下限なし |
| `free` | `calc()` のみ | 上下限なし |

最小値と最大値には `px` または `rem` が使えます。

オプションを変更する場合は、`vite.config.ts` で `vaultcss()` に指定します。

詳細は、[lightningcss-plugin-fluid](https://github.com/hilosiva/lightningcss-plugins) をご確認ください。

```ts
export default defineConfig({
  plugins: [
    vaultcss({
      fluid: {
        minViewPort: 375,   // 対応幅の最小（px）
        maxViewPort: 1920,  // 対応幅の最大（px）
        baseFontSize: 16,   // px → rem 変換の基準
        unit: "vi",         // 使用する単位（規定値: "vi"）
        minCompSize: 440,   // snap モード: カンプ最小幅（px）
        maxCompSize: 1440,  // snap モード: カンプ最大幅（px）
        mode: "snap",       // 全体を snap モードに（省略時は inline snap のみ）
      }
    }),
  ],
})
```


## JavaScript の開発

JavaScript の開発は「src/scripts/」ディレクトリ内の「main.ts」を利用して下さい。
JavaScript を利用する場合は拡張子を `.js` に変更してください。

（HTML ファイルの `<script>` 要素の `src` 属性も `js` に変更してください。）


## 納品データの準備

以下のコマンドを実行すると、「dist」ディレクトリが作成され、納品用のファイルが生成されます。

■ pnpm（推奨）
```
pnpm build
```

■ npm
```
npm run build
```

■ yarn
```
yarn build
```

ビルドを行うと、「src/assets/images/」ディレクトリ内の画像ファイルを最適化（圧縮や、WebP ファイルなどの生成）を行い、ハッシュ値をつけて「dist/assets/images/」内に配置されます。

画像の圧縮率や、生成するフォーマットなどに関しては、[@hilosiva/vite-plugin-image-optimizer](https://github.com/hilosiva/vite-plugins/tree/main/packages/vite-plugin-image-optimizer) を利用しているため、同パッケージのオプションで設定して下さい。

「.htaccess」を使用しており、WebP が利用できるブラウザで閲覧した場合、「.jpg」や「.png」ファイルは WebP ファイルがレスポンスされます。

.scss ファイルや .css ファイルは、「dist/assets/styles/」内に「index-[ハッシュ値].css」というファイル名で配置されます。

.js ファイルは「dist/assets/scripts/」内に「main-[ハッシュ値].js」というファイル名で配置されます。


## 納品データのプレビュー

以下のコマンドを実行すると、「dist」ディレクトリをベースにサーバーが立ち上がります。

■ pnpm（推奨）
```
pnpm preview
```

■ npm
```
npm run preview
```

■ yarn
```
yarn preview
```
