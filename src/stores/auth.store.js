import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { useAppStore } from './app.store';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        token: localStorage.getItem('token'),
        returnUrl: null,
    }),
    actions: {
        async login(email, password, showWelcome = false) {

            const appStore = useAppStore()

            try {

                const response = await api.post('/login', { email, password })

                if (showWelcome) {
                    appStore.modalMessage = {
                        title: '¡Bienvenido!',
                        message: 'Te has registrado exitosamente. Redireccionando...'
                    }
                }
                
                const roles = await api.get('roles?selected=1')

                if (response.data && roles.data) {

                    this.user = response.data.user;
                    this.user.role_name = roles.data.find(role => role.id == this.user.role_id)?.name
                    this.token = response.data.token;

                    localStorage.setItem('user', JSON.stringify(this.user))
                    localStorage.setItem('token', this.token)

                    api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

                    // redirect to previous url or default to Dashboard
                    this.router.push(this.returnUrl || '/');
                    return true

                } else {

                    appStore.modalMessage = {
                        title: 'Error',
                        message: 'Las credenciales no son válidas.'
                    }
                    
                }


            } catch (error) {
                appStore.modalMessage = {
                    title: 'Error',
                    message: 'Las credenciales no son válidas.'
                }
            }

        },
        async register(userData) {
            const appStore = useAppStore()
            console.log(userData);
            if (!userData.name || !userData.email || !userData.password || !userData.role_id) {
                appStore.modalMessage = {
                    title: 'Error',
                    message: 'Todos los campos son requeridos.'
                }
                return;
            }

            userData.active = 1

            try {
                const response = await api.post('/register', userData)
                this.login(userData.email, userData.password, true) //login
            } catch (error) {
                console.log('Error', error);
                appStore.modalMessage = {
                    title: 'Error',
                    message: 'Ha ocurrido un error. Vuelve a intentarlo.'
                }
            }
            
        },
        logout() {
            this.user = null;
            this.returnUrl = null;
            this.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            console.log('logout');
        }
    }
});
