// const API_DOMAIN = 'http://10.190.180.251:8088/'
// const API_DOMAIN = 'http://10.190.160.20:8088/'
const API_DOMAIN = 'http://localhost:8443/'
// const API_DOMAIN = 'http://103.151.238.62:8088/'
// const API_DOMAIN = 'http://103.151.238.62:8089/'
// const API_DOMAIN = 'https://cashflow.amberholdings.vn:8443/'
// const API_DOMAIN = 'https://cashflow.amberholdings.vn:8443/'
const API_MAP = {
    GET_LIST_ASSETS: API_DOMAIN + 'asset/search',
    GET_LIST_ASSETS_DASHBOARD: API_DOMAIN + 'dashboard/asset_aggregate',
    GET_LIST_SOF_DASHBOARD: API_DOMAIN + 'dashboard/sof_aggregate',
    CREATE_ASSETS: API_DOMAIN + 'asset/create',
    UPDATE_ASSETS: API_DOMAIN + 'asset',
    DELETE_ASSETS: API_DOMAIN + 'asset',
    GET_ASSETS_TYPE: API_DOMAIN + 'asset_type',
    GET_ASSETS_GROUP: API_DOMAIN + 'asset_group',
    GET_LIST_COMPANY: API_DOMAIN + 'capital_company/search',
    GET_LIST_COMPANY_AVAI: API_DOMAIN + 'capital_company/available',
    CREATE_COMPANY: API_DOMAIN + 'capital_company/create',
    UPDATE_COMPANY: API_DOMAIN + 'capital_company',
    DELETE_COMPANY: API_DOMAIN + 'capital_company',
    GET_LIST_CATEGORY: API_DOMAIN + 'capital_category/search',
    GET_LIST_CATEGORY_TREE: API_DOMAIN + 'capital_category/search-tree',
    GET_LIST_CAMPAIGNS_TREE: API_DOMAIN + 'capital_campaign/search-tree',
    CREATE_CATEGORY: API_DOMAIN + 'capital_category/create',
    UPDATE_CATEGORY: API_DOMAIN + 'capital_category',
    DELETE_CATEGORY: API_DOMAIN + 'capital_category',
    GET_LIST_CAMPAIGNS: API_DOMAIN + 'capital_campaign/search',
    CREATE_CAMPAIGNS: API_DOMAIN + 'capital_campaign/create',
    UPDATE_CAMPAIGNS: API_DOMAIN + 'capital_campaign',
    DELETE_CAMPAIGNS: API_DOMAIN + 'capital_campaign',
    GET_LIST_SOF: API_DOMAIN + 'source_of_fund/search',
    GET_LIST_SOF_APPROVE: API_DOMAIN + 'source_of_fund/search_approve',
    CREATE_SOF: API_DOMAIN + 'source_of_fund/create',
    UPDATE_SOF: API_DOMAIN + 'source_of_fund',
    DELETE_SOF: API_DOMAIN + 'source_of_fund',
    LOGIN:API_DOMAIN+'capital_campaign/test',
    SEND_APPROVE_SOF:API_DOMAIN+'source_of_fund/send-approve-sof',
    CANCEL_APPROVE_SOF:API_DOMAIN+'source_of_fund/cancel-approve-sof',
    CONFIRM_APPROVE_SOF:API_DOMAIN+'source_of_fund/confirm-approve-sof',
    REJECT_APPROVE_SOF:API_DOMAIN+'source_of_fund/reject-approve-sof',
    GET_LIST_SUPPLIER: API_DOMAIN + 'sof_supplier/search',
    CREATE_SUPPLIER: API_DOMAIN + 'sof_supplier/create',
    UPDATE_SUPPLIER: API_DOMAIN + 'sof_supplier',
    DELETE_SUPPLIER: API_DOMAIN + 'sof_supplier',
}
export default API_MAP;
