<template>

    <v-main class="list">
        <h1 class="page-custom-title">DAFTAR LAPORAN</h1>
            <v-card class="underline document-printable-card mb-4" elevation="1">
                <v-card-text class="dialog-confirm-content">
                    <v-layout row wrap align-center class="align-center">
                        <v-flex md3 sm12 xs12>
                            <h3 style="text-align: left;" class="black--text">Laporan Pendapatan Transaksi Pencucian</h3>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex xs6 sm4 md2>
                            <v-dialog ref="dialogTransaksiPencucian1" v-model="modalMulaiTransaksiPencucian" :return-value.sync="dateMulaiTransaksiPencucian" persistent width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="dateMulaiTransaksiPencucianShow"
                                        label="Tanggal Mulai" hide-details
                                        prepend-icon="mdi-calendar-blank-outline"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="dateMulaiTransaksiPencucian" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="modalMulaiTransaksiPencucian = false">Batal</v-btn>
                                    <v-btn text color="primary" @click="$refs.dialogTransaksiPencucian1.save(dateMulaiTransaksiPencucian)">Simpan</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>
                        <v-flex xs6 sm4 md2>
                            <v-dialog ref="dialogTransaksiPencucian2" v-model="modalSelesaiTransaksiPencucian" :return-value.sync="dateSelesaiTransaksiPencucian" persistent width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="dateSelesaiTransaksiPencucianShow"
                                        label="Tanggal Selesai" hide-details
                                        prepend-icon="mdi-calendar-blank-outline"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="dateSelesaiTransaksiPencucian" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="modalSelesaiTransaksiPencucian = false">Batal</v-btn>
                                    <v-btn text color="primary" @click="$refs.dialogTransaksiPencucian2.save(dateSelesaiTransaksiPencucian)">Simpan</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>
                        <v-flex xs12 md2 sm4 class="text-xs-right">
                            <v-btn dense class="btn-confirm-delete" @click="konfirmasiHandler(`transaksi-pencucian?tglMulai=${dateMulaiTransaksiPencucian}&tglSelesai=${dateSelesaiTransaksiPencucian}`, 'Transaksi Pencucian')">Unduh</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>

            <v-card class="underline document-printable-card mb-4" elevation="1" >
                <v-card-text class="dialog-confirm-content">
                    <v-layout row wrap align-center class="align-center">
                        <v-flex md3 sm12 xs12>
                            <h3 style="text-align: left;" class="black--text">Laporan Pendapatan Transaksi Kedai</h3>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex xs6 sm4 md2>
                            <v-dialog ref="dialogTransaksiKedai1" v-model="modalMulaiTransaksiKedai" :return-value.sync="dateMulaiTransaksiKedai" persistent width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="dateMulaiTransaksiKedaiShow"
                                        label="Tanggal Mulai" hide-details
                                        prepend-icon="mdi-calendar-blank-outline"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="dateMulaiTransaksiKedai" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="modalMulaiTransaksiKedai = false">Batal</v-btn>
                                    <v-btn text color="primary" @click="$refs.dialogTransaksiKedai1.save(dateMulaiTransaksiKedai)">Simpan</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>
                        <v-flex xs6 sm4 md2>
                            <v-dialog ref="dialog" v-model="modalSelesaiTransaksiKedai" :return-value.sync="dateSelesaiTransaksiKedai" persistent width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="dateSelesaiTransaksiKedaiShow"
                                        label="Tanggal Selesai" hide-details
                                        prepend-icon="mdi-calendar-blank-outline"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="dateSelesaiTransaksiKedai" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="modalSelesaiTransaksiKedai = false">Batal</v-btn>
                                    <v-btn text color="primary" @click="$refs.dialog.save(dateSelesaiTransaksiKedai)">Simpan</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>
                        <v-flex xs12 md2 sm4 class="text-xs-right">
                            <v-btn dense class="btn-confirm-delete" @click="konfirmasiHandler(`transaksi-kedai?tglMulai=${dateMulaiTransaksiKedai}&tglSelesai=${dateSelesaiTransaksiKedai}`, 'Transaksi Kedai')">Unduh</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>

            <v-card class="underline document-printable-card mb-4" elevation="1" >
                <v-card-text class="dialog-confirm-content">
                    <v-layout row wrap align-center class="align-center">
                        <v-flex md3 sm12 xs12>
                            <h3 style="text-align: left;" class="black--text">Laporan Pengeluaran Kedai</h3>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex xs6 sm4 md2>
                            <v-dialog ref="dialogPengeluaranKedai1" v-model="modalMulaiPengeluaranKedai" :return-value.sync="dateMulaiPengeluaranKedai" persistent width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="dateMulaiPengeluaranKedaiShow"
                                        label="Tanggal Mulai" hide-details
                                        prepend-icon="mdi-calendar-blank-outline"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="dateMulaiPengeluaranKedai" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="modalMulaiPengeluaranKedai = false">Batal</v-btn>
                                    <v-btn text color="primary" @click="$refs.dialogPengeluaranKedai1.save(dateMulaiPengeluaranKedai)">Simpan</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>
                        <v-flex xs6 sm4 md2>
                            <v-dialog ref="dialogPengeluaranKedai2" v-model="modalSelesaiPengeluaranKedai" :return-value.sync="dateSelesaiPengeluaranKedai" persistent width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="dateSelesaiPengeluaranKedaiShow"
                                        label="Tanggal Selesai" hide-details
                                        prepend-icon="mdi-calendar-blank-outline"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="dateSelesaiPengeluaranKedai" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="modalSelesaiPengeluaranKedai = false">Batal</v-btn>
                                    <v-btn text color="primary" @click="$refs.dialogPengeluaranKedai2.save(dateSelesaiPengeluaranKedai)">Simpan</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>
                        <v-flex xs12 md2 sm4 class="text-xs-right">
                            <v-btn dense class="btn-confirm-delete" @click="konfirmasiHandler(`pengeluaran-kedai?tglMulai=${dateMulaiPengeluaranKedai}&tglSelesai=${dateSelesaiPengeluaranKedai}`, 'Pengeluaran Kedai')">Unduh</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>

            <v-dialog v-model="dialogKonfirmasi" persistent max-width="450px">
                <v-card>
                    <v-card-title class="dialog-confirm-title">
                        <span class="headline white--text">Unduh Laporan</span>
                    </v-card-title>
                    <v-card-text class="dialog-confirm-text">
                        <span>Proses ini membutuhkan waktu sedikit lebih lama, lanjutkan?</span>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn dense color="btn-confirm-cancel" @click="cancelExport()">Batal</v-btn>
                        <v-btn dense class="btn-confirm-delete" @click="exportLaporan()" :loading="loading">Unduh</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        <v-snackbar v-model="snackbar.snackbarNotif" :color="snackbar.color" timeout="3000" bottom>{{ snackbar.error_message }}</v-snackbar>
    </v-main>

