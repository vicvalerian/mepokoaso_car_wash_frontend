<template>

    <v-main class="list">
        <loading-screen :value="loadingScreen"></loading-screen>
        <h1 class="page-custom-title">DATA TRANSAKSI PENCUCIAN</h1>
        <v-card>
            <v-tabs v-model="tab" background-color="transparent" color="#316291">
                <v-tab v-for="status in stasuses" :key="status">
                    <b>{{ status }}</b>
                </v-tab>
            </v-tabs>

            <v-card-title>
                <v-flex xs3>
                    <v-text-field v-model="list.search" append-icon="mdi-magnify" label="Cari transaksi pencucian" single-line hide-details></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-btn dense class="btn-add-data" @click="goToAdd()">Tambah Data</v-btn>
            </v-card-title>

            <v-tabs-items v-model="tab">
                <v-tab-item v-for="status in stasuses" :key="status">
                    <v-data-table :headers="list.headers" :items="list.datas" :search="list.search" class="elevation-1">
                        <template v-slot:[`item.nomor`]="{ item }">
                            <template>{{ list.datas.indexOf(item) + 1 }}</template>
                        </template>
                        <template v-slot:[`item.tgl_pencucian`]="{ item }">
                            <template>{{ formatTanggal(item.tgl_pencucian) }}</template>
                        </template>
                        <template v-slot:[`item.is_free`]="{ item }">
                            <template v-if="item.is_free == true">Ya</template>
                            <template v-else>Tidak</template>
                        </template>
                        <template v-slot:[`item.total_pembayaran`]="{ item }">
                            <template>{{ formatRupiah(item.total_pembayaran, 'Rp') }}</template>
                        </template>
                        <template v-slot:[`item.karyawan_pencucis`]="{ item }">
                            <template>{{ getVarName(item.karyawan_pencucis) }}</template>
                        </template>
                        <template v-slot:[`item.status`]="{ item }">
                            <v-chip v-if="item.status == 'Baru'" class="light-blue-chip" label>{{ item.status }}</v-chip>
                            <v-chip v-if="item.status == 'Proses Cuci'" class="blue-chip" label>{{ item.status }}</v-chip>
                            <v-chip v-if="item.status == 'Proses Bayar'" class="orange-chip" label>{{ item.status }}</v-chip>
                            <v-chip v-if="item.status == 'Selesai'"  class="green-chip" label>{{ item.status }}</v-chip>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon dense color="#316291" @click="detailHandler(item)" class="data-table-icon">mdi-information</v-icon>
                            <v-icon v-if="item.status == 'Baru'" dense color="#316291" @click="editHandler(item)" class="data-table-icon">mdi-pencil</v-icon>
                            <v-icon v-if="item.status == 'Baru'" dense color="#316291" @click="ubahStatusHandler(item.uuid, 'cuci')" class="data-table-icon">mdi-water</v-icon>
                            <v-icon v-if="item.status == 'Proses Cuci'" dense color="#316291" @click="ubahStatusHandler(item.uuid, 'bayar')" class="data-table-icon">mdi-cash</v-icon>
                            <v-icon v-if="item.status == 'Proses Bayar'" dense color="#316291" @click="ubahStatusHandler(item.uuid, 'finish')" class="data-table-icon">mdi-check</v-icon>
                            <v-icon v-if="item.status == 'Selesai'" dense color="#316291" @click="cetakNotaHandler(item)" class="data-table-icon">mdi-download</v-icon>
                            <v-icon v-if="item.status == 'Baru'" dense color="#316291" @click="deleteHandler(item.uuid)" class="data-table-icon">mdi-delete</v-icon>
                        </template>
                        <template v-slot:no-data>
                        <div color="white" class="red--text" icon="warning"><b>Maaf, tidak ada data tersedia.</b></div>
                        </template>
                    </v-data-table>
                </v-tab-item>
            </v-tabs-items>
        </v-card>

        <v-dialog v-model="dialogConfirmDelete" persistent max-width="450px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">Hapus Data Transaksi Pencucian</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <span >Apakah anda yakin ingin menghapus data transaksi pencucian ini?</span>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="dialogConfirmDelete = false">Batal</v-btn>
                    <v-btn dense class="btn-confirm-delete" @click="deleteData()">Hapus</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirmUbahStatus" persistent max-width="450px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">Ubah Status Transaksi Pencucian</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <span >Apakah anda yakin ingin mengubah status transaksi pencucian ini?</span>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="cancelUbahStatus()">Batal</v-btn>
                    <v-btn dense class="btn-confirm-delete" @click="updateStatusProses()">Ubah</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirmCetakNota" persistent max-width="450px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">Cetak Nota Transaksi Pencucian</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <span >Apakah anda yakin ingin mencetak nota transaksi pencucian ini?</span>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="cancelCetakNota()">Batal</v-btn>
                    <v-btn dense class="btn-confirm-delete" @click="cetakNota()">Cetak</v-btn>
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
    name: 'transaksi-pencucian-list',
    data() {
        return {
            userLogin: JSON.parse(localStorage.getItem('userLogin')),
            loadingScreen: true,
            tab: null,
            stasuses: ['Semua', 'Baru', 'Proses Cuci', 'Proses Bayar', 'Selesai'],
            selected_status: '',
            dialogConfirmDelete: false,
            dialogConfirmUbahStatus: false,
            dialogConfirmCetakNota: false,
            editId: '',
            deleteId: '',
            statusId: '',
            notaId: '',
            notaPencucianNumber: '',
            selectedProses: '',
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
                // { text: "Nomor Transaksi Pencucian", value: "no_pencucian"},
                { text: "Kendaraan", value: "kendaraan.nama"},
                { text: "Nomor Polisi", value: "no_polisi"},
                { text: "Tanggal", value: "tgl_pencucian"},
                { text: "Total Pembayaran", value: "total_pembayaran"},
                { text: "Gratis", value: "is_free"},
                { text: "Pencuci", value: "karyawan_pencucis"},
                { text: "Status", value: "status", width: '10%'},
                { text: "Aksi", value: "actions", sortable: false},
            ];

            this.axioData(this.selected_status);
        },

        axioData(status) {
            let tabStatus = status;
            if(tabStatus == 'Semua'){
                tabStatus = ''
            }

            let url = this.$api + '/transaksi-pencucian?status=' + tabStatus;
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
            var url = this.$api + "/transaksi-pencucian/" + id;
            this.$http.delete(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogConfirmDelete = false
                this.axioData(this.selected_status);
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

        updateStatusProses(){
            let data = {
                "id": this.statusId,
            }
            this.loadingScreen = true;
            var url = this.$api + "/transaksi-pencucian/" + this.selectedProses;
            this.$http.put(url, data, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogConfirmUbahStatus = false;
                this.axioData(this.selected_status);
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                this.dialogConfirmUbahStatus = false;
            });
        },

        cetakNota(){
            var url = this.$api + "/transaksi-pencucian/nota/" + this.notaId;
            this.$http.get(url, {
                headers: {'Authorization' : 'Bearer ' + this.userLogin.token},
                responseType: 'arraybuffer'
            }).then((response) => {
                let blob = new Blob([response.data], { type: 'application/pdf' });
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'Nota Pencucian ' + this.notaPencucianNumber + '.pdf';
                link.click();
                this.dialogConfirmCetakNota = false;
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.dialogConfirmCetakNota = false;
            });
        },

        deleteHandler(item) {
            this.deleteId = item
            this.dialogConfirmDelete = true
        },

        goToAdd(){
            this.$router.push({
                name: 'Pilih Kendaraan Transaksi Pencucian',
            });
        },

        detailHandler(item){
            this.$router.push({
                path: '/transaksi-pencucian/detail/' + item.uuid,
            });
        },

        editHandler(item) {
            this.$router.push({
                path: '/transaksi-pencucian/ubah/' + item.uuid,
            });
        },

        getVarName(items){
            return items.map((item) => item.nama).toString();
        },

        ubahStatusHandler(item, status){
            this.statusId = item;
            
            switch(status){
                case 'cuci':{
                    this.selectedProses = 'cuci';
                    break;
                }
                case 'bayar':{
                    this.selectedProses = 'bayar';
                    break;
                }
                case 'finish':{
                    this.selectedProses = 'finish'
                    break;
                }
                default:
                    break;
            }
            this.dialogConfirmUbahStatus = true;
        },

        cancelUbahStatus(){
            this.statusId = '';
            this.selectedProses = '';
            this.dialogConfirmUbahStatus = false;
        },

        cetakNotaHandler(item){
            this.notaId = item.uuid;
            // this.notaPencucianNumber = item.no_pencucian;
            this.notaPencucianNumber = item.kendaraan.nama + ' ' + item.no_polisi;
            this.dialogConfirmCetakNota = true;
        },

        cancelCetakNota(){
            this.notaId = '';
            this.notaPencucianNumber = '';
            this.dialogConfirmCetakNota = false;
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
        'tab'(val){
            this.selected_status = this.stasuses[val]

            this.loadingScreen = true;
            this.axioData(this.selected_status)
        }
    },
    computed:{

    },
}
</script>