import AsyncStorage from '@react-native-async-storage/async-storage';
//possivelmente retirar o asyncStorage no futuro
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { BASE_URL } from './config';

export const AuthContext = createContext();

//To make possible the navigation outside the Navigation component. we must create a ref.
export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({});
    const [splashLoading, setSplashLoading] = useState(false);

    //The axios configs
    axios.defaults.baseURL = BASE_URL;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

//REGISTER
    const register = (entity, object, complement) => {
        //Just a basic Create. we send the object and the API does the magic
        //I'll possibly use this as a login variation
        axios.post(`/${entity}`, object)
        .then(() => {
                login(object.email, object.password).then(() => {
                    if(entity == 'driver'){
                        complement('vehicle', complement)
                    } 
                }).catch(err){
                    console.log(`register login error ${err}`)
                }
                 
            })
            .catch(e => {
                console.log(`register error ${e}`);
            });
    };

    //LOGIN
    const complement = (entity, complement) => {
        const config = { headers: { 'Authorization': `Bearer ${userInfo.access_token}` } };
        try{
            axios.post(`/${entity}`, complement, config)
        }catch(e){
            console.log(`Register ${entity} error: ${e}`)
        }
        

    }
    const login = (email, password) => {
        //Request returns the user, a token and a type {driver, student}
        //The Post request to the address /auth results in a token with the user type
        axios.post(`/auth`, { email, password, })
            .then(res => {
                const config = { headers: { 'Authorization': `Bearer ${res.data.access_token}` } };
                //The get request to the address /{type} results in the user that needs a token to be retrieved
                axios.get(`/${res.data.type}/`, config)
                    .then(resLogin => {
                //Once we have the info, we store it in a storage (By now, AsyncStorage) and set the state userInfo to use it as the state don't need to be awaited 
                        let userInfo = resLogin.data;
                        userInfo["access_token"] = res.data.access_token;
                        userInfo["type"] = res.data.type;

                        setUserInfo(userInfo);
                        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                    }).catch(e => {
                        console.log(`login error ${e}`);
                    });
            }).catch(e => {
                console.log(`login error ${e}`);
            });
    };
//LOGOUT
    const logout = () => {
        // The logout is simple as we don't delete the token from the API. So we just remove the item from the storage 
        // and set the state userInfo as {}. Finaly, we send the user to the login screen
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        navigate('login')
    };

//ISLOGGEDIN
//Here is the code responsible for mantain the user logged if and only if exists a valid token in the API
    const isLoggedIn = async () => {
        try {
            //Firstly we check if the userInfo item in the storage exists, because, if not, we just know that the user isn't logged
            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);


            if (userInfo) {
                // If the userInfo is in fact in the storage,  then we check if the token is valid and 
                // if true, we save it in the state. if not, the token isn't valid anymore and we will know same as above
                axios.defaults.headers.get['Authorization'] = `Bearer ${userInfo?.access_token}`;
                axios.get(`/${userInfo.type}`).then(resLogin => {
                    setUserInfo(userInfo);                    
                    userInfo.type == 'driver' ? navigate('home', { isDrive: true }) : navigate('home', { isDrive: false })
                }).catch(e => {
                    console.log(`login error ${e}`);
                    logout()
                });
            }

        } catch (e) {
            console.log(`is logged in error ${e}`);
        }
    };
//The magic that triggers the function above
    useEffect(() => {
        isLoggedIn();
    }, []);
//We return here everything we will be using
    return (
        <AuthContext.Provider
            value={{
                userInfo,
                splashLoading,
                register,
                login,
                logout,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
