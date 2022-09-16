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
            userDebug: user,
            user: user.user,
            accessToken: user.access_token,
            type: user.type,

        }
    })

    const dispatch = useDispatch()
    const [complemento, setComplemento] = useState({})
    const [awaitDriver, setAwaitDriver] = useState(false)
    const [isLogged, setIsLogged] = useState(false)



    //The axios configs
    axios.defaults.baseURL = BASE_URL;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    //Para verificar a request, basta dar Ctrl+K+U no código abaixo
    //  axios.interceptors.request.use(function (request ) {
    //      console.log('Starting Request', JSON.stringify(request, null, 2))
    //      return request;
    //  }, function (error) {
    //  	 return Promise.reject(error);
    //  });

    //   axios.interceptors.response.use(function (response) {
    //      console.log('Response:', JSON.stringify(response, null, 2))
    //  	 return response;
    //  }, function (error) {
    //  	 return Promise.reject(error);
    //  });


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

        // const respCadastro = await axios.post(`${entity}`, object);
        // await login(object.email, object.password,callback)
        // const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
        // if(entity == 'driver'){
        //     const respComplemento = await axios.post(`${entity}`,comp, config)
        // }

    };

    //REGISTRAR PT2
    const complement = async (entity, object) => {


        const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
        try {
            await axios.post(`/${entity}`, object, config)
        } catch (e) {
            console.log(`Register ${entity} error: ${e}`)
        }

        setAwaitDriver(false)
    }
    const getRoutesByStudent = async () => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
            const aux = await axios.get(`student/routes`, config);

            const resp = await aux.data //store.type
            return resp;


        } catch (e) {
            console.log(e);
            return e;
        }

    }
    const getStudentsByDriver = async () => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
            const aux = await axios.get(`driver/students`, config);

            const resp = await aux.data //store.type
            return resp;


        } catch (e) {
            console.log(e);
            return e;
        }

    }
    const getRequestsByDriver = async () => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
            const aux = await axios.get(`request/driver`, config);

            const resp = await aux.data //store.type
            //console.log(JSON.stringify(resp, null, "\t"));
            //console.log(JSON.stringify(resp[0].student, null, "\t"));
            return resp;


        } catch (e) {
            console.log(e);
            return e;
        }

    }

    const acceptRequest = async (idRoute) => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
            const aux = await axios.patch(`request`, {id:idRoute}, config);

            const resp = await aux.data //store.type
            //console.log(JSON.stringify(resp, null, "\t"));
            //console.log(JSON.stringify(resp[0].student, null, "\t"));
            return resp;


        } catch (e) {
            console.log(`Error while accepting request ${e}`);
            return e;
        }

    }
    const createRequest = async (idRoute) => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
            const aux = await axios.post(`request`, {driverId:idRoute}, config);

            const resp = await aux.data //store.type
            //console.log(JSON.stringify(resp, null, "\t"));
            //console.log(JSON.stringify(resp[0].student, null, "\t"));
            return resp;


        } catch (e) {
            console.log(`Error while accepting request ${e}`);
            return e;
        }

    }
    const removeRequest = async (idRoute) => {

        try {
            const options = {
                method: 'DELETE',
                url: `${BASE_URL}/request/`,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${store.accessToken}`
                },
                data: {id: idRoute}
              };
              
              const aux = axios.request(options)

            // const config = { headers: { 'Authorization': `Bearer ${store.accessToken}`,'Content-Type': 'application/json'}, { data:{id:idRoute}}};

            // const aux = await axios.delete(`/request/`,config);

            const resp = await aux.data //store.type
            //console.log(JSON.stringify(resp, null, "\t"));
            //console.log(JSON.stringify(resp[0].student, null, "\t"));
            return resp;


        } catch (e) {
            console.log(`Error while deleting request ${e}`);
            return e;
        }

    }

    const login = async (email, password, callback) => {
        //Request returns the user, a token and a type {driver, student}
        //The Post request to the address /auth results in a token with the user type

        await axios.post(`/auth`, { email, password, }).then(async res => {
            setIsLogged(true)
            const config = { headers: { 'Authorization': `Bearer ${res.data.access_token}`} };
            //The get request to the address /{type} results in the user that needs a token to be retrieved
            await axios.get(`/${res.data.type}/`, config).then(async resLogin => {
                //Once we have the info, we store it in a storage (By now, AsyncStorage) and set the state userInfo to use it as the state don't need to be awaited 
                let userInfo = resLogin.data;
                
                if (resLogin.data.driverId) {
                    const aux = await axios.get(`${res.data.type}/driver`, config);
                    userInfo['driver'] = aux.data;
                }
                if (resLogin.data.route) {
                    const aux = await axios.get(`/route`, config);
                    userInfo['route'] = aux.data;
                }
                userInfo["access_token"] = res.data.access_token;
                userInfo["type"] = res.data.type;

                dispatch(setInfo(userInfo))
            }).catch(e => {
                console.log(`login 2 error ${e}`);
                setIsLogged(false)
            });
        }).catch(e => {
            console.log(`login 1 error ${e}`);
        }).finally(() => {
            try {
                callback(false)
            } catch (e) {
                console.log(`Login Finaly error: ${e}`)
            }

        })

    };
    //LOGOUT
    const logout = () => {
        // The logout is simple as we don't delete the token from the API. So we just remove the item from the storage 
        // and set the state userInfo as {}. Finaly, we send the user to the login screen
        dispatch(resetUser())
        setIsLogged(false)
    };

    //ISLOGGEDIN
    //Here is the code responsible for mantain the user logged if and only if exists a valid token in the API
    const isLoggedIn = async () => {

        if (store.accessToken) {
            try {
                // If the userInfo is in fact in the storage,  then we check if the token is valid and 
                // if true, we save it in the state. if not, the token isn't valid anymore and we will know same as above
                axios.defaults.headers.get['Authorization'] = `Bearer ${store.accessToken}`;
                axios.get(`/${store.type}`).then(resLogin => {
                    setIsLogged(true)
                }).catch(e => {
                    console.log(`login 3 error ${e}`);
                    logout()
                });
            } catch (e) {
                console.log(`is logged in error ${e}`);
                logout()
            }

        }

    };
    // //The magic that triggers the function above
    useEffect(() => {
        if (store.accessToken && !isLogged) {
            isLoggedIn();
        }
    }, [store.accessToken]);

    useEffect(() => {
        if (store.type == 'driver' && awaitDriver == true) {
            complement('vehicle', {
                crlv: complemento.crlv,
                brand: complemento.brand,
                model: complemento.model,
                year: complemento.year,
                color: complemento.color,
                seats: complemento.seats,
            })
            complement('route', {
                city: complemento.city,
                state: complemento.state,
                university: complemento.university
            })
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
                getRoutesByStudent,
                getStudentsByDriver,
                getRequestsByDriver,
                acceptRequest,
                removeRequest,
                createRequest,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
