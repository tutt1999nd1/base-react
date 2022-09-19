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
                <Route path="/dashboard" element={<div>Dashboard</div>} />
                <Route path="/assets" element={<div>Tài sản</div>} />
                <Route path="/loan-purpose" element={<div>Mục đích vay</div>} />
                <Route path="/loan-amount" element={<div>Khoản vay</div>} />
                <Route path="/account" element={<div>Tài khoản</div>} />
                <Route path="/company" element={<div>Công ty vay</div>} />
                <Route path="/categories" element={<div>Hạng mục</div>} />
            </Route>
        </Routes>
    )
}