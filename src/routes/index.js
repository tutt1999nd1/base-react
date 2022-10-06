import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Main from "../pages/Main";
import ManageAssets from "../pages/manage-assets";
import EditAssets from "../pages/manage-assets/create-update";
import DetailAsset from "../pages/manage-assets/detail";
import ManageCompany from "../pages/manage-company";
import EditCompany from "../pages/manage-company/create-update";
import DetailCompany from "../pages/manage-company/detail";
import EditCategory from "../pages/manage-category/create-update";
import DetailCategory from "../pages/manage-category/detail";
import ManageCategory from "../pages/manage-category";
import ManageCampaign from "../pages/manage-campaign";
import DetailCampaign from "../pages/manage-campaign/detail";
import EditCampaign from "../pages/manage-campaign/create-update";
import ManageSOF from "../pages/manage-sof";
import EditSOF from "../pages/manage-sof/create-update";
import DetailSOF from "../pages/manage-sof/detail";
import Login from "../pages/authentication";
import Test from "../pages/authentication/test";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import Dashboard from "../pages/dashboard";
export default function RenderRoute() {
    return (
        <Routes>
            {/*<Route path="/login" element={*/}
            {/*    <Login></Login>*/}


            {/*    // <Test></Test>*/}
            {/*}>*/}
            {/*</Route>*/}
            <Route path="/" element={
                <>
                    <AuthenticatedTemplate>
                        <Main></Main>
                    </AuthenticatedTemplate>
                    <UnauthenticatedTemplate>
                        <Login></Login>
                    </UnauthenticatedTemplate>
                </>


            }>
                <Route path="" element={<Dashboard></Dashboard>}/>
                <Route path="/dashboard" element={<Dashboard></Dashboard>}/>
                {/*<Route path="dashboard" element={<div>Dashboard</div>}/>*/}
                <Route path="assets" element={<ManageAssets></ManageAssets>}/>
                <Route path="assets/create" element={<EditAssets isUpdate={false}></EditAssets>}/>
                <Route path="assets/detail" element={<DetailAsset></DetailAsset>}/>
                <Route path="assets/update" element={<EditAssets isUpdate={true}></EditAssets>}/>
                <Route path="company" element={<ManageCompany></ManageCompany>}/>
                <Route path="company/create" element={<EditCompany isUpdate={false}></EditCompany>}/>
                <Route path="company/update" element={<EditCompany isUpdate={true}></EditCompany>}/>
                <Route path="company/detail" element={<DetailCompany></DetailCompany>}/>
                <Route path="category" element={<ManageCategory></ManageCategory>}/>
                <Route path="category/create" element={<EditCategory isUpdate={false}></EditCategory>}/>
                <Route path="category/update" element={<EditCategory isUpdate={true}></EditCategory>}/>
                <Route path="category/detail" element={<DetailCategory></DetailCategory>}/>
                <Route path="campaign" element={<ManageCampaign></ManageCampaign>}/>
                <Route path="campaign/create" element={<EditCampaign isUpdate={false}></EditCampaign>}/>
                <Route path="campaign/update" element={<EditCampaign isUpdate={true}></EditCampaign>}/>
                <Route path="campaign/detail" element={<DetailCampaign></DetailCampaign>}/>
                <Route path="sof" element={<ManageSOF>Khoản vay</ManageSOF>}/>
                <Route path="sof/create" element={<EditSOF isUpdate={false}></EditSOF>}/>
                <Route path="sof/update" element={<EditSOF isUpdate={true}></EditSOF>}/>
                <Route path="sof/detail" element={<DetailSOF></DetailSOF>}/>
                <Route path="account" element={<div>Tài khoản</div>}/>
                <Route path="company" element={<div>Công ty vay</div>}/>
                <Route path="categories" element={<div>Hạng mục</div>}/>
            </Route>
        </Routes>
    )
}