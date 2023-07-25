<template>
    <v-main id="primary-bg">
        <v-container fluid>
            <v-layout row class="text-xs-center pt-3" align-center justify-center>
                <v-flex id="login-card" xs12 sm7 md6 lg4>
                    <img id="img-login" src="@/assets/logocarwash.png" alt="" srcset="">
                    <v-form ref="form">
                        <v-card class="elevation-6" id="login-layout">
                            <div class="" style="color: #316291; font-size: 32px"><b>Masuk</b></div><br>
                            <div class="subheading" style="color: #316291;">Silahkan masuk untuk memulai sesi anda!</div>
                            <v-card-text class="pt-0">
                                <v-text-field
                                    v-model="form.username" prepend-icon="mdi-account"
                                    label="Nama Pengguna" :rules="username_rule"
                                    hint="Masukkan nama pengguna anda" size="10"
                                ></v-text-field>
                                <v-text-field
                                    v-model="form.password" prepend-icon="mdi-lock"
                                    label="Kata Sandi" :rules="password_rule"
                                    hint="Masukkan kata sandi anda"
                                    :type="show ? 'text' : 'password'" color="blue"
                                    @click:append="show = !show" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                ></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn :loading="loading" rounded color="#316291" class="white--text" @click="login()" id="login-btn">Masuk</v-btn>
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
        margin-top:30px;
    }
    #login-btn{
        width:100%;
    }
    #primary-bg{
        background-color: #316291 !important;
    }
</style>

<script>

export default {
    name: 'login-view',

    created() {

    },

    data() {
        return {
            show: false,
            form: {
                username: '',
                password: '',
            },
            snackbar: {
                snackbarNotif: false,
                color: '',
                message: '',
            },
            username_rule: [ v => (v != "") || 'Username tidak boleh kosong!' ],
            password_rule: [ v => (v != "") || 'Password tidak boleh kosong!' ],
            loading: false,
        }
    },
    methods: {
        login(){
            if(this.$refs.form.validate()){
                this.loading = true;
                var url = this.$api + '/login';
                let data = {
                    username: this.form.username,
                    password: this.form.password,
                }
                this.$http.post(url, data).then((response) => {
                    this.snackbar.error_message = response.data.message;
                    this.snackbar.color = "green";
                    this.snackbar.snackbarNotif = true;
                    this.loading = false;
                    this.clear();
                    
                    let userLogin = {
                        id: response.data.data.id,
                        jabatan: response.data.data.jabatan.nama,
                    }

                    localStorage.setItem('userLogin', JSON.stringify(userLogin));

                    if(userLogin.jabatan == 'Penjaga Kedai'){
                        this.$router.push({
                            name: 'Transaksi Kedai',
                        });
                    } else{
                        this.$router.push({
                            name: 'Dashboard',
                        });
                    }
                })
                .catch((error) => {
                    this.loading = false;
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