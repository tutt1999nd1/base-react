import React from "react";
import MicrosoftLogin from "react-microsoft-login";

export default function Test() {

    const authHandler = (err, data) => {
        console.log("data", data);
    };

    return (
        <MicrosoftLogin clientId={'51bdc8d4-f5de-4d4a-97ec-ae446b32c0d2'} authCallback={authHandler} />
    );
}