import { setInfo, resetUser } from '../redux/reducers/usuarioReducer';
//possivelmente retirar o asyncStorage no futuro
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { BASE_URL } from './config';
import { useDispatch, useSelector } from 'react-redux';
import { popUpErroGenerico } from '../screens/PopUpErroGenerico';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ModalErroGenerico from '../screens/ModalErroGenerico';

export const AuthContext = createContext();

//Pra fazer possivel a navegação fora do navigation
export const navigationRef = React.createRef();

function navigate(name, params) {
    navigationRef.current?.navigate(name, params);
}

export const AuthProvider = ({ children }) => {
    LogBox.ignoreLogs([
        "Non-serializable values were found in the navigation state",
        "Warning: Failed prop type: Invalid prop `origin` supplied to `MapViewDirections`, expected one of type [string].",
        "Warning: Failed prop type: Invalid prop `destination` supplied to `MapViewDirections`, expected one of type [string].",
        // name of the error/warning here, or a regex here
    ]);
    const store = useSelector(({ user }) => {
        return {
            userDebug: user,
            user: user.user,
            accessToken: user.access_token,
            type: user.type,

        }
    })

    const dispatch = useDispatch()
    const [isLogged, setIsLogged] = useState(false)

    //The axios configs
    axios.defaults.baseURL = BASE_URL;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    //Para verificar a requisição, basta dar remover o comentario do console.log() abaixo
    axios.interceptors.request.use(function (request) {
        //console.log('Starting Request', JSON.stringify(request, null, 2))
        return request;
    }, function (error) {
        return Promise.reject(error);
    });
    //Para verificar a resposta, basta dar remover o comentario do console.log() abaixo
    axios.interceptors.response.use(function (response) {
        //console.log('Response:', JSON.stringify(response, null, 2))
        return response;
    }, function (error) {
        return Promise.reject(error);
    });


    //REGISTER
    const register = async (type, object, comp, callback) => {
        //Just a basic Create. we send the object and the API does the magic
        //I'll possibly use this as a login variation
        callback(true)
        let userInfo = {}
        const form = returnFormData(object);
        const options = {
            method: 'POST',
            url: `${BASE_URL}/${type}`,
            headers: { 'Content-Type': 'multipart/form-data' },
            data: form,
        };

        try {

            const res = await axios.request(options)
            const aux = await res.data;
            const authentication = await auth(object.email, object.password)
            console.log(authentication.access_token)

            config = {
                headers: {
                    'Authorization': `Bearer ${authentication.access_token}`
                }
            };
            setIsLogged(true)
            if (type == 'driver') {
                const registerVehicle = await registerComplement('vehicle', {
                    plate: comp.plate,
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

                if (!registerRoute || !registerVehicle) {
                    return
                }
            }


            const user = await getUser(authentication.type, config)
            userInfo = user;

            if (!user) {
                popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique todos os campos, a sua conexão e tente novamente` })
                return
            }

            userInfo['access_token'] = authentication.access_token
            userInfo['type'] = authentication.type
            //console.log(JSON.stringify(userInfo, null, "\t"));
            popUpErroGenerico({ type: 'customSuccess', text1: 'Usuario cadastrado com sucesso', text2: `Por favor aguarde enquanto iniciamos a sua sessão` })


        } catch (e) {
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique todos os campos, a sua conexão e tente novamente` })
            setIsLogged(false)
        } finally {
            callback(false)
            dispatch(setInfo(userInfo))
        }

    };
    //REGISTRAR PT2 - Complementos para cadastrar, até então, rota e veiculo
    const registerComplement = async (entity, object, token) => {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        try {
            const aux = await axios.post(`/${entity}`, object, config)
            const resp = aux.data
            return resp
        } catch (e) {
            console.log(`Register ${entity} error: ${e}`)
            return
        }
    }
    // const getRoutesByStudent = async () => {
    //     try {
    //         const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
    //         const aux = await axios.get(`student/routes`, config);

    //         const resp = await aux.data //store.type

    //         return resp;


    //     } catch (e) {
    //         popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
    //         navigate('modalErro', { btnTxt: 'Tentar Novamente', btn1Func: getRoutesByStudent })
    //         return e;
    //     }

    // }
    // const getStudentsByDriver = async () => {
    //     try {
    //         const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
    //         const aux = await axios.get(`driver/students`, config);

    //         const resp = await aux.data //store.type

    //         return resp;


    //     } catch (e) {
    //         popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
    //         navigate('modalErro', { btnTxt: 'Tentar Novamente', btn1Func: getStudentsByDriver})
    //         return;
    //     }

    // }
    // const getRequestsByDriver = async () => {
    //     try {
    //         const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
    //         const aux = await axios.get(`request/driver`, config);

    //         const resp = await aux.data //store.type
    //         //console.log(JSON.stringify(resp, null, "\t"));
    //         //console.log(JSON.stringify(resp[0].student, null, "\t"));
    //         return resp;


    //     } catch (e) {
    //         popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
    //         navigate('modalErro', { btnTxt: 'Tentar Novamente', btn1Func:getRequestsByDriver})
    //         return;
    //     }

    // }


    const refreshUser = async () => {
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
    //Responsavel por criar uma solicitação
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
    //Responsavel por aceitar uma solicitação
    const acceptRequest = async (idRoute) => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
            const aux = await axios.patch(`request`, { id: idRoute }, config);

            const resp = await aux.data //store.type
            //console.log(JSON.stringify(resp, null, "\t"));
            //console.log(JSON.stringify(resp[0].student, null, "\t"));
            popUpErroGenerico({ type: 'customSuccess', text1: 'Solicitação aceitada com sucesso', text2: `O usuário foi inserido em sua rota` })
            return resp;


        } catch (e) {
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
            return;
        }

    }
    //Responsavel por remover uma solicitação
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
            popUpErroGenerico({ type: 'customSuccess', text1: 'Solicitação removida com sucesso', text2: `O estudante foi removido da lista de solicitações` })

            return resp;

        } catch (e) {
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
            console.log(`Error while deleting request ${e}`);
            return;
        }

    }
    //Serve como meio para chamada do modal de erro. Basicamente repassa uma função para o componente
    const mediador = (text, funcao, params, refresh) => {
        navigate('modalErro', { texto: text, btnTxt: "Sim", btn2Txt: "Não", btn1Func: funcao, parameters: params, refresh: refresh })
    }
    const quitFromRoute = async () => {

        const options = {
            method: 'POST',
            url: `${BASE_URL}/${store.type}/leave`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${store.accessToken}`
            }
        };

        try {
            const aux = axios.request(options)
            if (aux) {
                dispatch(setInfo({ driver: null }))
                dispatch(setInfo({ diverId: null }))
            }
            const resp = aux.data
            return resp
        } catch (error) {
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
            console.log(`Error while quiting route ${e}`);
            return;
        }
    }
    const removeFromRoute = async (id) => {
        const options = {
            method: 'POST',
            url: `${BASE_URL}/${store.type}/kick`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${store.accessToken}`
            },
            data: { studentId: id }
        };
        try {
            const aux = axios.request(options)
            const resp = aux.data
            popUpErroGenerico({ type: 'customSuccess', text1: 'Estudante removido com sucesso', text2: `O estudante foi removido do seu veículo` })
            return resp
        } catch (error) {
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
            console.log(`Error while quiting route ${e}`);
            return;
        }
    }
    const getSpots = async () => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
            const aux = await axios.get(`spot/${store.type}`, config);

            const resp = await aux.data //store.type
            //console.log(JSON.stringify(resp, null, "\t"));
            //console.log(JSON.stringify(resp[0].student, null, "\t"));
            return resp;


        } catch (e) {

            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
            return;
        }
    }
    const setSpots = async (body) => {
        try {
            let spots = []
            body.forEach(element => {
                spots.push({
                    lat: element.latitude.toString(),
                    lng: element.longitude.toString()
                })
            });
            const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
            let promises = [];
            spots.forEach(element => {
                promises.push(axios.post(`spot`, element, config))
            });

            const aux = await Promise.all(promises);

            const resp = await aux.data //store.type
            //console.log(JSON.stringify(resp, null, "\t"));
            //console.log(JSON.stringify(resp[0].student, null, "\t"));
            return resp;


        } catch (e) {
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
            return;
        }
    }
    //Responsavel pela autenticação
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
    //Função genérica que retorna dados como rotas, estudantes em uma rota, motoristas disponiveis, etc dado a rota(request)
    const getData = async (type) => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
            const aux = await axios.get(`${type}`, config);

            const resp = await aux.data //store.type
            //console.log(JSON.stringify(resp, null, "\t"));
            //console.log(JSON.stringify(resp[0].student, null, "\t"));
            return resp;


        } catch (e) {
            console.log(e)
            popUpErroGenerico({ type: 'customError', text1: 'Alguma coisa aconteceu', text2: `Por favor verfique a sua conexão e tente novamente` })
            return;
        }
    }
    //Retorna um usuário dada sua rota e configurações de request
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
    //Converte de Json para FormData
    const returnFormData = ({ file, ...data }) => {
        let form_data = new FormData();

        for (var key in data) {
            form_data.append(key, data[key]);
        }
        if (file) {
            form_data.append('file', {
                uri: file.uri,
                name: `${file.name}`,
                type: 'image/jpeg',
            })
        }


        return form_data
    }
    //LOGIN
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
                fullName = user.user.fullName.split(' ')
                popUpErroGenerico({ type: 'customSuccess', text1: 'Sessão Iniciada com sucesso', text2: `Bem-Vindo{a) de volta ${fullName[0]}` })

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
        if (isLogged) {
            popUpErroGenerico({ type: 'customInfo', text1: 'Volte Novamente', text2: 'Usuário deslogado com sucesso' })
        }
        dispatch(resetUser())
        setIsLogged(false)

    };
    //Função resposavel por verificar a validade do token
    const isLoggedIn = async () => {

        if (store.accessToken) {

            try {
                const config = { headers: { 'Authorization': `Bearer ${store.accessToken}` } };
                const user = await getUser(store.type, config)
                if (!user) {
                    popUpErroGenerico({ type: 'customInfo', text1: 'Usuário Deslogado', text2: 'A sua sessão expirou, por favor, realize o login novamente' })
                    logout()
                } else {
                    setIsLogged(true)
                    fullName = store.user.fullName.split(' ')
                    popUpErroGenerico({ type: 'customInfo', text1: `Bem vindo de volta ${fullName[0]}`, text2: 'A equipe urbniversity te deseja um bom dia' })
                }


            } catch (e) {
                popUpErroGenerico({ type: 'customInfo', text1: 'Usuário Deslogado', text2: 'A sua sessão expirou, por favor, realize o login novamente' })
                console.log(`is logged in error ${e}`);
                logout()

            }

        }

    };


    //Chama a função resposnavel por verificar a validade do token
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
                getData,
                acceptRequest,
                removeRequest,
                createRequest,
                refreshUser,
                mediador,
                setSpots,
                getSpots,
                quitFromRoute,
                removeFromRoute
            }}>
            {children}
        </AuthContext.Provider>
    );
};
