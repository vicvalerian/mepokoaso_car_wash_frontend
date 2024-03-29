<template>

    <v-main class="list">
        <loading-screen :value="loadingScreen"></loading-screen>
        <h1 class="page-custom-title">DATA TRANSAKSI KEDAI</h1>
        <v-card>
            <v-card-title>
                <v-flex xs3>
                    <v-text-field v-model="list.search" append-icon="mdi-magnify" label="Cari transaksi kedai" single-line hide-details></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-btn dense class="btn-add-data" @click="goToAdd()">Tambah Data</v-btn>
            </v-card-title>

            <v-data-table :headers="list.headers" :items="list.datas" :search="list.search" class="elevation-1"
                :footer-props="{
                    showFirstLastPage: true,
                    firstIcon: 'mdi-skip-previous',
                    lastIcon: 'mdi-skip-next',
                    itemsPerPageAllText: 'Semua',
                    itemsPerPageText: 'Data per halaman',
                }"
            >
                <template v-slot:[`item.nomor`]="{ item }">
                    <template>{{ list.datas.indexOf(item) + 1 }}</template>
                </template>
                <template v-slot:[`item.tgl_penjualan`]="{ item }">
                    <template>{{ formatTanggal(item.tgl_penjualan) }}</template>
                </template>
                <template v-slot:[`item.total_penjualan`]="{ item }">
                    <template>{{ formatRupiah(item.total_penjualan, 'Rp') }}</template>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon dense color="#316291" @click="detailHandler(item)" class="data-table-icon">mdi-information</v-icon>
                    <v-icon dense color="#316291" @click="editHandler(item)" class="data-table-icon">mdi-pencil</v-icon>
                    <v-icon dense color="#316291" @click="deleteHandler(item.uuid)" class="data-table-icon">mdi-delete</v-icon>
                </template>
                <template v-slot:[`footer.page-text`]="items"> 
                    {{ items.pageStart }} - {{ items.pageStop }} dari {{ items.itemsLength }}
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
import LoadingScreen from '@/components/loading-screen.vue';

export default {
    components: {
        'loading-screen': LoadingScreen,
    },
    name: 'transaksi-kedai-list',
    data() {
        return {
            userLogin: JSON.parse(localStorage.getItem('userLogin')),
            loadingScreen: true,
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
                { text: "No", value: "nomor", width: '5%' },
                { text: "Nomor Transaksi Penjualan", value: "no_penjualan"},
                { text: "Tanggal Penjualan", value: "tgl_penjualan"},
                { text: "Pelayan", value: "karyawan.nama"},
                { text: "Total Penjualan", value: "total_penjualan"},
                { text: "Aksi", value: "actions", sortable: false},
            ];

            this.axioData();
        },

        axioData(){
            let url = this.$api + '/transaksi-kedai';
            this.$http.get(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then(response => {
                this.list.datas = response.data.data;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
            });
        },

        deleteData(){
            this.loadingScreen = true;
            let id = this.deleteId;
            var url = this.$api + "/transaksi-kedai/" + id;
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
                path: '/transaksi-kedai/detail/' + item.uuid,
            });
        },

        editHandler(item) {
            this.$router.push({
                path: '/transaksi-kedai/ubah/' + item.uuid,
            });
        },

        formatRupiah(value, prefix){
            let number_string = value.toString();
			let split   		= number_string.split(',');
			let sisa     		= split[0].length % 3;
			let rupiah     		= split[0].substr(0, sisa);
			let ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);
 
			// tambahkan titik jika yang di input sudah menjadi angka ribuan
			if(ribuan){
				let separator = sisa ? '.' : '';
				rupiah += separator + ribuan.join('.');
			}
 
			rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
			return prefix == undefined ? rupiah : (rupiah ? 'Rp' + rupiah : '');
        },

        formatTanggal(value){
            return value.split("-").reverse().join("-");
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