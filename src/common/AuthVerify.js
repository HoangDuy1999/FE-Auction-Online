import React from "react";
import { withRouter } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { NotifyHelper } from "../helper/NotifyHelper";
import { useHistory } from "react-router";


const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

const AuthVerify = (props) => {
    const history = useHistory();
    props.history.listen(() => {

        if (localStorage.x_accessToken) {
            const user = jwt_decode(localStorage.x_accessToken);
            if (user) {
                if (new Date(user.exp) * 1000 <  Date.now() +1000*115 ) {
                    // console.log("user");
                    // console.log(user.exp);
                    // console.log(Date.now());
                    // localStorage.removeItem("x_accessToken");
                    // localStorage.removeItem("x_refreshToken");
                    //NotifyHelper.error("Bạn đã hết phiên hoạt động! Hãy đăng nhập lại", "Thông báo")

                    
                    // history.push("/login")
                    //props.logOut();
                }
            }
        }



    });

    return <div></div>;
};

export default withRouter(AuthVerify);