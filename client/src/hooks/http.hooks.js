import { useCallback } from "react"

export const useHttp = () => {
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        try {
            if(body){
                if(!(body instanceof FormData)){
                    headers['Content-Type'] = 'application/json';
                    body = JSON.stringify(body);
                }
            }
            const response = await fetch(url, {method, body, headers});
            const data = await response.json();
            if(!response.ok)
                throw new Error(data.message || 'Request error.');
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },[]);

    return {request};
}