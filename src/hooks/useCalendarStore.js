import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { calendarApi } from '../api';
import { convertEventsToDateEvents } from '../helpers';
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from '../store';


export const useCalendarStore = () => {
  
    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) )
    }

    const startSavingEvent = async( calendarEvent ) => {

        try {

            // TO DO: llegar al backend
            // Todo bien
            if( calendarEvent.id ) {
                // Actualizando
                await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent )
                dispatch( onUpdateEvent({ ...calendarEvent, user }) );
                return
            }

            // Creando
            const { data } = await calendarApi.post('/events', calendarEvent )
            // console.log(data)
            dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }) );

        } catch (error) {
            console.log(error)
            Swal.fire('Error al guardar', error.response.data?.msg, 'error')
        }
        
        
    }

    const startDeletingEvent = async( /*calendarEvent*/ ) => {
        // Todo: Llegar al backend
        // console.log( calendarEvent )
        try {
            // if( calendarEvent.id ) {
            //     await calendarApi.delete(`/events/${ calendarEvent.id }`)
            //     dispatch( onDeleteEvent() );
            // }
            await calendarApi.delete(`/events/${ activeEvent.id }`)
            dispatch( onDeleteEvent() )

        } catch (error) {
            console.log(error)
            Swal.fire('Error al eliminar',  error.response.data?.msg, 'error')
        }

    }

    const startLoadingEvents = async() => {

        try {
            
            const { data } = await calendarApi.get('/events')
            // console.log({data})
            const events = convertEventsToDateEvents( data.eventos )
            // console.log(events)
            dispatch( onLoadEvents( events ) )


        } catch (error) {
            console.log('Error cargando eventos')
            console.log(error)
        }
    }


    return {
        //* Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

        //* Métodos
        startDeletingEvent,
        setActiveEvent,
        startSavingEvent,
        startLoadingEvents,
    }
}
