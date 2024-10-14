import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const PageLogo: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <a href={baseDir} class={classNames(displayClass, "page-logo")}>
      <svg xmlns="http://www.w3.org/2000/svg" width="300" viewBox="0 0 529.29 154.29">
        <g transform="translate(-316.43 -603.17)">
          <g strokeWidth="1" fontFamily="Raleway" letterSpacing="0" wordSpacing="0">
            <g fontWeight="bold" fill="currentColor">
              <path d="M443.25 659.01l11.52 32.22 11.4-32.22h8.7l-16.62 42.6h-6.96l-16.74-42.6zM479.42 701.61v-42.6h8.28v42.6zM526.1 696.81q-5.1 5.1-11.88 5.1-4.2 0-7.92-1.68-3.66-1.68-6.42-4.62-2.7-2.94-4.32-6.9-1.56-4.02-1.56-8.64 0-4.38 1.56-8.22 1.62-3.9 4.38-6.78 2.82-2.94 6.6-4.62 3.78-1.74 8.22-1.74 6 0 10.26 2.52 4.32 2.52 6.48 6.78l-6.18 4.56q-1.62-3.18-4.56-4.86-2.88-1.68-6.3-1.68-2.7 0-4.98 1.14-2.22 1.14-3.84 3.12-1.56 1.98-2.46 4.56-.84 2.58-.84 5.46 0 3 .96 5.64.96 2.58 2.64 4.5t3.96 3.06q2.34 1.08 5.04 1.08 6.18 0 11.16-5.82v-3h-8.58v-6.06h15.42v21.9h-6.84zM558.18 701.91q-4.68 0-8.52-1.8-3.78-1.86-6.54-4.86-2.7-3.06-4.2-6.96t-1.5-7.98q0-4.26 1.56-8.16 1.62-3.9 4.38-6.9 2.82-3 6.66-4.74 3.84-1.8 8.34-1.8 4.62 0 8.4 1.92 3.84 1.86 6.54 4.92t4.2 6.96 1.5 7.92q0 4.26-1.56 8.16-1.56 3.84-4.32 6.84-2.76 2.94-6.6 4.74-3.84 1.74-8.34 1.74zm-12.36-21.6q0 2.76.84 5.34t2.4 4.56q1.62 1.98 3.9 3.18 2.34 1.2 5.28 1.2 3 0 5.28-1.2 2.34-1.26 3.9-3.3 1.62-2.04 2.4-4.56.84-2.58.84-5.22 0-2.76-.9-5.34-.84-2.58-2.46-4.56-1.56-1.98-3.9-3.12-2.28-1.2-5.16-1.2-3 0-5.34 1.26-2.34 1.2-3.9 3.24-1.56 1.98-2.4 4.56-.78 2.52-.78 5.16z"></path>
            </g>
            <g fontSize="60" fill="currentColor">
              <path d="M590.45 666.81v34.8h-4.2v-42.6h3.24l28.2 35.46v-35.4h4.2v42.54h-3.66zM649.7 701.91q-4.44 0-8.16-1.8-3.66-1.86-6.3-4.86-2.64-3.06-4.08-6.96t-1.44-7.98q0-4.26 1.5-8.16 1.56-3.9 4.26-6.9t6.36-4.74q3.66-1.8 7.92-1.8 4.44 0 8.1 1.92 3.72 1.86 6.3 4.92 2.64 3.06 4.08 6.96 1.44 3.84 1.44 7.86 0 4.26-1.56 8.16-1.5 3.9-4.2 6.9-2.64 2.94-6.3 4.74-3.66 1.74-7.92 1.74zm-15.78-21.6q0 3.48 1.14 6.72 1.14 3.18 3.24 5.7 2.1 2.46 4.98 3.96 2.88 1.44 6.42 1.44 3.6 0 6.54-1.56t4.98-4.08 3.12-5.7q1.14-3.18 1.14-6.48 0-3.48-1.2-6.66-1.14-3.24-3.24-5.7t-4.98-3.9q-2.88-1.5-6.36-1.5-3.6 0-6.54 1.56-2.94 1.5-4.98 4.02t-3.18 5.7q-1.08 3.18-1.08 6.48zM705.91 662.73h-15.18v38.88h-4.2v-38.88h-15.18v-3.72h34.56zM712.23 701.61v-42.6h4.2v42.6zM744.27 701.91q-4.44 0-8.16-1.8-3.66-1.86-6.3-4.86-2.64-3.06-4.08-6.96t-1.44-7.98q0-4.26 1.5-8.16 1.56-3.9 4.26-6.9t6.36-4.74q3.66-1.8 7.92-1.8 4.44 0 8.1 1.92 3.72 1.86 6.3 4.92 2.64 3.06 4.08 6.96 1.44 3.84 1.44 7.86 0 4.26-1.56 8.16-1.5 3.9-4.2 6.9-2.64 2.94-6.3 4.74-3.66 1.74-7.92 1.74zm-15.78-21.6q0 3.48 1.14 6.72 1.14 3.18 3.24 5.7 2.1 2.46 4.98 3.96 2.88 1.44 6.42 1.44 3.6 0 6.54-1.56t4.98-4.08 3.12-5.7q1.14-3.18 1.14-6.48 0-3.48-1.2-6.66-1.14-3.24-3.24-5.7t-4.98-3.9q-2.88-1.5-6.36-1.5-3.6 0-6.54 1.56-2.94 1.5-4.98 4.02t-3.18 5.7q-1.08 3.18-1.08 6.48zM776.43 666.81v34.8h-4.2v-42.6h3.24l28.2 35.46v-35.4h4.2v42.54h-3.66z"></path>
            </g>
          </g>
          <rect
            width="519.29"
            height="144.29"
            x="321.43"
            y="608.17"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="10"
            ry="0"
          ></rect>
          <g fillRule="evenodd" fill="currentColor">
            <path
              d="M74.409-120L44.587-16h35.412L5.59 120 35.412 16H0zM-5.59 120L-35.414 16H0L-74.41-120l29.822 104H-80z"
              transform="translate(378.33 680.31) scale(.4256)"
            ></path>
          </g>
        </g>
        <script></script>
      </svg>
    </a>
  )
}

PageLogo.css = `
.page-logo {
  margin-right: 10px;
  color: var(--dark) !important;
}

.page-logo > svg {
  max-width: 14rem;
  width: 100%;
}
`

export default (() => PageLogo) satisfies QuartzComponentConstructor