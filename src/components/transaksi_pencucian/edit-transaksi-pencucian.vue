<template>

    <v-main class="list">
        <h1 class="page-custom-title">UBAH TRANSAKSI PENCUCIAN</h1>
        <v-card>
            <v-card-text class="dialog-confirm-content">
                <v-container fluid>
                    <v-layout justify-center>
                        <v-flex xs12>
                            <div>
                                <v-layout justify>
                                    <v-flex xs12>
                                        <v-text-field v-model="form.no_pencucian" label="Nomor Pencucian" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs5>
                                        <v-autocomplete v-model="form.kendaraan_id" :items="kendaraan_list" label="Nama Kendaraan" item-text="nama" item-value="id"></v-autocomplete>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs6>
                                        <v-text-field v-model="form.tarif_kendaraan" label="Tarif Kendaraan" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs5>
                                        <v-text-field v-model="form.no_polisi" label="Nomor Polisi"></v-text-field>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs6>
                                        <v-select :items="jenis_kendaraan_list" v-model="form.jenis_kendaraan" label="Jenis Kendaraan" required></v-select>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs5>
                                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="form.tgl_pencucian" persistent width="290px">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                    v-model="form.tgl_pencucian"
                                                    label="Tanggal Pencucian"
                                                    prepend-icon="mdi-calendar-blank-outline"
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
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs6>
                                        <v-dialog ref="dialog2" v-model="modal2" :return-value.sync="form.waktu_pencucian" persistent width="290px">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                    v-model="form.waktu_pencucian"
                                                    label="Waktu Pencucian"
                                                    prepend-icon="mdi-clock-time-four-outline"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker v-if="modal2" v-model="form.waktu_pencucian" format="24hr" full-width>
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="modal2 = false">Batal</v-btn>
                                                <v-btn text color="primary" @click="$refs.dialog2.save(form.waktu_pencucian)">Simpan</v-btn>
                                            </v-time-picker>
                                        </v-dialog>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs5>
                                        <v-select :items="kasir_list" v-model="form.karyawan_id" label="Nama Karyawan" item-value="id" item-text="nama" required></v-select>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs6>
                                        <v-text-field v-model="form.status" label="Status" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>

                                <h2 class="page-custom-title">DAFTAR PENCUCI</h2>
                                <v-data-table v-model="list.selectedPencuci" :headers="list.headers" :items="list.datas" class="elevation-1" hide-default-footer show-select>
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
                <v-btn dense color="btn-confirm-cancel" @click="goToListTransaksiPencucian()">Batal</v-btn>
                <v-btn dense class="btn-confirm-delete" @click="updateData()">Simpan</v-btn>
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
    name: 'transaksi-pencucian-edit',
    data() {
        return {
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
                no_pencucian: '',
                kendaraan_id: '',
                nama_kendaraan: '',
                tarif_kendaraan: '',
                no_polisi: '',
                jenis_kendaraan: '',
                tgl_pencucian: new Date().toISOString().substr(0, 10),
                waktu_pencucian: '',
                karyawan_id: '',
                status: 'Baru',
                detail_transaksi_pencuci: [],
            },
            list: {
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
        initialize(){
            this.list.headers = [
                { text: "Nama Pencuci", value: "nama"},
            ];

            this.axioData();
            this.axioKaryawanKasir();
            this.axioKaryawanPencuci();
            this.axioKendaraan();
        },

        axioData(){
            let url = this.$api + '/transaksi-pencucian/' + this.id;
            this.$http.get(url).then(response => {
                this.form = response.data.data;
                this.list.datas = response.data.data.karyawan_pencucis;
                this.list.selectedPencuci = response.data.data.karyawan_pencucis;
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

        axioKaryawanPencuci(){
            let url = this.$api + '/list-selection-pencuci';
            this.$http.get(url).then(response => {
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
                'karyawan_id': this.form.karyawan_id,
                'no_pencucian': this.form.no_pencucian,
                'no_polisi': this.form.no_polisi,
                'jenis_kendaraan': this.form.jenis_kendaraan,
                'tarif_kendaraan': this.form.tarif_kendaraan,
                'tgl_pencucian': this.form.tgl_pencucian,
                'waktu_pencucian': this.form.waktu_pencucian,
                'status': this.form.status,
                'detail_transaksi_pencuci': this.form.detail_transaksi_pencuci,
            }
            
            var url = this.$api + '/transaksi-pencucian/' + this.id;
            this.$http.post(url, data).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                setTimeout(() =>{
                    this.goToListTransaksiPencucian();    
                }, 500);
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
            });
        },

        goToListTransaksiPencucian(){
            this.$router.push({
                name: 'Transaksi Pencucian',
            });
        },
    },
    mounted(){

    },
    watch: {
        'form.kendaraan_id'(val){
            this.kendaraan_list.forEach((item)=>{
                if(item.id == val){
                    this.form.tarif_kendaraan = item.harga
                }
            });
        }
    },
    computed:{

    },
}
</script>