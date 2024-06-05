import ReactDOM from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import {RecoilRoot} from "recoil";
import App from './App.tsx'

import '@/constant/theme/globals.css'
import "@/constant/theme/echarts.ts"

ReactDOM.createRoot(document.getElementById('root')!)
  .render(
    <RecoilRoot>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </RecoilRoot>
  )
