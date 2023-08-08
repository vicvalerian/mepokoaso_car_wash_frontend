<template>

    <v-main class="list">
        <loading-screen :value="loadingScreen"></loading-screen>
        <h1 class="page-custom-title">UBAH TRANSAKSI PENCUCIAN</h1>
        <v-card>
            <v-card-text class="dialog-confirm-content">
                <v-container fluid>
                    <v-layout justify-center>
                        <v-flex xs12>
                            <div>
                                <v-stepper v-model="e1">
                                    <v-stepper-header>
                                        <v-stepper-step :complete="e1 > 1" color="#316291" step="1">Ubah Data Kendaraan</v-stepper-step>
                                        <v-divider></v-divider>
                                        <v-stepper-step :complete="e1 > 2" color="#316291" step="2">Pilih Pencuci</v-stepper-step>
                                    </v-stepper-header>
                                    <v-stepper-content step="1">
                                        <v-card>
                                            <v-card-text>
                                                <v-layout justify>
                                                    <v-flex xs4>
                                                        <v-card class="mb-6" height="300">
                                                            <v-card-title class="justify-center">
                                                                <v-img contain height="250" :src="formMobil.foto != '' ? $baseUrl+'/storage/'+formMobil.foto : ''" style="object-fit:cover;"></v-img>
                                                            </v-card-title>
                                                        </v-card>
                                                    </v-flex>
                                                    <v-spacer></v-spacer>
                                                    <v-flex xs7>
                                                        <v-autocomplete outlined v-model="form.kendaraan_id" :items="kendaraan_list" label="Nama Kendaraan" item-text="nama" item-value="id"></v-autocomplete>
                                                        <v-text-field outlined v-model="form.tarif_kendaraan" label="Tarif Kendaraan" readonly></v-text-field>
                                                        <v-text-field outlined v-model="form.no_polisi" label="Nomor Polisi"></v-text-field>
                                                        <!-- <v-select outlined :items="jenis_kendaraan_list" v-model="form.jenis_kendaraan" label="Jenis Kendaraan" required readonly></v-select> -->
                                                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="form.tgl_pencucian" persistent width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field
                                                                    v-model="form.tgl_pencucian_show"
                                                                    label="Tanggal Pencucian" outlined
                                                                    prepend-inner-icon="mdi-calendar-blank-outline"
                                                                    readonly
                                                                    v-bind="attrs"
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker v-model="form.tgl_pencucian" scrollable>
                                                                <v-spacer></v-spacer>
                                                                <v-btn text color="primary" @click="modal = false">Batal</v-btn>
                                                                <v-btn text color="primary" @click="$refs.dialog.save(form.tgl_pencucian)">Simpan</v-btn>
                                                            </v-date-picker>
                                                        </v-dialog>
                                                        <v-dialog ref="dialog2" v-model="modal2" :return-value.sync="form.waktu_pencucian" persistent width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field
                                                                    v-model="form.waktu_pencucian"
                                                                    label="Waktu Pencucian" outlined
                                                                    prepend-inner-icon="mdi-clock-time-four-outline"
                                                                    readonly
                                                                    v-bind="attrs"
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-time-picker v-if="modal2" v-model="form.waktu_pencucian" format="24hr" full-width use-seconds>
                                                                <v-spacer></v-spacer>
                                                                <v-btn text color="primary" @click="modal2 = false">Batal</v-btn>
                                                                <v-btn text color="primary" @click="$refs.dialog2.save(form.waktu_pencucian)">Simpan</v-btn>
                                                            </v-time-picker>
                                                        </v-dialog>
                                                    </v-flex>
                                                </v-layout>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn dense color="btn-confirm-cancel" @click="goToListTransaksiPencucian()">Batal</v-btn>
                                                <v-btn dense class="btn-confirm-delete" @click="e1 = 2">Berikutnya</v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-stepper-content>
                                    <v-stepper-content step="2">
                                        <v-card>
                                            <v-card-title>
                                                <v-spacer></v-spacer>
                                                <v-spacer></v-spacer>
                                                <v-spacer></v-spacer>
                                                <v-text-field v-model="list.search" append-icon="mdi-magnify" label="Cari Pencuci" single-line hide-details></v-text-field>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-data-table v-model="list.selectedPencuci" :headers="list.headers" :items="list.datas" :search="list.search" class="elevation-1" show-select
                                                    :footer-props="{
                                                        showFirstLastPage: true,
                                                        firstIcon: 'mdi-skip-previous',
                                                        lastIcon: 'mdi-skip-next',
                                                        itemsPerPageAllText: 'Semua',
                                                        itemsPerPageText: 'Data per halaman',
                                                    }"
                                                >
                                                    <template v-slot:[`footer.page-text`]="items"> 
                                                        {{ items.pageStart }} - {{ items.pageStop }} dari {{ items.itemsLength }}
                                                    </template>
                                                    <template v-slot:no-data>
                                                        <div color="white" class="red--text" icon="warning"><b>Maaf, tidak ada data tersedia.</b></div>
                                                    </template>
                                                </v-data-table>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn dense color="btn-confirm-cancel" @click="e1 = 1">Sebelumnya</v-btn>
                                                <v-btn dense class="btn-confirm-delete" @click="updateData()">Simpan Data</v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-stepper-content>
                                </v-stepper>
                            </div>     
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
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
import LoadingScreen from '@/components/loading-screen.vue';

