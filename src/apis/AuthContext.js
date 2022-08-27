import { setInfo, resetUser } from '../redux/reducers/usuarioReducer';
//possivelmente retirar o asyncStorage no futuro
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { BASE_URL } from './config';
import { useDispatch, useSelector } from 'react-redux';

export const AuthContext = createContext();

//To make possible the navigation outside the Navigation component. we must create a ref.
export const navigationRef = React.createRef();

// function navigate(name, params) {
//     navigationRef.current?.navigate(name, params);
// }

export const AuthProvider = ({ children }) => {
    const store = useSelector(({ user }) => {
        return {
            user: user.user,
            accessToken: user.access_token,
            type: user.type

        }
    })

    const dispatch = useDispatch()
    const [complemento, setComplemento] = useState({})
    const [awaitDriver, setAwaitDriver] = useState(false)
    const [splashLoading, setSplashLoading] = useState(false);




    //The axios configs
    axios.defaults.baseURL = BASE_URL;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    //REGISTER
    const register = (entity, object, comp, callback) => {
        //Just a basic Create. we send the object and the API does the magic
        //I'll possibly use this as a login variation
        if (entity == 'driver') {
            setComplemento(comp)
            setAwaitDriver(true)
        }

        axios.post(`/${entity}`, object)
            .then(async () => {
               await login(object.email, object.password, callback);
            }).catch(err => {
                console.log(`register login error ${err}`);
            })

    };

    //LOGIN
    const complement = async (entity) => {
        axios.interceptors.request.use(function (config) {
            // Do something before request is sent
            console.log(config)
            return config;
          }, function (error) {
            // Do something with request error
            return Promise.reject(error);
          });
        const config = { headers: { 'Authorization': `Bearer ${store.access_token}` } };
        console.log(store.accessToken)
        console.log(complemento)
        try {
            await axios.post(`/${entity}`, complemento, config)
        } catch (e) {
            console.log(`Register ${entity} error: ${e}`)
        }

        setAwaitDriver(false)
    }
    const login = async (email, password, callback) => {
        //Request returns the user, a token and a type {driver, student}
        //The Post request to the address /auth results in a token with the user type
        axios.post(`/auth`, { email, password, }).then(res => {
                const config = { headers: { 'Authorization': `Bearer ${res.data.access_token}` } };
                //The get request to the address /{type} results in the user that needs a token to be retrieved
                axios.get(`/${res.data.type}/`, config).then(resLogin => {
                        //Once we have the info, we store it in a storage (By now, AsyncStorage) and set the state userInfo to use it as the state don't need to be awaited 
                        let userInfo = resLogin.data;
                        userInfo["access_token"] = res.data.access_token;
                        userInfo["type"] = res.data.type;
                        dispatch(setInfo(userInfo))
    
                    }).catch(e => {
                        console.log(`login 2 error ${e}`);
                    });
            }).catch(e => {
                console.log(`login 1 error ${e}`);
            }).finally(() => {
                try{
                    callback(false)
                }catch(e){
                    console.log(`Login Finaly error: ${e}`)
                }
               
            })
            
    };
    //LOGOUT
    const logout = () => {
        // The logout is simple as we don't delete the token from the API. So we just remove the item from the storage 
        // and set the state userInfo as {}. Finaly, we send the user to the login screen
        dispatch(resetUser())
    };

    //ISLOGGEDIN
    //Here is the code responsible for mantain the user logged if and only if exists a valid token in the API
    const isLoggedIn = async (target, navigateTo) => {
    if (store.accessToken) {
        store.type == 'driver' ? navigateTo(target, { isDrive: true }) : navigateTo(target, { isDrive: false })
        try {
            // If the userInfo is in fact in the storage,  then we check if the token is valid and 
            // if true, we save it in the state. if not, the token isn't valid anymore and we will know same as above
            axios.defaults.headers.get['Authorization'] = `Bearer ${store.accessToken}`;
            axios.get(`/${store.type}`).then(resLogin => { 
            }).catch(e => {
                console.log(`login error ${e}`);
                logout()
            });
        } catch (e) {
            console.log(`is logged in error ${e}`);
        }
    
    }

};
// //The magic that triggers the function above
// useEffect(() => {
    
//     isLoggedIn();
    
// }, []);

useEffect(() => {
    if (store.type == 'driver' && awaitDriver == true) {
        complement('vehicle', complemento)
    }
}, [store.type]);
//We return here everything we will be using
return (
    <AuthContext.Provider
        value={{
            isLoggedIn,
            register,
            login,
            logout,
        }}>
        {children}
    </AuthContext.Provider>
);
};
