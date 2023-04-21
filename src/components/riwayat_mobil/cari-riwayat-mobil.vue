<template>
    <v-main>
        <v-app-bar app fixed height="80px" id="primary-bg">
            <v-app-bar-nav-icon class="ml-4">
                <img src="@/assets/logocarwash.png" height="75px">
            </v-app-bar-nav-icon>
            <v-toolbar-title class="text-center">
                <b class="white--text">MEPOKASO CAR WASH</b>
            </v-toolbar-title>
        </v-app-bar>
        <v-container class="fill-height" fluid>
            <v-layout row class="" align-center justify-center>
                <v-flex id="login-card" xs12 sm md7 lg4>
                    <v-form ref="form">
                        <v-card class="elevation-6" id="login-layout">
                            <div class="" style="color: #316291; font-size: 24px"><b>CEK RIWAYAT PENCUCIAN MOBIL</b></div><br>
                            <v-card-text class="pt-0">
                                <v-text-field
                                    v-model="form.no_plat"
                                    label="Nomor Plat Kendaraan" :rules="no_plat_rule"
                                    hint="Masukkan nomor Plat Kendaraan" size="10"
                                ></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn rounded color="#316291" class="white--text" @click="search()" id="login-btn">Cari</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-form>
                </v-flex>
            </v-layout>
        </v-container>
        <v-snackbar v-model="snackbar.snackbarNotif" :color="snackbar.color" timeout="3000" bottom>{{ snackbar.error_message }}</v-snackbar>
    </v-main>
</template>

<style>
    #img-login{
        max-width:40%;
        height:auto;
    }
    #login-contain{
        background:#303f9f;
    }
    #login-layout{
        padding:30px 7px 30px 7px;
        /* margin-top:30px; */
    }
    #login-btn{
        width:100%;
    }
    #primary-bg{
        background-color: #316291 !important;
    }
    .fill-height{
        height: 80%;
    }
</style>

<script>

export default {
    name: 'login-view',

    created() {

    },

    data() {
        return {
            form: {
                no_plat: '',
            },
            snackbar: {
                snackbarNotif: false,
                color: '',
                message: '',
            },
            no_plat_rule: [ v => (v != "") || 'Nomor plat tidak boleh kosong!' ],
        }
    },
    methods: {
        search(){
            if(this.$refs.form.validate()){
                var url = this.$api + '/riwayat/mobil-pelanggan?no_polisi=' + this.form.no_plat;
                this.$http.get(url).then((response) => {
                    this.snackbar.error_message = response.data.message;
                    this.snackbar.color = "green";
                    this.snackbar.snackbarNotif = true;
                    localStorage.setItem('no_polisi', this.form.no_plat);
                    this.clear();
                    this.$router.push({
                        name: 'Hasil Riwayat Pencucian Mobil',
                    });
                })
                .catch((error) => {
                    this.snackbar.error_message = error.response.data.message;
                    this.snackbar.color = "red";
                    this.snackbar.snackbarNotif = true;
                });
            }
        },

        clear() {
            this.$refs.form.reset();
        },
    },

    mounted() {
        
    },
  }
</script>