</template>

<style>
    .document-printable-card {
        min-height: 100px !important;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .underline{
        padding: 5px 10px !important;
        border-radius: 2px !important;
        border-left: 1px solid lightgrey !important;
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
    name: 'laporan-list',
    data() {
        return {
            modalMulaiTransaksiPencucian: false,
            modalSelesaiTransaksiPencucian: false,
            modalMulaiTransaksiKedai: false,
            modalSelesaiTransaksiKedai: false,
            modalMulaiPengeluaranKedai: false,
            modalSelesaiPengeluaranKedai: false,
            dateMulaiTransaksiPencucian: new Date().toISOString().substr(0, 10),
            dateMulaiTransaksiPencucianShow: '',
            dateMulaiTransaksiKedai: new Date().toISOString().substr(0, 10),
            dateMulaiTransaksiKedaiShow: '',
            dateMulaiPengeluaranKedai: new Date().toISOString().substr(0, 10),
            dateMulaiPengeluaranKedaiShow: '',
            dateSelesaiTransaksiPencucian: new Date().toISOString().substr(0, 10),
            dateSelesaiTransaksiPencucianShow:'',
            dateSelesaiTransaksiKedai: new Date().toISOString().substr(0, 10),
            dateSelesaiTransaksiKedaiShow: '',
            dateSelesaiPengeluaranKedai: new Date().toISOString().substr(0, 10),
            dateSelesaiPengeluaranKedaiShow: '',
            path: '',
            documentName: '',
            dialogKonfirmasi: false,
            snackbar: {
                snackbarNotif: false,
                color: '',
                message: '',
            },
            loading: false,
        }
    },
    created(){
        this.initialize();
    },
    methods: {
        initialize(){
            this.dateMulaiTransaksiPencucianShow = this.formatTanggal(this.dateMulaiTransaksiPencucian);
            this.dateMulaiTransaksiKedaiShow = this.formatTanggal(this.dateMulaiTransaksiKedai);
            this.dateMulaiPengeluaranKedaiShow = this.formatTanggal(this.dateMulaiPengeluaranKedai);
            this.dateSelesaiTransaksiPencucianShow = this.formatTanggal(this.dateSelesaiTransaksiPencucian);
            this.dateSelesaiTransaksiKedaiShow = this.formatTanggal(this.dateSelesaiTransaksiKedai);
            this.dateSelesaiPengeluaranKedaiShow = this.formatTanggal(this.dateSelesaiPengeluaranKedai);
        },  

        exportLaporan(){
            this.loading = true;
            var url = this.$api + "/laporan/" + this.path;
            this.$http.get(url, {
                responseType: 'arraybuffer'
            }).then((response) => {
                this.loading = false;
                let blob = new Blob([response.data], { type: 'application/pdf' });
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'Laporan ' + this.documentName + '.pdf';
                link.click();
                this.dialogKonfirmasi = false;
            })
            .catch((error) => {
                this.loading = false;
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.dialogKonfirmasi = false;
            });
        },

        konfirmasiHandler(path, name){
            this.path = path;
            this.documentName = name;
            this.dialogKonfirmasi = true;
        },

        formatTanggal(value){
            return value.split("-").reverse().join("-");
        },

        cancelExport(){
            this.path = '';
            this.documentName = '';
            this.dialogKonfirmasi = false;
        }
    },
    mounted(){

    },
    computed:{

    },
    watch:{
        'dateMulaiTransaksiPencucian'(val){
            if(val){
                this.dateMulaiTransaksiPencucianShow = this.formatTanggal(val)
            }
        },
        'dateMulaiTransaksiKedai'(val){
            if(val){
                this.dateMulaiTransaksiKedaiShow = this.formatTanggal(val)
            }
        },
        'dateMulaiPengeluaranKedai'(val){
            if(val){
                this.dateMulaiPengeluaranKedaiShow = this.formatTanggal(val)
            }
        },
        'dateSelesaiTransaksiPencucian'(val){
            if(val){
                this.dateSelesaiTransaksiPencucianShow = this.formatTanggal(val)
            }
        },
        'dateSelesaiTransaksiKedai'(val){
            if(val){
                this.dateSelesaiTransaksiKedaiShow = this.formatTanggal(val)
            }
        },
        'dateSelesaiPengeluaranKedai'(val){
            if(val){
                this.dateSelesaiPengeluaranKedaiShow = this.formatTanggal(val)
            }
        },
    },
}
</script>