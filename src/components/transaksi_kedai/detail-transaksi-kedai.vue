<template>

    <v-main class="list">
        <h1 class="page-custom-title">DETAIL TRANSAKSI KEDAI</h1>
        <v-card>
            <v-card-text class="dialog-confirm-content">
                <v-container fluid>
                    <v-layout justify-center>
                        <v-flex xs12>
                            <div>
                                <v-layout justify>
                                    <v-flex xs12>
                                        <v-text-field v-model="form.no_penjualan" label="Nomor Transaksi Penjualan" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs12>
                                        <v-text-field v-model="form.total_penjualan" label="Total Penjualan" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs5>
                                        <v-text-field v-model="form.tgl_penjualan" label="Tanggal Penjualan" prepend-icon="mdi-calendar-blank-outline" readonly></v-text-field>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs6>
                                        <v-text-field v-model="form.waktu_penjualan" label="Waktu Penjualan" prepend-icon="mdi-clock-time-four-outline" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs12>
                                        <v-select :items="penjaga_kedai_list" v-model="form.karyawan_id" label="Pilih Karyawan" required readonly></v-select>
                                    </v-flex>
                                </v-layout>

                                <h2 class="page-custom-title">DAFTAR MENU</h2>
                                <v-data-table :headers="list.headers" :items="list.datas" class="elevation-1" hide-default-footer>
                                    <template v-slot:[`item.pivot.sub_total`]="{ item }">
                                        <template>{{ formatRupiah(item.pivot.sub_total, 'Rp') }}</template>
                                    </template>
                                    <template v-slot:no-data>
                                        <div color="white" class="red--text" icon="warning"><b>Maaf, tidak ada data tersedia.</b></div>
                                    </template>
                                </v-data-table>
                            </div>     
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dense color="btn-confirm-cancel" @click="goToListTransaksiKedai()">Tutup</v-btn>
            </v-card-actions>
        </v-card>

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
    name: 'transaksi-kedai-detail',
    data() {
        return {
            id: this.$route.params.id,
            selected: [],
            modal: false,
            modal2: false,
            penjaga_kedai_list: [],
            snackbar: {
                snackbarNotif: false,
                color: '',
                message: '',
            },
            form: {
                no_penjualan: '',
                karyawan_id: '',
                total_penjualan: '',
                tgl_penjualan: '',
                waktu_penjualan: '',
                detail_transaksi_kedai: [],
            },
            list: {
                headers: [],
                datas: [],
            }
        }
    },
    created(){
        this.initialize();
    },
    methods: {
        initialize(){
            this.list.headers = [
                { text: "Nama Menu", value: "nama"},
                { text: "Kuantitas", value: "pivot.kuantitas"},
                { text: "Subtotal", value: "pivot.sub_total"},
            ];

            this.axioData();
            this.axioKaryawanPenjagaKedai();
        },

        axioData(){
            let url = this.$api + '/transaksi-kedai/' + this.id;
            this.$http.get(url).then(response => {
                this.form = response.data.data;
                this.form.total_penjualan = this.formatRupiah(response.data.data.total_penjualan, 'Rp');
                this.list.datas = response.data.data.menu_kedai;
            });
        },

        axioKaryawanPenjagaKedai(){
            let url = this.$api + '/list-selection-penjaga-kedai';
            this.$http.get(url).then(response => {
                if(response.status == 200){
                    let data = JSON.parse(JSON.stringify(response.data));
                    data.forEach((item)=>{
                        let dashboard = item;
                        dashboard.text = item.nama
                        dashboard.nama = item.nama
                        dashboard.value = item.id
                        this.penjaga_kedai_list.push(dashboard);
                    });
                }
            });
        },

        goToListTransaksiKedai(){
            this.$router.push({
                name: 'Transaksi Kedai',
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
    },
    mounted(){

    },
    watch: {

    },
    computed:{

    },
}
</script>