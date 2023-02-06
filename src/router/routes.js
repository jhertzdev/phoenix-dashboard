
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue')},
      { path: 'clientes', component: () => import('pages/ClientDashboardPage.vue') },
      { path: 'contadores', component: () => import('pages/ContadorDashboard.vue') },
      { path: 'ingresos', component: () => import('pages/IngresosDashboard.vue') },
      { path: 'reportes', component: () => import('pages/ReportDashboard.vue') },
      { path: 'gastos', component: () => import('pages/GastosDashboard.vue') },
      { path: 'users', component: () => import('pages/UsersDashboard.vue') },
      { path: 'perfil/:id', component: () => import('pages/PefilDashboard.vue'),props: true },
      

      
      //auth
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      
    ]
  },
  { 
    path: '/logout',
    component:()=>import('layouts/LogoutLayout.vue'),
    children:[
      {path:'/logout',component: () => import('pages/LoginPage.vue')}
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