export default {
    components: {
        'loading-screen': LoadingScreen,
    },
    name: 'transaksi-pencucian-edit',
    data() {
        return {
            loadingScreen: true,
            e1: 1,
            userLogin: JSON.parse(localStorage.getItem('userLogin')),
            previewImgMobil: '',
            id: this.$route.params.id,
            pencucianCart: JSON.parse(localStorage.getItem('pencucianCart')),
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
                // no_pencucian: '',
                kendaraan_id: '',
                nama_kendaraan: '',
                tarif_kendaraan: '',
                no_polisi: '',
                jenis_kendaraan: '',
                tgl_pencucian: new Date().toISOString().substr(0, 10),
                tgl_pencucian_show: '',
                waktu_pencucian: '',
                status: 'Baru',
                detail_transaksi_pencuci: [],
                kendaraan_uuid: '',
            },
            formMobil: {
                foto: '',
                nama: '',
                harga: '',
            },
            list: {
                search: '',
                headers: [],
                datas: [],
                selectedPencuci: [],
            }
        }
    },
    created(){
        this.initialize();
    },
    methods: {
        onPreviewImage(e) {
            this.previewImgMobil = URL.createObjectURL(e)
        },

        initialize(){
            this.list.headers = [
                { text: "Nama Pencuci", value: "nama"},
            ];

            this.axioData();
            this.axioKaryawanKasir();
            this.axioKaryawanPencuci();
            this.axioKendaraan();
            setTimeout(() =>{
                this.loadingScreen = false;
            }, 300);
        },

        axioData(){
            let url = this.$api + '/transaksi-pencucian/' + this.id;
            this.$http.get(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then(response => {
                this.form = response.data.data;
                this.form.tgl_pencucian_show = this.formatTanggal(response.data.data.tgl_pencucian);
                this.list.selectedPencuci = response.data.data.karyawan_pencucis;

                this.formMobil.foto = response.data.data.kendaraan.foto;
                this.form.tarif_kendaraan = response.data.data.kendaraan.harga;
                this.form.jenis_kendaraan = response.data.data.kendaraan.tipe;
                this.form.kendaraan_uuid = response.data.data.kendaraan.uuid;
            });
        },

        axioKaryawanKasir(){
            let url = this.$api + '/list-selection-kasir';
            this.$http.get(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then(response => {
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

        readKendaraan(){
            let url = this.$api + '/kendaraan/' + this.form.kendaraan_uuid;
            this.$http.get(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then(response => {
                this.formMobil.foto = response.data.data.foto;
                this.form.tarif_kendaraan = response.data.data.harga;
                this.form.jenis_kendaraan = response.data.data.tipe;
            });
        },

        axioKendaraan(){
            let url = this.$api + '/list-selection-kendaraan';
            this.$http.get(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then(response => {
                if(response.status == 200){
                    let data = JSON.parse(JSON.stringify(response.data));
                    data.forEach((item)=>{
                        let dashboard = item;
                        dashboard.uuid = item.uuid
                        dashboard.text = item.nama
                        dashboard.value = item.id
                        this.kendaraan_list.push(dashboard);
                    });
                }
            });
        },

        axioKaryawanPencuci(){
            let url = this.$api + '/list-selection-pencuci';
            this.$http.get(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then(response => {
                this.list.datas = response.data;
            });
        },

        updateData(){
            this.form.detail_transaksi_pencuci = [];
            this.list.selectedPencuci.forEach((x)=>{
                let d = JSON.parse(JSON.stringify(x));
                d.karyawan_id = x.id;
                this.form.detail_transaksi_pencuci.push(d);
            });

            let data = {
                'kendaraan_id': this.form.kendaraan_id,
                'no_polisi': this.form.no_polisi,
                'jenis_kendaraan': this.form.jenis_kendaraan,
                'tarif_kendaraan': this.form.tarif_kendaraan,
                'tgl_pencucian': this.form.tgl_pencucian,
                'waktu_pencucian': this.form.waktu_pencucian,
                'status': this.form.status,
                'detail_transaksi_pencuci': this.form.detail_transaksi_pencuci,
            }
            
            this.loadingScreen = true;
            var url = this.$api + '/transaksi-pencucian/' + this.id;
            this.$http.post(url, data, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
                setTimeout(() =>{
                    this.goToListTransaksiPencucian();    
                }, 500);
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
            });
        },

        goToListTransaksiPencucian(){
            this.$router.push({
                name: 'Transaksi Pencucian',
            });
        },

        formatTanggal(value){
            return value.split("-").reverse().join("-");
        },
    },
    mounted(){

    },
    watch: {
        'form.tgl_pencucian'(val){
            if(val){
                this.form.tgl_pencucian_show = this.formatTanggal(val)
            }
        },

        'form.kendaraan_id'(val){
            this.kendaraan_list.forEach((item)=>{
                if(item.id == val){
                    this.form.kendaraan_uuid = item.uuid
                }
            });
            this.readKendaraan();
        }
    },
    computed:{

    },
}
</script>