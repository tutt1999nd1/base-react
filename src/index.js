import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {persistStore} from "redux-persist";
import store from "./store/store";
import {PersistGate} from "redux-persist/integration/react";
import {BrowserRouter} from "react-router-dom";
import {PublicClientApplication} from "@azure/msal-browser";
import {MsalProvider} from "@azure/msal-react";
import {msalConfig} from "./constants/authConfig";

const msalInstance = new PublicClientApplication(msalConfig);
let persistor = persistStore(store);
const root = ReactDOM.createRoot(document.getElementById('root'));
if (window.location.hash !== '') {
    console.log("hash found" + window.location.hash);
} else {
    root.render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <MsalProvider instance={msalInstance}>
                        <App/>

                    </MsalProvider>
                </BrowserRouter>
            </PersistGate>
        </Provider>,
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


//js resposive mobile
