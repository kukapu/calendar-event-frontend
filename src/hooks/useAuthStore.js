import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api"
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from "../store"


export const useAuthStore = () => {

    const dispatch = useDispatch()
    const { status, user, errorMessage } = useSelector( state => state.auth )

    const startLogin = async({ email, password }) => {

        // console.log(email, password)
        dispatch( onChecking() )

        try {

            const { data } = await calendarApi.post('/auth',{ email, password })
            // console.log({ data })
            localStorage.setItem('token', data.token )
            localStorage.setItem('token-init-date', new Date().getTime() )

            dispatch( onLogin( { name:data.name, uid:data.uid } ) )



        } catch (error) {
            dispatch( onLogout( 'credenciales incorrectas' ))
            setTimeout( () => {
                dispatch( clearErrorMessage())
            }, 100)
        }
    }

    const startRegister = async({ name, email, password }) => {

        dispatch( onChecking() )
        // console.log({ name, email, password })
        try {

            const { data } = await calendarApi.post('/auth/new',{ name, email, password })
            // console.log({ data })
            localStorage.setItem('token', data.token )
            localStorage.setItem('token-init-date', new Date().getTime() )

            dispatch( onLogin( { name:data.name, uid:data.uid } ) )



        } catch (error) {
            console.log(error)
            dispatch( onLogout( error.response.data?.msg || `${error.response.data.errors.email?.msg || ''} <br> ${error.response.data.errors.name?.msg || ''} <br> ${error.response.data.errors.password?.msg || ''}` ))
            setTimeout( () => {
                dispatch( clearErrorMessage() )
            }, 100)
        }
    }

    const checkAuthToken = async() => {

        const token = localStorage.getItem('token')
        if ( !token ){
            return dispatch( onLogout() )
        }

        try {
            
            const { data } = await calendarApi.get('/auth/renew')
            localStorage.setItem( 'token', data.token )
            localStorage.setItem( 'token-init-date', new Date().getTime() )

            dispatch( onLogin( { name:data.name, uid:data.uid } ) )

        } catch (error) {
            localStorage.clear()
            dispatch( onLogout('La sesion ha expirado') )
        }
    }

    const startLogout = () => {
        localStorage.clear()
        dispatch( onLogoutCalendar() )
        dispatch( onLogout() )
    }

    return {
        //* Propiedades
        status,
        user, 
        errorMessage,

        //* Metodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout,
    }
}
