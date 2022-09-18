import { setInfo, resetUser } from '../redux/reducers/usuarioReducer';
//possivelmente retirar o asyncStorage no futuro
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { BASE_URL } from './config';
import { useDispatch, useSelector } from 'react-redux';
import {popUpErroGenerico} from '../screens/PopUpErroGenerico';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ModalErroGenerico from '../screens/ModalErroGenerico';

export const AuthContext = createContext();

//To make possible the navigation outside the Navigation component. we must create a ref.
export const navigationRef = React.createRef();

function navigate(name, params) {
    navigationRef.current?.navigate(name, params);
}

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
    axios.interceptors.request.use(function (request) {
        //console.log('Starting Request', JSON.stringify(request, null, 2))
        return request;
    }, function (error) {
        return Promise.reject(error);
    });

    axios.interceptors.response.use(function (response) {
        //console.log('Response:', JSON.stringify(response, null, 2))
        return response;
    }, function (error) {
        return Promise.reject(error);
    });


    //REGISTER
    const register = async (entity, object, comp, callback) => {
        //Just a basic Create. we send the object and the API does the magic
        //I'll possibly use this as a login variation
        callback(true)
        let userInfo = {}
        try {
            const res = await axios.post(`/${entity}`, object)
            const aux = await res.data;
            const authentication = await auth(object.email, object.password)
            const config = { headers: { 'Authorization': `Bearer ${authentication.access_token}` } };
            setIsLogged(true)
            if(entity == 'driver'){
                const registerVehivle = await registerComplement('vehicle', {
                    crlv: comp.crlv,
                    brand: comp.brand,
                    model: comp.model,
                    year: comp.year,
                    color: comp.color,
                    seats: comp.seats,
                }, authentication.access_token)
    
                const registerRoute = await registerComplement('route', {
                    city: comp.city,
                    state: comp.state,
                    university: comp.university
                }, authentication.access_token)
            }
            

            const user = await getUser(authentication.type, config)
            userInfo = user;
            userInfo['access_token'] = authentication.access_token
            userInfo['type'] = authentication.type
            console.log(JSON.stringify(userInfo, null, "\t"));


        } catch (e) {
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique todos os campos, a sua conexão e tente novamente` })
            setIsLogged(false)
        } finally {
            callback(false)
            dispatch(setInfo(userInfo))
            popUpErroGenerico({ type: 'customSuccess', text1: 'Usuario cadastrado com sucesso', text2: `Por favor aguarde enquanto iniciamos a sua sessão` })
        }

    };

    //REGISTRAR PT2
    const registerComplement = async (entity, object, token) => {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        try {
            await axios.post(`/${entity}`, object, config)
        } catch (e) {
            console.log(`Register ${entity} error: ${e}`)
        }
    }


    const getRoutesByStudent = async () => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
            const aux = await axios.get(`student/routes`, config);

            const resp = await aux.data //store.type
            return resp;


        } catch (e) {
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
            navigate('modalErro', { btnTxt: 'Tentar Novamente', btn1Func: getRoutesByStudent })
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
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
            navigate('modalErro', { btnTxt: 'Tentar Novamente', btn1Func: getStudentsByDriver })
            return;
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
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
            navigate('modalErro', { btnTxt: 'Tentar Novamente', btn1Func: getRequestsByDriver })
            return;
        }

    }

    const acceptRequest = async (idRoute) => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
            const aux = await axios.patch(`request`, { id: idRoute }, config);

            const resp = await aux.data //store.type
            //console.log(JSON.stringify(resp, null, "\t"));
            //console.log(JSON.stringify(resp[0].student, null, "\t"));
            popUpErroGenerico({ type: 'success', text1: 'Solicitação aceitada com sucesso', text2: `O usuário foi inserido em sua rota` })
            return resp;


        } catch (e) {
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
            return;
        }

    }
    const refreshUser = async () => {
        popUpErroGenerico({ type: 'customSuccess', text1: 'Atualizando dados', text2: `Por favor aguarde aguarde um instante` })
        try {
            const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
            const user = await getUser(`${store.type}`, config)
            dispatch(setInfo(user))
            return user;
        } catch (e) {
            console.log(e)
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
            return;
        }

    }
    const createRequest = async (idRoute) => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
            const aux = await axios.post(`/request`, { driverId: idRoute }, config);

            const resp = await aux.data
            popUpErroGenerico({ type: 'customSuccess', text1: 'Solicitação enviada com sucesso', text2: `Por favor aguarde a confirmação do motorista` })
            return resp;


        } catch (e) {
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
            console.log(`Error while creating request ${e}`);
            return;
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
                data: { id: idRoute }
            };

            const aux = axios.request(options)
            const resp = await aux.data
            popUpErroGenerico({ type: 'customSuccess', text1: 'Solicitação removida com sucesso', text2: `` })

            return resp;

        } catch (e) {
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
            console.log(`Error while deleting request ${e}`);
            return;
        }

    }
    const mediador = (text, funcao, params) => {
        navigate('modalErro', { texto: text, btnTxt: "Sim", btn2Txt: "Não", btn1Func: funcao, parameters: params })
    }
    const auth = async (email, password) => {
        try {
            const aux = await axios.post(`/auth`, { email, password, })
            const resp = await aux.data;
            return resp
        } catch (e) {
            console.log(`Error while Auth: ${e}`);
            return;
        }
    }

    const getUser = async (type, config) => {
        let userInfo = {}
        try {
            const aux = await axios.get(`/${type}/`, config)
            const resp = await aux.data;
            userInfo = resp;
            if (resp.driverId) {
                const aux = await axios.get(`${type}/driver`, config);
                userInfo['driver'] = await aux.data;
            }
            if (resp.route) {
                const aux = await axios.get(`/route`, config);
                userInfo['route'] = await aux.data;
            }

            return userInfo;
        } catch (e) {
            console.log(`Error while getting user: ${e}`)
            return;
        }

    }
    const login = async (email, password, callback) => {
        logout()
        let userInfo = {}
        try {
            const authentication = await auth(email, password)
            try {
                const config = { headers: { 'Authorization': `Bearer ${authentication.access_token}` } };
                setIsLogged(true)
                const user = await getUser(authentication.type, config)
                userInfo = user;
                userInfo['access_token'] = authentication.access_token
                userInfo['type'] = authentication.type
                popUpErroGenerico({ type: 'customSuccess', text1: 'Sessão Iniciada com sucesso', text2: `Bem-Vindo{a) de volta ${user.user.fullName}` })
                
            } catch (e) {
                popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique os dados, a sua conexão e tente novamente` })
            }

            //console.log(JSON.stringify(userInfo, null, "\t"));
        } catch (e) {
            navigate('modalErro')
            console.log(`Error while logging ${e}`)
        } finally {
            try {
                callback(false)
                dispatch(setInfo(userInfo))
            } catch (e) {
                console.log(`Login Finaly error: ${e}`)
            }
        }

    };
    //LOGOUT
    const logout = () => {
        if(isLogged){
            popUpErroGenerico({ type: 'customInfo', text1: 'Volte Novamente', text2:'Usuário deslogado com sucesso'})
        }
        dispatch(resetUser())
        setIsLogged(false)
        
    };

    const isLoggedIn = async () => {

        if (store.accessToken) {
            try {
                const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
                const user = await getUser(store.type, config)
                setIsLogged(true)
            } catch (e) {
                popUpErroGenerico({ type: 'customInfo', text1: 'Usuário Deslogado', text2:'A sua sessão expirou, por favor, realize o login novamente'})
                console.log(`is logged in error ${e}`);
                logout()
            }

        }

    };

    useEffect(() => {
        if (store.accessToken && !isLogged) {
            isLoggedIn();
        }
    }, [store.accessToken]);


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
                refreshUser,
                mediador,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
