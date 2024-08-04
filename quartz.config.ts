import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "vigonotion",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "vigonotion.com",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Playfair Display",
        body: "Proxima Nova",
        code: "Jetbrains Mono",
      },
      colors: {
        lightMode: {
          light: "#FEFDFB",
          lightgray: "#DED8D3",
          gray: "#D9A841",
          darkgray: "#69615A",
          dark: "#261E18",
          secondary: "#9A6F00",
          tertiary: "#47391F",
          highlight: "#FFB50029",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#12110F", // page background - g1
          lightgray: "#3E3933", // borders - g6
          gray: "#8A672B", // graph links, heavier borders - o8
          darkgray: "#BBB3A6", // body text - g11
          dark: "#F0EEEA", // header text and icons -  g12
          secondary: "#FFC24A", // link color, current graph node - o11
          tertiary: "#F4AF27", // hover states and visited graph nodes - o10
          highlight: "#2E210B", // internal link background, highlighted text - o3
          textHighlight: "#b3aa0288", // markdown highlighted text background
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
