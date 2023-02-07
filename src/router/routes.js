
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue')},
      { path: 'clientes', component: () => import('pages/ClientDashboardPage.vue') },
      { path: 'categorias', component: () => import('pages/CategoriasPage.vue') },
      { path: 'contadores', component: () => import('pages/ContadorDashboard.vue') },
      { path: 'ingresos', component: () => import('pages/IngresosDashboard.vue') },
      { path: 'reportes', component: () => import('pages/ReportDashboard.vue') },
      { path: 'gastos', component: () => import('pages/GastosDashboard.vue') },
      { path: 'users', component: () => import('pages/UsersDashboard.vue') },
      { path: 'perfil/:id', component: () => import('pages/PefilDashboard.vue'),props: true },
      

      
      //auth
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'registro', component: () => import('pages/RegisterPage.vue') },
      { path: 'logout', component: () => import('pages/LogoutPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
