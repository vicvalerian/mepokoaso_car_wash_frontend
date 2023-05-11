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
      path: '/',
      name: 'Riwayat Pencucian Mobil',
      meta: { title: 'Riwayat Pencucian Mobil' },
      component: importComponent('riwayat_mobil/cari-riwayat-mobil'),
    },
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
        {
          path: '/profil',
          name: 'Profil',
          meta: { title: 'Profil' },
          component: importComponent('profil/view-profil'),
        },
      ],
    },
    {
      path: '/admin',
      name: 'Login',
      meta: { title: 'Login' },
      component: importComponent('LoginPage'),
    },
    // {
    //   path: '/riwayat-pencucian',
    //   name: 'Riwayat Pencucian Mobil',
    //   meta: { title: 'Riwayat Pencucian Mobil' },
    //   component: importComponent('riwayat_mobil/cari-riwayat-mobil'),
    // },
    {
      path: '/riwayat-pencucian/hasil',
      name: 'Hasil Riwayat Pencucian Mobil',
      meta: { title: 'Hasil Riwayat Pencucian Mobil' },
      component: importComponent('riwayat_mobil/hasil-riwayat-mobil'),
    },
    {
      path: '*',
      redirect: '/riwayat-pencucian'
    },
  ],
});

router.beforeEach((to, from, next) => {
  let userLogin = JSON.parse(localStorage.getItem("userLogin")) ?? null;
  let jabatan = '';
  if(userLogin){
    jabatan = userLogin.jabatan;
  }

  //Jika sudah Login maka tidak dapat kembali ke halaman Login & Register
  if(to.name == "Login"  && localStorage.getItem("userLogin") != null){
      next({ name: "Dashboard" })
      document.title = "Dashboard"
  }
  
  //Jika belum Login maka tidak dapat membuka halaman lain
  if(to.name == "Jenis Kendaraan" && localStorage.getItem("userLogin") == null ||
      to.name == "Jabatan" && localStorage.getItem("userLogin") == null ||
      to.name == "Kendaraan" && localStorage.getItem("userLogin") == null ||
      to.name == "Karyawan" && localStorage.getItem("userLogin") == null ||
      to.name == "Peminjaman Karyawan" && localStorage.getItem("userLogin") == null ||
      to.name == "Menu Kedai" && localStorage.getItem("userLogin") == null ||
      to.name == "Gaji Karyawan" && localStorage.getItem("userLogin") == null ||
      to.name == "Pengeluaran Kedai" && localStorage.getItem("userLogin") == null ||
      to.name == "Mobil Pelanggan" && localStorage.getItem("userLogin") == null ||
      to.name == "Transaksi Pencucian" && localStorage.getItem("userLogin") == null ||
      to.name == "Pilih Kendaraan Transaksi Pencucian" && localStorage.getItem("userLogin") == null ||
      to.name == "Tambah Transaksi Pencucian" && localStorage.getItem("userLogin") == null ||
      to.name == "Detail Transaksi Pencucian" && localStorage.getItem("userLogin") == null ||
      to.name == "Ubah Transaksi Pencucian" && localStorage.getItem("userLogin") == null ||
      to.name == "Transaksi Kedai" && localStorage.getItem("userLogin") == null ||
      to.name == "Tambah Transaksi Kedai" && localStorage.getItem("userLogin") == null ||
      to.name == "Detail Transaksi Kedai" && localStorage.getItem("userLogin") == null ||
      to.name == "Ubah Transaksi Kedai" && localStorage.getItem("userLogin") == null ||
      to.name == "Laporan" && localStorage.getItem("userLogin") == null ||
      to.name == "Dashboard" && localStorage.getItem("userLogin") == null ||
      to.name == "Profil" && localStorage.getItem("userLogin") == null){
    next({ name: "Login" })
    document.title = "Login"
  }

  //Pemilik hanya dapat melihat dashboard, profil, dan laporan
  if(to.name == "Jenis Kendaraan" && jabatan != 'Kasir' ||
      to.name == "Jabatan" && jabatan != 'Kasir' ||
      to.name == "Kendaraan" && jabatan != 'Kasir' ||
      to.name == "Karyawan" && jabatan != 'Kasir' ||
      to.name == "Peminjaman Karyawan" && jabatan != 'Kasir' ||
      to.name == "Menu Kedai" && jabatan != 'Kasir' ||
      to.name == "Gaji Karyawan" && jabatan != 'Kasir' ||
      to.name == "Pengeluaran Kedai" && jabatan != 'Kasir' ||
      to.name == "Mobil Pelanggan" && jabatan != 'Kasir' ||
      to.name == "Transaksi Pencucian" && jabatan != 'Kasir' ||
      to.name == "Pilih Kendaraan Transaksi Pencucian" && jabatan != 'Kasir' ||
      to.name == "Tambah Transaksi Pencucian" && jabatan != 'Kasir' ||
      to.name == "Detail Transaksi Pencucian" && jabatan != 'Kasir' ||
      to.name == "Ubah Transaksi Pencucian" && jabatan != 'Kasir' ||
      to.name == "Transaksi Kedai" && (jabatan != 'Kasir' && jabatan != 'Penjaga Kedai') ||
      to.name == "Tambah Transaksi Kedai" && (jabatan != 'Kasir' && jabatan != 'Penjaga Kedai') ||
      to.name == "Detail Transaksi Kedai" && (jabatan != 'Kasir' && jabatan != 'Penjaga Kedai') ||
      to.name == "Ubah Transaksi Kedai" && (jabatan != 'Kasir' && jabatan != 'Penjaga Kedai')){
    next({ name: "Dashboard" })
    document.title = "Dashboard"
  }

  //Penjaga kedai hanya dapat melihat transaksi kedai
  if(to.name == "Dashboard" && (jabatan != 'Kasir' && jabatan != 'Pemilik')  ||
      to.name == "Laporan" && (jabatan != 'Kasir' && jabatan != 'Pemilik')){
    next({ name: "Transaksi Kedai" })
    document.title = "Transaksi Kedai"
  }

  document.title = to.meta.title;
  next();
});


export default router
