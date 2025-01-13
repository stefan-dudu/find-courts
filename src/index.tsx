import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "react-oidc-context";
const cognitoAuthConfig = {
  authority: process.env.REACT_APP_COGNITO_AUTH_CONFIG_AUTHORTITY,
  client_id: process.env.REACT_APP_COGNITO_AUTH_CONFIG_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_COGNITO_AUTH_CONFIG_REDIRECT,
  response_type: "code",
  scope: "phone openid email",
};

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
