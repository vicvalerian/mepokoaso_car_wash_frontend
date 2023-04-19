<template>

    <v-main class="list">
        <h1 class="page-custom-title">DATA TRANSAKSI KEDAI</h1>
        <v-card>
            <v-card-title>
                <v-spacer></v-spacer>
                <v-btn dense class="btn-add-data" @click="goToAdd()">Tambah Data</v-btn>
                <v-text-field v-model="list.search" append-icon="mdi-magnify" label="Cari transaksi kedai" single-line hide-details></v-text-field>
            </v-card-title>

            <v-data-table :headers="list.headers" :items="list.datas" :search="list.search" class="elevation-1">
                <template v-slot:[`item.total_penjualan`]="{ item }">
                    <template>Rp{{ item.total_penjualan }}</template>
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

        <v-dialog v-model="dialogConfirmDelete" persistent max-width="450px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">Hapus Data Transaksi Kedai</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <span >Apakah anda yakin ingin menghapus data transaksi kedai ini?</span>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="dialogConfirmDelete = false">Batal</v-btn>
                    <v-btn dense class="btn-confirm-delete" @click="deleteData()">Hapus</v-btn>
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

export default {
    name: 'transaksi-pencucian-list',
    data() {
        return {
            dialogConfirmDelete: false,
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
        }
    },
    created(){
        this.initialize();    
    },
    methods: {
        initialize(){
            this.list.headers = [
                { text: "Nomor Penjualan", value: "no_penjualan"},
                { text: "Tanggal Penjualan", value: "tgl_penjualan"},
                { text: "Pelayan", value: "karyawan.nama"},
                { text: "Total Penjualan", value: "total_penjualan"},
                { text: "Aksi", value: "actions", sortable: false},
            ];

            this.axioData();
        },

        axioData(){
            let url = this.$api + '/transaksi-kedai';
            this.$http.get(url).then(response => {
                this.list.datas = response.data.data;
            });
        },

        deleteData(){
            let id = this.deleteId;
            var url = this.$api + "/transaksi-pencucian/" + id;
            this.$http.delete(url).then((response) => {
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
                this.dialogConfirmDelete = false
            });
        },

        deleteHandler(item) {
            this.deleteId = item
            this.dialogConfirmDelete = true
        },

        goToAdd(){
            this.$router.push({
                name: 'Tambah Transaksi Kedai',
            });
        },

        detailHandler(item){
            this.$router.push({
                path: '/transaksi-kedai/detail/' + item.id,
            });
        },

        editHandler(item) {
            this.$router.push({
                path: '/transaksi-kedai/ubah/' + item.id,
            });
        },
    },
    mounted(){

    },
    watch: {

    },
    computed:{

    },
}
</script>