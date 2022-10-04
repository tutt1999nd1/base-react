import logo from './logo.svg';
import './App.css';
import RenderRoute from "./routes";
import 'react-toastify/dist/ReactToastify.css';
import './assets/treeview.css'
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import {msalConfig} from "./constants/authConfig";
const msalInstance = new PublicClientApplication(msalConfig);
function App() {
  return (
    <MsalProvider instance={msalInstance}>
        <RenderRoute></RenderRoute>
    </MsalProvider>
  );
}

export default App;
