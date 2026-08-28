import axios from 'axios';


export const api = axios.create({

    baseURL:
        import.meta.env.VITE_API_URL ||
        'https://sahib-s-gurudwara.onrender.com/api',

    headers: {
        'Content-Type': 'application/json'
    }

});


/* =========================================================
   AUTH TOKEN
========================================================= */

api.interceptors.request.use(
    (config) => {

        const userToken =
            localStorage.getItem('userToken');

        const adminToken =
            localStorage.getItem('adminToken');


        /*
         * Admin API requests
         */

        if (
            config.url?.includes('/admin/') &&
            adminToken
        ) {

            config.headers.Authorization =
                `Bearer ${adminToken}`;

        }


        /*
         * User API requests
         */

        else if (
            userToken
        ) {

            config.headers.Authorization =
                `Bearer ${userToken}`;

        }


        return config;

    },

    (error) => {
        return Promise.reject(error);
    }
);
