<template>
  <div class="dashboard">
    <v-navigation-drawer v-model="drawer" class="fullheight" width="300" height="390" app temporary>
      <v-list-item class="primary--background">
        <v-list-item-content class="mt-n4 mb-n4 ml-n4">
          <v-col cols="">
            <img src="@/assets/logocarwash.png" height="150px">
          </v-col>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav v-if="loggedInKasir">
        <div v-for="(link, i) in admins" :key="i">
          <v-list-item v-if="!link.subLinks" color="#316291" :to="link.to" link tag="router-link">
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="text-left">{{ link.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group v-else :key="link.title" :prepend-icon="link.icon" no-action :value="false">
            <template v-slot:activator>
              <v-list-item-title class="text-left">{{ link.title }}</v-list-item-title>
            </template>

            <v-list-item v-for="sublink in link.subLinks" :to="sublink.to" :key="sublink.title" color="#316291" link tag="router-link">
              <v-list-item-icon>
                <v-icon>{{ sublink.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-left">{{ sublink.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </div>
      </v-list>

      <v-list dense nav v-if="loggedInPemilik">
        <v-list-item v-for="item in pemilik" :key="item.title" color="#316291" link tag="router-link" :to="item.to">
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
      <v-toolbar-title v-if="loggedInKasir" class="white--text"><b>Selamat datang, Kasir!</b></v-toolbar-title>
      <v-toolbar-title v-if="loggedInPemilik" class="white--text"><b>Selamat datang, Pemilik!</b></v-toolbar-title>
      <VSpacer/>
      <v-toolbar-items>
        <v-tooltip bottom color="#316291">
          <template v-slot:activator="{ on, attrs }">
            <v-btn @click="goToProfile()" text router v-bind="attrs" v-on="on"><v-icon color="white" size="30">mdi-account-circle</v-icon></v-btn>
          </template>
          <span>Profil</span>
        </v-tooltip>
        <v-tooltip bottom color="#316291">
          <template v-slot:activator="{ on, attrs }">
        <v-btn @click="logout()" text router v-bind="attrs" v-on="on"><v-icon color="white" size="30">mdi-exit-to-app</v-icon></v-btn>
          </template>
          <span>Keluar</span>
        </v-tooltip>
      </v-toolbar-items>
    </v-app-bar>
    <div class="fullheight pa-5 grey lighten-4">
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
        userLogin: JSON.parse(localStorage.getItem('userLogin')),
        admins: [
          { title: "Dashboard", to: '/dashboard', icon: 'mdi-monitor' },
          { title: 'Transaksi', icon: 'mdi-content-save-cog', 
            subLinks:[
              { title: 'Transaksi Pencucian', to: '/transaksi-pencucian', icon: 'mdi-car-wash' },
              { title: 'Transaksi Kedai', to: '/transaksi-kedai', icon: 'mdi-store' },
            ], 
          },
          { title: 'Pengaturan Data', icon: 'mdi-database-cog', 
            subLinks:[
              { title: 'Jabatan', to: '/jabatan', icon: 'mdi-badge-account' },
              { title: 'Karyawan', to: '/karyawan', icon: 'mdi-account-group' },
              { title: 'Jenis Kendaraan', to: '/jenis-kendaraan', icon: 'mdi-tag-multiple' },
              { title: 'Kendaraan', to: '/kendaraan', icon: 'mdi-car-multiple' },
              { title: 'Mobil Pelanggan', to: '/mobil-pelanggan', icon: 'mdi-car-info' },
              { title: 'Menu Kedai', to: '/menu-kedai', icon: 'mdi-book-open' },
            ], 
          },
          { title: 'Administrasi Keuangan', icon: 'mdi-cash', 
            subLinks:[
              { title: 'Gaji Karyawan', to: '/gaji-karyawan', icon: 'mdi-cash-multiple' },
              { title: 'Peminjaman Karyawan', to: '/peminjaman-karyawan', icon: 'mdi-checkbook' },
              { title: 'Pengeluaran Kedai', to: '/pengeluaran-kedai', icon: 'mdi-cart' },
            ], 
          },
          { title: 'Laporan', to: '/laporan', icon: 'mdi-file-export' },
        ],
        pemilik: [
          { title: "Dashboard", to: '/dashboard', icon: 'mdi-monitor' },
          { title: 'Laporan', to: '/laporan', icon: 'mdi-file-export' },
        ]
      };
    },
    methods: {
      goToProfile(){
        const path = `/profil`
        if(this.$route.path !== path){
          this.$router.push({
            name: 'Profil',
          });
        }
      },

      logout(){
        localStorage.removeItem('userLogin');
        this.$router.push({
          name: 'Login',
        });
      },
    },
    computed: {
      //Login Kasir
      loggedInKasir(){
        return this.userLogin.jabatan == 'Kasir';
      },

      //Login Pemilik
      loggedInPemilik(){
        return this.userLogin.jabatan == 'Pemilik';
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