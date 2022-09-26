// const API_DOMAIN = 'http://10.190.180.251:8088/'
const API_DOMAIN = 'http://10.190.160.20:8088/'
const API_MAP = {
    GET_LIST_ASSETS: API_DOMAIN + 'asset/search',
    CREATE_ASSETS: API_DOMAIN + 'asset/create',
    UPDATE_ASSETS: API_DOMAIN + 'asset',
    DELETE_ASSETS: API_DOMAIN + 'asset',
    GET_ASSETS_GROUP: API_DOMAIN + 'asset_group',
    GET_LIST_COMPANY: API_DOMAIN + 'capital_company/search',
    CREATE_COMPANY: API_DOMAIN + 'capital_company/create',
    UPDATE_COMPANY: API_DOMAIN + 'capital_company/update',
    DELETE_COMPANY: API_DOMAIN + 'capital_company',

}
export default API_MAP;
