<template>

    <v-main class="list">
        <h1 class="page-custom-title">DETAIL TRANSAKSI PENCUCIAN</h1>
        <v-card>
            <v-card-text class="dialog-confirm-content">
                <v-container fluid>
                    <v-layout justify-center>
                        <v-flex xs12>
                            <div>
                                <v-layout justify>
                                    <v-flex xs12>
                                        <v-text-field v-model="form.no_pencucian" label="Nomor Transaksi Pencucian" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs5>
                                        <v-autocomplete v-model="form.kendaraan_id" :items="kendaraan_list" label="Nama Kendaraan" item-text="nama" item-value="id" readonly></v-autocomplete>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs6>
                                        <v-text-field v-model="form.tarif_kendaraan" label="Tarif Kendaraan" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs5>
                                        <v-text-field v-model="form.no_polisi" label="Nomor Polisi" readonly></v-text-field>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs6>
                                        <v-select :items="jenis_kendaraan_list" v-model="form.jenis_kendaraan" label="Jenis Kendaraan" readonly></v-select>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs5>
                                            <v-text-field v-model="form.tgl_pencucian" label="Tanggal Pencucian" prepend-icon="mdi-calendar-blank-outline" readonly></v-text-field>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs6>
                                        <v-text-field v-model="form.waktu_pencucian" label="Waktu Pencucian" prepend-icon="mdi-clock-time-four-outline" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs5>
                                        <v-select :items="kasir_list" v-model="form.karyawan_id" label="Kasir" item-value="id" item-text="nama" required readonly></v-select>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs6>
                                        <v-text-field v-model="form.status" label="Status" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs5>
                                        <v-text-field v-model="form.is_free" label="Gratis" readonly></v-text-field>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs6>
                                        <v-text-field v-model="form.total_pembayaran" label="Total Pembayaran" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs12>
                                        <v-text-field v-model="form.keuntungan" label="Keuntungan" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>

                                <h2 class="page-custom-title">DAFTAR PENCUCI</h2>
                                <v-data-table :headers="list.headers" :items="list.datas" class="elevation-1" hide-default-footer>
                                    <template v-slot:[`item.pivot.upah_pencuci`]="{ item }">
                                        <template>{{ formatRupiah(item.pivot.upah_pencuci, 'Rp') }}</template>
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
                <v-btn dense color="btn-confirm-cancel" @click="goToListTransaksiPencucian()">Tutup</v-btn>
            </v-card-actions>
        </v-card>

        <v-snackbar v-model="snackbar.snackbarNotif" :color="snackbar.color" timeout="3000" bottom>{{ snackbar.error_message }}</v-snackbar>
    </v-main>

</template>

<style scoped>
    .v-data-table-header th {
        text-transform: uppercase;
        font-size: 14px !important;
        font-weight: bold !important;
        color: black !important;
    }

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
    name: 'transaksi-pencucian-detail',
    data() {
        return {
            id: this.$route.params.id,
            singleSelect: false,
            selected: [],
            modal: false,
            modal2: false,
            kasir_list: [],
            kendaraan_list: [],
            jenis_kendaraan_list: ['Mobil', 'Motor'],
            snackbar: {
                snackbarNotif: false,
                color: '',
                message: '',
            },
            form: {
                no_pencucian: '',
                kendaraan_id: '',
                nama_kendaraan: '',
                tarif_kendaraan: '',
                no_polisi: '',
                jenis_kendaraan: '',
                tgl_pencucian: '',
                waktu_pencucian: '',
                karyawan_id: '',
                status: '',
                is_free: '',
                keuntungan: '',
                total_pembayaran: '',
                karyawan_pencucis: [],
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
                { text: "Nama Pencuci", value: "nama"},
                { text: "Upah Pencuci", value: "pivot.upah_pencuci"},
            ];

            this.axioData();
            this.axioKaryawanKasir();
            this.axioKendaraan();
        },

        axioData(){
            let url = this.$api + '/transaksi-pencucian/' + this.id;
            this.$http.get(url).then(response => {
                this.form = response.data.data;
                this.form.keuntungan = this.formatRupiah(response.data.data.keuntungan, 'Rp');
                this.form.tarif_kendaraan = this.formatRupiah(response.data.data.tarif_kendaraan, 'Rp');
                this.form.total_pembayaran = this.formatRupiah(response.data.data.total_pembayaran, 'Rp');
                this.form.is_free = response.data.data.is_free ? 'Ya' : 'Tidak';
                this.list.datas = response.data.data.karyawan_pencucis;
            });
        },

        axioKaryawanKasir(){
            let url = this.$api + '/list-selection-kasir';
            this.$http.get(url).then(response => {
                if(response.status == 200){
                    let data = JSON.parse(JSON.stringify(response.data));
                    data.forEach((item)=>{
                        let dashboard = item;
                        dashboard.text = item.nama
                        dashboard.value = item.id
                        this.kasir_list.push(dashboard);
                    });
                }
            });
        },

        axioKendaraan(){
            let url = this.$api + '/list-selection-kendaraan';
            this.$http.get(url).then(response => {
                if(response.status == 200){
                    let data = JSON.parse(JSON.stringify(response.data));
                    data.forEach((item)=>{
                        let dashboard = item;
                        dashboard.text = item.nama
                        dashboard.value = item.id
                        this.kendaraan_list.push(dashboard);
                    });
                }
            });
        },

        goToListTransaksiPencucian(){
            this.$router.push({
                name: 'Transaksi Pencucian',
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