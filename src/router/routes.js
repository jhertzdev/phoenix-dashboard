
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue')},
      // Clientes
      { path: 'clientes', component: () => import('pages/ClientDashboardPage.vue') },
      // Categorías
      { path: 'categorias', component: () => import('pages/CategoriasPage.vue') },
      { path: 'categorias/:type/:id', component: () => import('pages/CategoriasEditPage.vue') },
      // Contadores
      { path: 'contadores', component: () => import('pages/ContadorDashboard.vue') },
      // Ingresos
      { path: 'ingresos', component: () => import('pages/IngresosDashboard.vue') },
      { path: 'ingresos/new', component: () => import('src/pages/IngresosNewEditPage.vue') },
      { path: 'ingresos/:id', component: () => import('src/pages/IngresosNewEditPage.vue'), props: true },
      // Reportes
      { path: 'reportes', component: () => import('pages/ReportDashboard.vue') },
      // Gastos
      { path: 'gastos', component: () => import('pages/GastosDashboard.vue') },
      { path: 'gastos/new', component: () => import('src/pages/GastosNewEditPage.vue') },
      { path: 'gastos/:id', component: () => import('src/pages/GastosNewEditPage.vue'), props: true },
      // Usuarios
      { path: 'users', component: () => import('pages/UsersDashboard.vue') },
      // Perfil
      { path: 'perfil/:id', component: () => import('pages/PefilDashboard.vue'), props: true },      
      // Auth
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
