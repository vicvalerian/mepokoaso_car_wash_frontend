import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

function importComponent(path){
  return () => import(`../components/${path}.vue`);
}

// const routes = [
//   {
//     path: '/',
//     name: 'home',
//     component: HomeView
//   },
//   {
//     path: '/about',
//     name: 'about',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
//   }
// ]

const router = new VueRouter({
  mode: 'history',
  routes:[
    {
      path: '',
      component: importComponent('DashboardLayout'),
      children: [
        {
          path: '/jenis-kendaraan',
          name: 'Jenis Kendaraan',
          meta: { title: 'Jenis Kendaraan' },
          component: importComponent('jenis_kendaraan/list-jenis-kendaraan'),
        },
        {
          path: '/jabatan',
          name: 'Jabatan',
          meta: { title: 'Jabatan' },
          component: importComponent('jabatan/list-jabatan'),
        },
        {
          path: '/kendaraan',
          name: 'Kendaraan',
          meta: { title: 'Kendaraan' },
          component: importComponent('kendaraan/list-kendaraan'),
        },
        {
          path: '/karyawan',
          name: 'Karyawan',
          meta: { title: 'Karyawan' },
          component: importComponent('karyawan/list-karyawan'),
        },
        {
          path: '/peminjaman-karyawan',
          name: 'Peminjaman Karyawan',
          meta: { title: 'Peminjaman Karyawan' },
          component: importComponent('peminjaman_karyawan/list-peminjaman-karyawan'),
        },
        {
          path: '/menu-kedai',
          name: 'Menu Kedai',
          meta: { title: 'Menu Kedai' },
          component: importComponent('menu_kedai/list-menu-kedai'),
        },
        {
          path: '/gaji-karyawan',
          name: 'Gaji Karyawan',
          meta: { title: 'Gaji Karyawan' },
          component: importComponent('gaji_karyawan/list-gaji-karyawan'),
        },
        {
          path: '/pengeluaran-kedai',
          name: 'Pengeluaran Kedai',
          meta: { title: 'Pengeluaran Kedai' },
          component: importComponent('pengeluaran_kedai/list-pengeluaran-kedai'),
        },
        {
          path: '/mobil-pelanggan',
          name: 'Mobil Pelanggan',
          meta: { title: 'Mobil Pelanggan' },
          component: importComponent('mobil_pelanggan/list-mobil-pelanggan'),
        },
        {
          path: '/transaksi-pencucian',
          name: 'Transaksi Pencucian',
          meta: { title: 'Transaksi Pencucian' },
          component: importComponent('transaksi_pencucian/list-transaksi-pencucian'),
        },
        {
          path: '/transaksi-pencucian/pilih-kendaraan',
          name: 'Pilih Kendaraan Transaksi Pencucian',
          meta: { title: 'Pilih Kendaraan Transaksi Pencucian' },
          component: importComponent('transaksi_pencucian/choose-car-transaksi-pencucian'),
        },
        {
          path: '/transaksi-pencucian/tambah',
          name: 'Tambah Transaksi Pencucian',
          meta: { title: 'Tambah Transaksi Pencucian' },
          component: importComponent('transaksi_pencucian/add-transaksi-pencucian'),
        },
        {
          path: '/transaksi-pencucian/detail/:id',
          name: 'Detail Transaksi Pencucian',
          meta: { title: 'Detail Transaksi Pencucian' },
          component: importComponent('transaksi_pencucian/detail-transaksi-pencucian'),
        },
        {
          path: '/transaksi-pencucian/ubah/:id',
          name: 'Ubah Transaksi Pencucian',
          meta: { title: 'Ubah Transaksi Pencucian' },
          component: importComponent('transaksi_pencucian/edit-transaksi-pencucian'),
        },
        {
          path: '/transaksi-kedai',
          name: 'Transaksi Kedai',
          meta: { title: 'Transaksi Kedai' },
          component: importComponent('transaksi_kedai/list-transaksi-kedai'),
        },
        {
          path: '/transaksi-kedai/tambah',
          name: 'Tambah Transaksi Kedai',
          meta: { title: 'Tambah Transaksi Kedai' },
          component: importComponent('transaksi_kedai/add-transaksi-kedai'),
        },
        {
          path: '/transaksi-kedai/detail/:id',
          name: 'Detail Transaksi Kedai',
          meta: { title: 'Detail Transaksi Kedai' },
          component: importComponent('transaksi_kedai/detail-transaksi-kedai'),
        },
        {
          path: '/transaksi-kedai/ubah/:id',
          name: 'Ubah Transaksi Kedai',
          meta: { title: 'Ubah Transaksi Kedai' },
          component: importComponent('transaksi_kedai/edit-transaksi-kedai'),
        },
        {
          path: '/laporan',
          name: 'Laporan',
          meta: { title: 'Laporan' },
          component: importComponent('laporan/list-laporan'),
        },
        {
          path: '/dashboard',
          name: 'Dashboard',
          meta: { title: 'Dashboard' },
          component: importComponent('dashboard/view-dashboard'),
        },
      ],
    },
  ],
});

export default router
