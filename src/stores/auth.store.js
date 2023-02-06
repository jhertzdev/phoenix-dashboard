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
        async login(email, password) {

            try {
                const response = await api.post('/login', { email, password })

                if (response.data) {
                    this.user = response.data.user;
                    this.token = response.data.token;
                    localStorage.setItem('user', JSON.stringify(response.data.user))
                    localStorage.setItem('token', response.data.token)

                    api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

                    // redirect to previous url or default to Dashboard
                    this.router.push(this.returnUrl || '/');
                }

                return true

            } catch (error) {
                const appStore = useAppStore()
                appStore.modalMessage = {
                    title: 'Error',
                    message: 'Las credenciales no son válidas.'
                }
            }

        },
        logout() {
            this.userData = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            this.router.push('/login');
        }
    }
});
