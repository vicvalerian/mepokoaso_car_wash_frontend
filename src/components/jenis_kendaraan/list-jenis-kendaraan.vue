<template>

    <v-main class="list">
        <loading-screen :value="loadingScreen"></loading-screen>
        <h1 class="page-custom-title">DATA JENIS KENDARAAN</h1>
        <v-card>
            <v-card-title>
                <v-flex xs4>
                    <v-text-field v-model="list.search" append-icon="mdi-magnify" label="Cari jenis kendaraan" single-line hide-details></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-btn dense class="btn-add-data" @click="dialogAddEdit=true">Tambah Data</v-btn>
            </v-card-title>

            <v-data-table :headers="list.headers" :items="list.datas" :search="list.search" class="elevation-1">
                <template v-slot:[`item.nomor`]="{ item }">
                    <template>{{ list.datas.indexOf(item) + 1 }}</template>
                </template>
                <template v-slot:[`item.logo`]="{ item }">
                    <v-img :src="$baseUrl+'/storage/'+item.logo" height="30px" width="30px" style="object-fit:cover; border-radius:50%; padding: 15px 0;"/>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon dense color="#316291" @click="detailHandler(item)" class="data-table-icon">mdi-information</v-icon>
                    <v-icon dense color="#316291" @click="editHandler(item)" class="data-table-icon">mdi-pencil</v-icon>
                    <v-icon dense color="#316291" @click="deleteHandler(item.id)" class="data-table-icon">mdi-delete</v-icon>
                </template>
                <template v-slot:no-data>
                  <div color="white" class="red--text" icon="warning"><b>Maaf, tidak ada data tersedia.</b></div>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialogConfirmDelete" persistent max-width="400px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">Hapus Data Jenis Kendaraan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <span >Apakah anda yakin ingin menghapus data jenis kendaraan ini?</span>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="dialogConfirmDelete = false">Batal</v-btn>
                    <v-btn dense class="btn-confirm-delete" @click="deleteData()">Hapus</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDetail" persistent max-width="600px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">Detail Data Jenis Kendaraan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-content">
                    <v-container fluid>
                        <v-layout justify-center>
                            <v-flex xs12>
                                <div class="row">
                                    <div class="mr-8">
                                        <v-img contain width="300px" :src="previewImgLogo == '' ? $baseUrl+'/storage/'+formDetail.logo : previewImgLogo" style="object-fit:cover;"></v-img>
                                    </div>
                                    <div>
                                        <v-text-field v-model="formDetail.nama" label="Nama Jenis Kendaraan" readonly></v-text-field>
                                    </div>
                                </div>        
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="dialogDetail = false">Tutup</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogAddEdit" persistent max-width="600px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">{{formTitle}} Data Jenis Kendaraan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <v-container v-if="inputType == 'Tambah'">
                        <v-text-field v-model="form.nama" label="Nama Jenis Kendaraan" required></v-text-field>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Logo Jenis Kendaraan" id="logoJenisKendaraan" ref="fileJenisKendaraan"></v-file-input>
                    </v-container>
                    <v-container v-else>
                        <v-text-field v-model="form.nama" label="Nama Jenis Kendaraan" required></v-text-field>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Logo Jenis Kendaraan" id="logoJenisKendaraan" ref="fileJenisKendaraan"></v-file-input>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="cancelForm()">Batal</v-btn>
                    <v-btn dense class="btn-confirm-delete" @click="setForm()">Simpan</v-btn>
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
    name: 'jenis-kendaraan-list',
    data() {
        return {
            userLogin: JSON.parse(localStorage.getItem('userLogin')),
            loadingScreen: true,
            previewImgLogo: '',
            inputType: 'Tambah',
            dialogConfirmDelete: false,
            dialogDetail: false,
            dialogAddEdit: false,
            jenisKendaraan: new FormData(),
            editId: '',
            deleteId: '',
            snackbar: {
                snackbarNotif: false,
                color: '',
                message: '',
            },
            list: {
                headers: [],
                datas: [],
                search: '',
            },
            formDetail: {
                nama: '',
                logo: '',
            },
            form: {
                nama: '',
                logo: '',
            },
        }
    },
    created(){
        this.initialize();    
    },
    methods: {
        setForm(){
            if (this.inputType !== 'Tambah') {
                this.updateData();
            } else {
                this.saveData();
            }
        },

        onPreviewImage(e) {
            this.previewImgLogo = URL.createObjectURL(e)
        },

        initialize(){
            this.list.headers = [
                { text: "No", value: "nomor", width: '5%' },
                { text: "Jenis Kendaraan", value: "nama"},
                { text: "Logo", value: "logo", filterable: false},
                { text: "Aksi", value: "actions", sortable: false},
            ];

            this.axioData();
        },

        axioData() {
            let url = this.$api + '/jenis-kendaraan';
            this.$http.get(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then(response => {
                this.list.datas = response.data.data;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
            });
        },

        saveData(){
            this.jenisKendaraan.append('nama', this.form.nama);

            var logo_jenis_kendaraan = document.getElementById('logoJenisKendaraan'), dataLogoJenisKendaraan = logo_jenis_kendaraan.files[0];
            this.jenisKendaraan.append('logo', dataLogoJenisKendaraan);

            this.loadingScreen = true;
            var url = this.$api + '/jenis-kendaraan';
            this.$http.post(url, this.jenisKendaraan, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEdit = false
                this.axioData();
                this.cancelForm();
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
                this.dialogAddEdit = false
            });
        },

        updateData(){
            var data = new FormData();
            data.append('nama', this.form.nama);

            var logo_jenis_kendaraan = document.getElementById('logoJenisKendaraan'), dataLogoJenisKendaraan = logo_jenis_kendaraan.files[0];

            if(dataLogoJenisKendaraan){
                data.append('logo', dataLogoJenisKendaraan);
            }

            this.loadingScreen = true;
            var url = this.$api + '/jenis-kendaraan/' + this.editId;
            this.load = true;
            this.$http.post(url, data, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEdit = false
                this.axioData();
                this.cancelForm();
                this.inputType = 'Tambah';

                if(dataLogoJenisKendaraan){
                    location.reload();
                }
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
                this.dialogAddEdit = false
            });
        },

        deleteData(){
            this.loadingScreen = true;
            let id = this.deleteId;
            var url = this.$api + "/jenis-kendaraan/" + id;
            this.$http.delete(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogConfirmDelete = false
                this.axioData();
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
                this.dialogConfirmDelete = false
            });
        },

        detailHandler(item){
            this.formDetail.nama = item.nama
            this.formDetail.logo = item.logo
            this.dialogDetail = true
        },

        editHandler(item) {
            this.inputType = 'Ubah';
            this.editId = item.id;
            this.form.nama = item.nama;
            this.form.logo = item.logo;
            this.dialogAddEdit = true;
        },

        deleteHandler(item) {
            this.deleteId = item
            this.dialogConfirmDelete = true
        },

        clearForm(){
            this.form ={
                nama: '',
                logo: '',
            };
            this.$refs.fileJenisKendaraan.reset();
        },

        cancelForm(){
            this.clearForm()
            this.dialogAddEdit = false
            this.inputType = 'Tambah'
        },
    },
    mounted(){

    },
    computed:{
        formTitle() {
            return this.inputType;
        },
    },
}
</script>