import axios from "axios";

const axiosApi = axios.create( {
    baseURL: `http://127.0.0.1:9000/api/v1/`,
} );
export const axiosInstance = axiosApi;

axiosInstance.interceptors.request.use(
    ( config ) => {
        const tokenString = localStorage.getItem( "token" );
        config.headers["x-auth-token"] = tokenString || null;
        return config;
    },
    ( error ) => {
        return Promise.reject( error );
    }
);

axiosInstance.interceptors.response.use(
    ( response ) => {
        return response;
    },
    ( error ) => {
        if ( error.response && error.response.status === 401 ) {
            console.log( "Unauthorized, redirecting to login..." );
            localStorage.clear();
            window.location.href = "/login";
            window.location.reload();
            // sessionStorage.clear();
        }
        return Promise.reject( error );
    }
);