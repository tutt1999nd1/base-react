import {Navigate,} from 'react-router-dom';
import {useSelector} from "react-redux";

const PrivateRoutes = ({role, redirectPath='/login',children})=>{
    const currentUser = useSelector(state => state.currentUser)
    if(!currentUser?.roles.includes(role)){

        return <Navigate to='/home/errors/forbidden' replace/>
    }
    return children
}

export default PrivateRoutes