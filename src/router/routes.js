
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue')},
      // Clientes
      { path: 'clientes', component: () => import('src/pages/ClientesContadoresPage.vue') },
      // Categorías
      { path: 'categorias', component: () => import('pages/CategoriasPage.vue') },
      { path: 'categorias/:type/:id', component: () => import('pages/CategoriasEditPage.vue') },
      // Contadores
      { path: 'contadores', component: () => import('pages/ClientesContadoresPage.vue') },
      // Cuentas y bancos
      { path: 'bancos', component: () => import('src/pages/BanksPage.vue') },
      { path: 'cuentas', component: () => import('src/pages/BankAccountsPage.vue') },
      { path: 'cuentas/new', component: () => import('src/pages/BankAccountsNewEditPage.vue') },
      { path: 'cuentas/:id', component: () => import('src/pages/BankAccountsNewEditPage.vue'), props: true },
      // Movimientos
      { path: 'movimientos', component: () => import('pages/MovimientosDashboard.vue') },
      { path: 'movimientos/new', component: () => import('src/pages/MovimientosNewEditPage.vue') },
      { path: 'movimientos/importar', component: () => import('src/pages/MovimientosImportarPage.vue') },
      { path: 'movimientos/:id', component: () => import('src/pages/MovimientosNewEditPage.vue'), props: true },
      // Reportes
      { path: 'reportes', component: () => import('pages/ReportDashboard.vue') },
      // Usuarios
      { path: 'users', component: () => import('pages/UsersDashboard.vue') },
      // Perfil
      { path: 'perfil/:id', component: () => import('pages/PefilDashboard.vue'), props: true },      
      // Auth
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'registro', component: () => import('pages/RegisterPage.vue') },
      { path: 'registro2', component: () => import('pages/RegisterPart2Page.vue') },
      { path: 'logout', component: () => import('pages/LogoutPage.vue') },
    ]
  },

  { path: '/unauthorized', component: () => import('pages/ErrorNotAuthorized.vue') },
 

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
