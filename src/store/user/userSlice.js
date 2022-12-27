import { createSlice } from '@reduxjs/toolkit';
export const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: '',
        tokenGraphApi: '',
        email: '',
        name: '',
        username:'',
        roles: [],
        isSignIn: false,
        isLoading: false,
        language: 'en',
        showMenu:true,
        msalInstance:undefined,
        homeAccountId:'',
        listSelectCompany:[]

    },
    reducers: {
        updateProjectRedux: (state, action) => {
            state.project.id = action.payload.id;
            state.project.name = action.payload.name;
            state.project.urlImg = action.payload.urlImg;
        },
        updateLanguage: (state, action) => {
            state.language = action.payload;
        },
        updateLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        logout: (state, action) => {
            state.token = '';
            state.isSignIn = false;
            localStorage.setItem('token', '')
            state.roles = []
        },
        updateToken: (state, action) => {
            state.token = action.payload;
            // state.isSignIn = true;
            localStorage.setItem('token', action.payload)
        },
        updateTokenGraphApi: (state, action) => {
            state.tokenGraphApi = action.payload;
            // state.isSignIn = true;
            localStorage.setItem('tokenGraphApi', action.payload)
        },
        updateRole: (state, action) => {
            state.roles = action.payload
        },
        updateSelectCompany: (state, action) => {
            state.listSelectCompany = action.payload
        },
        updateUsername: (state, action) => {
            state.username = action.payload
        },
        updateName: (state, action) => {
            state.name = action.payload
        },
        updateShowMenu: (state, action) => {
            state.showMenu = action.payload
        },
        updateHomeAccountId: (state, action) => {
            state.homeAccountId = action.payload
        },
        onMsalInstanceChange: (state, action) => {
            // alert("tuuu")
            state.msalInstance = action.payload
        }
    },
    extraReducers: {
        // [login.fulfilled]: (state, action) => {
        //     if (action.payload.status == 200) {
        //         switch (action.payload.message) {
        //             case "ER_MUST_FIRST_CHANGE_PASSWORD":
        //                 break;
        //             case "PASSWORD_EXPIRED":
        //                 break;
        //             default:
        //                 state.token = action.payload.detail
        //                 localStorage.setItem('token', action.payload.detail)
        //                 state.isSignIn = true;
        //                 break;
        //         }
        //     }
        //     else {
        //         // toast.error('Tài khoản hoặc mật khẩu sai', {
        //         //     position: "top-right",
        //         //     autoClose: 5000,
        //         //     hideProgressBar: true,
        //         //     closeOnClick: true,
        //         //     pauseOnHover: true,
        //         //     draggable: true,
        //         // });
        //     }
        //     state.isLoading = false
        // },
        // [login.rejected]: (state, action) => {
        //     state.isSignIn = true;
        //     state.isLoading = false
        // },
        // [login.pending]: (state, action) => {
        //     state.isSignIn = false
        //     state.isLoading = true
        //     // state.current = action.payload || {};
        // },
    }
})
export default userSlice.reducer;
export const {updateSelectCompany,updateTokenGraphApi,updateHomeAccountId,updateName,onMsalInstanceChange,updateShowMenu, updateToken, updateProjectRedux, updateLanguage, logout, updateLoading, updateRole,updateUsername } = userSlice.actions;
