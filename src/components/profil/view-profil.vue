<template>

    <v-main class="list">
        <loading-screen :value="loadingScreen"></loading-screen>
        <h1 class="page-custom-title">PROFIL</h1>
        <v-layout justify wrap>
            <v-flex md4 sm6 xs12 class="pr-2 pb-2">
                <v-card>
                    <v-card-text class="dialog-confirm-content text-center">
                        <v-img contain height="250px" :src="form.foto != '' ? $baseUrl+'/storage/'+form.foto : form.foto" style="object-fit:cover;"></v-img>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <v-btn dense color="btn-confirm-cancel" @click="dialogUbahFoto = true">Ubah Foto Profil</v-btn>
                        <v-btn dense color="btn-confirm-delete" @click="dialogUbahPassword = true">Ubah Kata Sandi</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
            <v-flex md8 sm6 xs12 class="pr-2 pb-2">
                <v-card>
                    <v-card-title class="justify-center"><b>Informasi Pribadi</b></v-card-title>
                    <v-card-text class="dialog-confirm-content">
                        <v-text-field v-model="form.nama" label="Nama Lengkap"></v-text-field>
                        <v-text-field v-model="form.no_telp" label="Nomor Telepon"></v-text-field>
                        <v-text-field v-model="form.username" label="Nama Pengguna"></v-text-field>
                        <!-- <v-select :items="statuses" v-model="form.status" label="Status"></v-select> -->
                        <v-select :items="jabatan_list" v-model="form.jabatan_id" label="Jabatan" readonly></v-select>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn dense color="btn-confirm-delete" @click="updateProfil()" :loading="loading">Simpan</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>

        <v-dialog v-model="dialogUbahFoto" persistent max-width="500px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">Ubah Foto Profil</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <v-file-input append-icon="mdi-camera" accept="image/*" label="Foto Karyawan" id="fotoKaryawan" ref="fileKaryawan"></v-file-input>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="closeDialogFoto()">Batal</v-btn>
                    <v-btn dense class="btn-confirm-delete" @click="updateFotoProfil()" :loading="loading">Ubah</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogUbahPassword" persistent max-width="500px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">Ubah Kata Sandi</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <v-form ref="form">
                        <v-text-field v-model="formEdit.password" label="Kata Sandi Lama" :rules="old_password_rule"
                        :type="show ? 'text' : 'password'" color="blue"
                        @click:append="show = !show" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"></v-text-field>

                        <v-text-field v-model="formEdit.newPassword" label="Kata Sandi Baru" :rules="new_password_rule"
                        :type="show2 ? 'text' : 'password'" color="blue"
                        @click:append="show2 = !show2" :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"></v-text-field>

                        <v-text-field v-model="formEdit.confirmNewPassword" label="Konfirmasi Kata Sandi Baru" :rules="confirm_password_rule"
                        :type="show3 ? 'text' : 'password'" color="blue"
                        @click:append="show3 = !show3" :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="closeDialogPassword()">Batal</v-btn>
                    <v-btn dense class="btn-confirm-delete" @click="submitForm()" :loading="loading">Ubah</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.snackbarNotif" :color="snackbar.color" timeout="3000" bottom>{{ snackbar.error_message }}</v-snackbar>
    </v-main>

</template>

<style>
    .page-custom-title{
        margin: 24px 0px;
        text-align: left;
        color: black !important;
    }

    .data-table-icon{
        padding: 0 5px !important;
    }

    .btn-add-data{
        background-color: #316291 !important;
        color: #FCFDEF !important;
        padding: 15px !important;
        text-align: center !important;
        font-size: 12px !important;
        border-radius: 15px !important;
        margin-right: 24px !important;
    }

    .btn-confirm-delete{
        background-color: #316291 !important;
        color: #FCFDEF !important;
        padding: 15px !important;
        text-align: center !important;
        font-size: 12px !important;
        border-radius: 15px !important;
    }

    .btn-confirm-cancel{
        background-color: #FCFDEF !important;
        border: 1px solid #316291 !important;
        color: #316291 !important;
        padding: 15px !important;
        text-align: center !important;
        font-size: 12px !important;
        border-radius: 15px !important;
    }

    .dialog-confirm-title{
        background-color: #316291 !important;
        font-size: 24px !important;
    }

    .dialog-confirm-text{
        text-align: left !important;
        color: black !important;
        align-content: center !important;
        padding-top: 20px !important;
        font-size: 16px !important;
    }

    .dialog-confirm-content{
        padding-top: 20px !important;
    }
</style>

<script>
import LoadingScreen from '@/components/loading-screen.vue';

