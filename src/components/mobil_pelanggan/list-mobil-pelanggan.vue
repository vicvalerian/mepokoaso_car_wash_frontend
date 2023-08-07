<template>

    <v-main class="list">
        <loading-screen :value="loadingScreen"></loading-screen>
        <h1 class="page-custom-title">DATA MOBIL PELANGGAN</h1>
        <v-card>
            <v-card-title>
                <v-flex xs4>
                    <v-text-field v-model="list.search" append-icon="mdi-magnify" label="Cari mobil pelanggan" single-line hide-details></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
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
                </template>
                <template v-slot:no-data>
                  <div color="white" class="red--text" icon="warning"><b>Maaf, tidak ada data tersedia.</b></div>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialogDetail" persistent max-width="800px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">Detail Transaksi Pencucian Mobil Pelanggan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-content">
                    <v-container fluid>
                        <v-layout justify-center>
                            <v-flex xs12>
                                <div>
                                    <div>
                                        <v-data-table :headers="formDetail.headers" :items="formDetail.datas" class="elevation-1">
                                                <template v-slot:[`item.nomor_detail`]="{ item }">
                                                <template>{{ formDetail.datas.indexOf(item) + 1 }}</template>
                                            </template>
                                            <template v-slot:[`item.tgl_pencucian`]="{ item }">
                                                <template>{{ formatTanggal(item.tgl_pencucian) }}</template>
                                            </template>
                                            <template v-slot:no-data>
                                                <div color="white" class="red--text" icon="warning"><b>Maaf, tidak ada data tersedia.</b></div>
                                            </template>
                                        </v-data-table>
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
    name: 'mobil-pelanggan-list',
    data() {
        return {
            userLogin: JSON.parse(localStorage.getItem('userLogin')),
            loadingScreen: true,
            dialogDetail: false,
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
                headers: [],
                datas: [],
            },
        }
    },
    created(){
        this.initialize();    
    },
    methods: {
        initialize(){
            this.list.headers = [
                { text: "No", value: "nomor", width: '5%' },
                { text: "Nama Kendaraan", value: "nama_kendaraan"},
                { text: "Nomor Polisi", value: "no_polisi"},
                { text: "Jumlah Transaksi", value: "jml_transaksi"},
                { text: "Aksi", value: "actions", sortable: false},
            ];

            this.formDetail.headers = [
                // { text: "Nomor Transaksi Pencucian", value: "no_pencucian"},
                { text: "No", value: "nomor_detail" },
                { text: "Status", value: "status"},
                { text: "Tanggal Pencucian", value: "tgl_pencucian"},
                { text: "Waktu Pencucian", value: "waktu_pencucian"},
            ];

            this.axioData();
        },

        axioData() {
            let url = this.$api + '/mobil-pelanggan';
            this.$http.get(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then(response => {
                this.list.datas = response.data.data;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
            });
        },

        detailHandler(item){
            let url = this.$api + '/mobil-pelanggan-transaksi/' + item.id;
            this.$http.get(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then(response => {
                this.formDetail.datas = response.data;
            });
            this.dialogDetail = true
        },

        formatTanggal(value){
            return value.split("-").reverse().join("-");
        },
    },
    mounted(){

    },
    computed:{

    },
}
</script>