import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from "../pages/Main";
import ManageAssets from "../pages/manage-assets";
import EditAssets from "../pages/manage-assets/create-update";
import DetailAsset from "../pages/manage-assets/detail";
import ManageCompany from "../pages/manage-company";
import EditCompany from "../pages/manage-company/create-update";
import DetailCompany from "../pages/manage-company/detail";
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
                <Route path="" element={<ManageAssets></ManageAssets>} />
                <Route path="/dashboard" element={<div>Dashboard</div>} />
                <Route path="/assets" element={<ManageAssets></ManageAssets>} />
                <Route path="/assets/create" element={<EditAssets isUpdate = {false}></EditAssets>} />
                <Route path="/assets/detail" element={<DetailAsset ></DetailAsset>} />
                <Route path="/assets/update" element={<EditAssets isUpdate = {true}></EditAssets>} />
                <Route path="/company" element={<ManageCompany></ManageCompany>} />
                <Route path="/company/create" element={<EditCompany isUpdate = {false}></EditCompany>} />
                <Route path="/company/update" element={<EditCompany isUpdate = {true}></EditCompany>} />
                <Route path="/company/detail" element={<DetailCompany></DetailCompany>} />
                <Route path="/loan-purpose" element={<div>Mục đích vay</div>} />
                <Route path="/loan-amount" element={<div>Khoản vay</div>} />
                <Route path="/account" element={<div>Tài khoản</div>} />
                <Route path="/company" element={<div>Công ty vay</div>} />
                <Route path="/categories" element={<div>Hạng mục</div>} />
            </Route>
        </Routes>
    )
}