export default {
    components: {
        'loading-screen': LoadingScreen,
    },
    name: 'profil-list',
    data() {
        return {
            loadingScreen: true,
            loading: false,
            show: false,
            show2: false,
            show3: false,
            previewImgLogo: '',
            userLogin: JSON.parse(localStorage.getItem('userLogin')),
            dialogUbahFoto: false,
            dialogUbahPassword: false,
            jabatan_list: [],
            statuses: ['Aktif', 'Izin', 'Tidak Aktif'],
            snackbar: {
                snackbarNotif: false,
                color: '',
                message: '',
            },
            form: {
                nama: '',
                no_telp: '',
                username: '',
                status: '',
                jabatan_id: '',
                foto: '',
            },
            formEdit:{
                password: '',
                newPassword: '',
                confirmNewPassword: '',
                foto: '',
            },
            old_password_rule: [ v => (v != "") || 'Kata sandi lama tidak boleh kosong!' ],
            new_password_rule: [ v => (v != "") || 'Kata sandi baru tidak boleh kosong!' ],
            confirm_password_rule: [ v => (v != "") || 'Konfirmasi kata sandi baru tidak boleh kosong!' ],
        }
    },
    created(){
        this.axioData();
        this.axioJabatan();
    },
    methods: {
        onPreviewImage(e) {
            this.previewImgLogo = URL.createObjectURL(e)
        },

        axioData(){
            let url = this.$api + '/karyawan/' + this.userLogin.id;
            this.$http.get(url).then(response => {
                this.form.nama = response.data.data.nama;
                this.form.no_telp = response.data.data.no_telp;
                this.form.username = response.data.data.username;
                this.form.status = response.data.data.status;
                this.form.jabatan_id = response.data.data.jabatan_id;
                this.form.foto = response.data.data.foto;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
            });
        },

        axioJabatan(){
            let url = this.$api + '/list-selection-jabatan';
            this.$http.get(url).then(response => {
                if(response.status == 200){
                    let data = JSON.parse(JSON.stringify(response.data));
                    data.forEach((item)=>{
                        let dashboard = item;
                        dashboard.text = item.nama
                        dashboard.value = item.id
                        this.jabatan_list.push(dashboard);
                    });
                }
            });
        },

        submitForm(){
            if(this.$refs.form.validate()){
                if(this.formEdit.newPassword != this.formEdit.confirmNewPassword){
                    this.snackbar.error_message = "Kata Sandi Baru Tidak Sama!";
                    this.snackbar.color = "red";
                    this.snackbar.snackbarNotif = true;
                } else{
                    this.updatePassword();
                }
            }
        },

        updateProfil(){
            var data = new FormData();
            data.append('jabatan_id', this.form.jabatan_id);
            data.append('nama', this.form.nama);
            data.append('no_telp', this.form.no_telp);
            data.append('username', this.form.username);
            data.append('status', this.form.status);

            this.loading = true;
            var url = this.$api + '/karyawan/profil/' + this.userLogin.id;
            this.$http.post(url, data).then((response) => {
                this.loading = false;
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEdit = false
                this.axioData();
                // location.reload();
            })
            .catch((error) => {
                this.loading = false;
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
            });
        },

        updateFotoProfil(){
            var data = new FormData();
            var foto_karyawan = document.getElementById('fotoKaryawan'), dataFotoKaryawan = foto_karyawan.files[0];
            data.append('foto', dataFotoKaryawan);

            this.loading = true;
            var url = this.$api + '/karyawan/photo/' + this.userLogin.id;
            this.$http.post(url, data).then((response) => {
                this.loading = false;
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEdit = false
                this.axioData();
                this.closeDialogFoto();
                // location.reload();
            })
            .catch((error) => {
                this.loading = false;
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                this.closeDialogFoto();
            });
        },

        updatePassword(){
            var data = new FormData();
            data.append('password', this.formEdit.password);
            data.append('newPassword', this.formEdit.newPassword);
            data.append('confirmNewPassword', this.formEdit.confirmNewPassword);

            this.loading = true;
            var url = this.$api + '/karyawan/password/' + this.userLogin.id;
            this.$http.post(url, data).then((response) => {
                this.loading = false;
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEdit = false
                this.axioData();
                this.closeDialogPassword();
            })
            .catch((error) => {
                this.loading = false;
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                // this.closeDialogPassword();
            });
        },

        closeDialogFoto(){
            this.formEdit = {
                foto: '',
            };
            this.$refs.fileKaryawan.reset();
            this.dialogUbahFoto = false;
        },

        closeDialogPassword(){
            this.formEdit = {
                password: '',
                newPassword: '',
                confirmNewPassword: '',
                foto: '',
            };
            this.$refs.form.reset();
            this.dialogUbahPassword = false;
        },
    },
    mounted(){

    },
    computed:{

    },
}
</script>