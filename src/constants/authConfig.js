export const msalConfig = {
    // auth: {
    //     clientId: "51bdc8d4-f5de-4d4a-97ec-ae446b32c0d2",
    //     authority: "https://login.microsoftonline.com/a3caf050-59a6-4dd2-ac1b-2566f947dd3d", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
    //     redirectUri: "http://localhost:3000/login",
    // },
    auth: {
        clientId: "eb78163a-2610-446e-9815-9298ffe657d8",
        authority: "https://login.microsoftonline.com/a3caf050-59a6-4dd2-ac1b-2566f947dd3d", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
        // redirectUri: "https://cashflow.amberholdings.vn/dashboard",
        // redirectUri: "http://localhost:3000/login",
         redirectUri: "http://localhost:3000/dashboard",
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
    }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
    // scopes: ["User.Read"],
    // scopes: ["User.Read.All"]
    scopes: ['openid', 'offline_access',"api://eb78163a-2610-446e-9815-9298ffe657d8/User.Read"],
    // scopes: ["api://eb78163a-2610-446e-9815-9298ffe657d8/user.read.info","api://eb78163a-2610-446e-9815-9298ffe657d8/User.Read"]
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
    graphMeEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me"
};