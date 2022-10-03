import {useEffect} from "react";
import apiManagerAuth from "../../api/manager-auth";

export default function  Login(){

    useEffect(()=>{
        login().then(r=>{
            console.log("r",r)
        })
            .catch(e=>{
                console.log("e",e)
            })
    },[])

    const login = () => {
      return apiManagerAuth.login();
    }
    return(
        <div className={'wrapper-login'}>
            <div className={'wrapper-form-login'}>
                <div className={'logo'}>
                    <img src={require('../../assets/img/new-logo.png')} alt=""/>
                </div>
                <div className={'login-with'}>
                        Login with
                </div>
                <div className={'options-login'}>
                    <div className={'button-login'}>
                        <div className={'icon-microsoft'}>
                            <img src={require('../../assets/img/microsoft.png')} alt=""/>
                        </div>
                        <div className={'tittle-button-login'}>
                            Microsoft
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}