import ReactDOM from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import {RecoilRoot} from "recoil";
import App from './App.tsx'

import '@/constant/theme/globals.css'

ReactDOM.createRoot(document.getElementById('root')!)
  .render(
    <RecoilRoot>
      <BrowserRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
        <App/>
      </BrowserRouter>
    </RecoilRoot>
  )
