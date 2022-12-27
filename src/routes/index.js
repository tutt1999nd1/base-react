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
import {AuthenticatedTemplate, UnauthenticatedTemplate} from "@azure/msal-react";
import Dashboard from "../pages/dashboard";
import ManageApprove from "../pages/manage-approve";
import EditSupplier from "../pages/manage-supplier/create-update";
import DetailSupplier from "../pages/manage-supplier/detail";
import ManageSupplier from "../pages/manage-supplier";
import ManageAssetGroup from "../pages/manage-asset-group";
import EditAssetGroup from "../pages/manage-asset-group/create-update";
import DetailAssetGroup from "../pages/manage-asset-group/detail";
import ManageSofChargingEst from "../pages/manage-sof-charging-est";
import DetailSofChargingEst from "../pages/manage-sof-charging-est/detail";
import EditSofChargingEst from "../pages/manage-sof-charging-est/create-update";
import ManageMember from "../pages/manage-member";
import EditMember from "../pages/manage-member/create-update";
import DetailMember from "../pages/manage-member/detail";
import ManageChangeSof from "../pages/manage-sof/manage-change-sof";
import PayablePeriodDetail from "../pages/manage-sof-charging-est/payable-period-detail";
import CompanyHistory from "../pages/manage-company/company-history";
import CompanyMember from "../pages/manage-company/company-member";
import ManageSearchCompany from "../pages/manage-search-company";
import ModeView from "../pages/manage-search-company/mode-view";

export default function RenderRoute() {
    return (
        <Routes>
            {/*<Route path="/login" element={*/}
            {/*    <Login></Login>*/}


            {/*    // <Test></Test>*/}
            {/*}>*/}
            {/*</Route>*/}
            <Route path="search-company/view" element={<ModeView></ModeView>}/>
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
                <Route path="search-company" element={<ManageSearchCompany ></ManageSearchCompany>}/>
                <Route path="company/update" element={<EditCompany isUpdate={true}></EditCompany>}/>
                <Route path="company/detail" element={<DetailCompany></DetailCompany>}/>
                <Route path="company/member" element={<CompanyMember></CompanyMember>}/>
                <Route path="company/history" element={<CompanyHistory></CompanyHistory>}/>
                <Route path="member" element={<ManageMember></ManageMember>}/>
                <Route path="member/create" element={<EditMember isUpdate={false}></EditMember>}/>
                <Route path="member/update" element={<EditMember isUpdate={true}></EditMember>}/>
                <Route path="member/detail" element={<DetailMember></DetailMember>}/>
                <Route path="supplier" element={<ManageSupplier ></ManageSupplier>}/>
                <Route path="supplier/create" element={<EditSupplier isUpdate={false}></EditSupplier>}/>
                <Route path="supplier/update" element={<EditSupplier isUpdate={true}></EditSupplier>}/>
                <Route path="supplier/detail" element={<DetailSupplier></DetailSupplier>}/>
                <Route path="category" element={<ManageCategory></ManageCategory>}/>
                <Route path="category/create" element={<EditCategory isUpdate={false}></EditCategory>}/>
                <Route path="category/update" element={<EditCategory isUpdate={true}></EditCategory>}/>
                <Route path="category/detail" element={<DetailCategory></DetailCategory>}/>
                <Route path="asset-group" element={<ManageAssetGroup></ManageAssetGroup>}/>
                <Route path="asset-group/create" element={<EditAssetGroup isUpdate={false}></EditAssetGroup>}/>
                <Route path="asset-group/update" element={<EditAssetGroup isUpdate={true}></EditAssetGroup>}/>
                <Route path="asset-group/detail" element={<DetailAssetGroup></DetailAssetGroup>}/>
                <Route path="campaign" element={<ManageCampaign></ManageCampaign>}/>
                <Route path="campaign/create" element={<EditCampaign isUpdate={false}></EditCampaign>}/>
                <Route path="campaign/update" element={<EditCampaign isUpdate={true}></EditCampaign>}/>
                <Route path="campaign/detail" element={<DetailCampaign></DetailCampaign>}/>
                <Route path="approve" element={<ManageApprove></ManageApprove>}/>
                <Route path="sof" element={<ManageSOF>Khoản vay</ManageSOF>}/>
                <Route path="change-sof" element={<ManageChangeSof></ManageChangeSof>}/>
                <Route path="detail-est" element={<PayablePeriodDetail></PayablePeriodDetail>}/>
                <Route path="sof/create" element={<EditSOF isUpdate={false}></EditSOF>}/>
                <Route path="sof/update" element={<EditSOF isUpdate={true}></EditSOF>}/>
                <Route path="sof/detail" element={<DetailSOF></DetailSOF>}/>
                <Route path="charging_est/update" element={<EditSofChargingEst isUpdate={true}></EditSofChargingEst>}/>
                <Route path="charging_est/detail" element={<DetailSofChargingEst></DetailSofChargingEst>}/>
                <Route path="charging_est" element={<ManageSofChargingEst></ManageSofChargingEst>}/>
                <Route path="account" element={<div>Tài khoản</div>}/>
                <Route path="company" element={<div>Công ty vay</div>}/>
                <Route path="categories" element={<div>Hạng mục</div>}/>
                <Route path="categories" element={<div>Hạng mục</div>}/>
            </Route>
        </Routes>
    )
}