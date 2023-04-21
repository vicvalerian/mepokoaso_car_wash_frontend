<template>
  <div class="dashboard">
    <v-navigation-drawer v-model="drawer" class="fullheight" width="270" height="390" app>
      <v-list-item class="primary--background">
        <v-list-item-content class="mt-n4 mb-n4 ml-n4">
          <v-col cols="">
            <img src="@/assets/logocarwash.png" height="150px">
          </v-col>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in admins" :key="item.title" color="#316291" link tag="router-link" :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-left">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
    </v-navigation-drawer>
    
    <v-app-bar app fixed height="80px" class="primary--background">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="white"></v-app-bar-nav-icon>
      <v-toolbar-title class="white--text"><b>Selamat datang, Admin!</b></v-toolbar-title>
      <VSpacer/>
      <v-toolbar-items>
        <v-btn @click="goToProfile()" text router><v-icon color="white" size="30">mdi-account-circle</v-icon></v-btn>
        <v-btn @click="logout()" text router><v-icon color="white" size="30">mdi-exit-to-app</v-icon></v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <div class="fullheight pa-5">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "dashboard-layout",
    data() {
      return {
        drawer: true,
        admins: [
          { title: "Dashboard", to: '/dashboard', icon: 'mdi-monitor' },
          { title: 'Kendaraan', to: '/kendaraan', icon: 'mdi-car-multiple' },
          { title: 'Jenis Kendaraan', to: '/jenis-kendaraan', icon: 'mdi-tag-multiple',  },
          { title: 'Karyawan', to: '/karyawan', icon: 'mdi-account-group' },
          { title: 'Jabatan', to: '/jabatan', icon: 'mdi-car' },
          { title: 'Gaji Karyawan', to: '/gaji-karyawan', icon: 'mdi-cash-multiple' },
          { title: 'Peminjaman Karyawan', to: '/peminjaman-karyawan', icon: 'mdi-checkbook' },
          { title: 'Transaksi Pencucian', to: '/transaksi-pencucian', icon: 'mdi-car-wash' },
          { title: 'Mobil Pelanggan', to: '/mobil-pelanggan', icon: 'mdi-car-info' },
          { title: 'Transaksi Kedai', to: '/transaksi-kedai', icon: 'mdi-store' },
          { title: 'Menu Kedai', to: '/menu-kedai', icon: 'mdi-book-open' },
          { title: 'Pengeluaran Kedai', to: '/pengeluaran-kedai', icon: 'mdi-cart' },
          { title: 'Laporan', to: '/laporan', icon: 'mdi-file-export' },
        ],
      };
    },
    methods: {
      goToProfile(){
        this.$router.push({
          name: 'Profil',
        });
      },

      logout(){
        if(localStorage.getItem('id_pelanggan') != null){
          this.$router.push({
            name: 'Login',
          });
        } else if(localStorage.getItem('id_pegawai') != null){
          this.$router.push({
            name: 'Login',
          });
        }
      },
    },
    computed: {
      //Login Admin
      loggedInAdmin(){
        return localStorage.getItem('id_jabatan') == '2' && localStorage.getItem("email") != null;
      },
    },
  };
</script>

<style scoped>
  .fullheight {
    min-height: 100vh !important;
  }

  .router {
    text-decoration: none;
    color: black;
  }

  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Sansita:wght@700&family=Satisfy&display=swap');

  .custom1--text{
      font-family: 'Anton', sans-serif !important;
  }

  .custom2--text{
      font-family: 'Sansita', sans-serif !important;
  }

  .primary--background{
    background-color:#316291 !important;
  }
</style>