import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from "../pages/Main";
export default function RenderRoute() {
    return (
        <Routes>
            <Route path="/home" element={
                <div>Home</div>
            }>
            </Route>
            <Route path="/" element={
                <Main></Main>
            }>
                <Route path="" element={<div>Main1</div>} />
                <Route path="/main1" element={<div>Main1</div>} />
                <Route path="/main2" element={<div>Main2</div>} />
            </Route>
        </Routes>
    )
}