import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import  "core-js/es";
import  "react-app-polyfill/ie9";
import  "react-app-polyfill/stable";
import './css/reset.css';
import './css/index.css';
import App from './App'
import { ConfigProvider } from 'antd';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';
import '@ant-design/v5-patch-for-react-19';
const element:HTMLElement=document.getElementById('root') as HTMLElement;
const root = createRoot(
    element
);
const data:any = localStorage.getItem('themeConfig_honghu');
const themeConfig = JSON.parse(data) || {
    "colorPrimary": "#009b6b",
    "colorSuccess": "#0081ff",
    "colorWarning": "#ffb800",
    "colorError": "#FF4B24"
};
element.style.setProperty("--main-colorPrimary",themeConfig.colorPrimary)
element.style.setProperty("--main-colorSuccess",themeConfig.colorSuccess)
element.style.setProperty("--main-colorWarning",themeConfig.colorWarning)
element.style.setProperty("--main-colorError",themeConfig.colorError)
root.render(
    <ConfigProvider
        locale={locale}
        theme={{
            token: themeConfig
        }}
    >
        <App />
    </ConfigProvider>
);


