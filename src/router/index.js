import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import { useAuthStore } from 'src/stores/auth.store'
import { useAppStore } from 'src/stores/app.store'
import { api } from 'src/boot/axios';
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  const canAccess = (to, user) => {
    let currentPath
    
    if (to.matched?.length) {
      currentPath = to.matched[to.matched.length - 1]?.path
    }

    // Evitar acceder a perfiles de otros usuarios si no eres Admin
    if (user.role_name !== 'admin') {
      if (currentPath === '/perfil/:id' && to.params.id != user.id) return false
    }

    // Rutas permitidas solo para ciertos roles
    let allowedRoutes = [
      {
        path: '/users', roles: ['admin']
      },
      {
        path: '/contadores', roles: ['cliente']
      },
      {
        path: '/clientes', roles: ['contador']
      },
    ]

    let checkCurrentRoute = allowedRoutes.find(route => {
      return currentPath === route.path
    })

    if (checkCurrentRoute && !checkCurrentRoute.roles.includes(user.role_name)) {
      return false
    }   

    return true
  }

  Router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login', '/registro', '/unauthorized', '/reportes', '/registro2'];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();
    const appStore = useAppStore()
  
    if (authRequired && !auth.user) {
      auth.returnUrl = to.fullPath;
      return '/login';
    } else if (authRequired && !canAccess(to, auth.user)) {
      return '/unauthorized'
    }

    if (authRequired && auth.user) {
      api.get('notify').then(response => {
        if (response.data?.data) {
          appStore.notifications = response.data.data 
        }
      })
    }
    
  });

  return Router
})
