import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { App } from './SsrApp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const getDesc = (url) => {

  try{
    let template = fs.readFileSync(
      path.resolve(__dirname, `wiki${url}.md`),
      'utf-8',
    )
    return template;
  }catch{
    return "cannawiki"
  }

}

export function render(url, context) {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url} context={context}>
      {/* <App /> */}
      <head>
        {/* <meta property="og:title" content={`${url}`} />
        <meta property="og:site_name" content="Cannawiki"></meta>
        <meta property="og:description" content={getDesc(url)}></meta> */}

      </head>
    </StaticRouter>
   
  )
}