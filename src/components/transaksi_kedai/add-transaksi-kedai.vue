<template>

    <v-main class="list">
        <h1 class="page-custom-title">TAMBAH TRANSAKSI KEDAI</h1>
        <v-card>
            <v-card-text class="dialog-confirm-content">
                <v-container fluid>
                    <v-layout justify-center>
                        <v-flex xs12>
                            <div>
                                <v-layout justify>
                                    <v-flex xs11>
                                        <v-text-field v-model="form.no_penjualan" label="Nomor Penjualan" readonly></v-text-field>
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-btn dense class="btn-confirm-delete" @click="getNoPenjualan()">Hasilkan</v-btn>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs12>
                                        <v-text-field v-model="form.total_penjualan" label="Total Penjualan" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs5>
                                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="form.tgl_penjualan" persistent width="290px">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                    v-model="form.tgl_penjualan"
                                                    label="Tanggal Penjualan"
                                                    prepend-icon="mdi-calendar-blank-outline"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="form.tgl_penjualan" scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="modal = false">Batal</v-btn>
                                                <v-btn text color="primary" @click="$refs.dialog.save(form.tgl_penjualan)">Simpan</v-btn>
                                            </v-date-picker>
                                        </v-dialog>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs6>
                                        <v-dialog ref="dialog2" v-model="modal2" :return-value.sync="form.waktu_penjualan" persistent width="290px">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                    v-model="form.waktu_penjualan"
                                                    label="Waktu Penjualan"
                                                    prepend-icon="mdi-clock-time-four-outline"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker v-if="modal2" v-model="form.waktu_penjualan" format="24hr" full-width>
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="modal2 = false">Batal</v-btn>
                                                <v-btn text color="primary" @click="$refs.dialog2.save(form.waktu_penjualan)">Simpan</v-btn>
                                            </v-time-picker>
                                        </v-dialog>
                                    </v-flex>
                                </v-layout>
                                <v-layout justify>
                                    <v-flex xs12>
                                        <v-select :items="penjaga_kedai_list" v-model="form.karyawan_id" label="Pilih Karyawan" required></v-select>
                                    </v-flex>
                                </v-layout>

                                <h2 class="page-custom-title">DAFTAR MENU</h2>
                                <v-layout justify-end>
                                    <v-flex xs2 class="mb-4">
                                        <v-btn dense class="btn-confirm-delete" @click="dialogMenuKedai = true">Ubah Menu</v-btn>
                                    </v-flex>
                                </v-layout>
                                <v-data-table :headers="list.headers" :items="list.datas" class="elevation-1" hide-default-footer>
                                    <template v-slot:[`item.kuantitas`]="{ item }">
                                        <v-text-field type="number" min="1" v-model="item.kuantitas" @change="calculateQty(item)"></v-text-field>
                                    </template>
                                    <template v-slot:[`item.sub_total`]="{ item }">
                                        <v-text-field v-model="item.sub_total" readonly></v-text-field>
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
                <v-btn dense color="btn-confirm-cancel" @click="goToListTransaksiKedai()">Batal</v-btn>
                <v-btn dense class="btn-confirm-delete" @click="saveData()">Simpan</v-btn>
            </v-card-actions>
        </v-card>

        <v-dialog v-model="dialogMenuKedai" persistent max-width="800px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">Pilih Menu Kedai</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <v-autocomplete v-model="form.detail_transaksi_kedai" chips deletable-chips multiple :items="menu_kedai_list" label="Pilih Menu Kedai"></v-autocomplete>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="dialogMenuKedai = false">Batal</v-btn>
                    <v-btn dense class="btn-confirm-delete" @click="insertToTableMenu()">Simpan</v-btn>
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
    name: 'transaksi-kedai-add',
    data() {
        return {
            modal: false,
            modal2: false,
            penjaga_kedai_list: [],
            menu_kedai_list: [],
            dialogMenuKedai: false,
            snackbar: {
                snackbarNotif: false,
                color: '',
                message: '',
            },
            form: {
                no_penjualan: '',
                karyawan_id: '',
                total_penjualan: '',
                tgl_penjualan: new Date().toISOString().substr(0, 10),
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
                { text: "Kuantitas", value: "kuantitas"},
                { text: "Subtotal", value: "sub_total"},
            ];

            this.axioKaryawanPenjagaKedai();
            this.axioMenuKedai();
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

        axioMenuKedai(){
            let url = this.$api + '/list-selection-menu-kedai';
            this.$http.get(url).then(response => {
                if(response.status == 200){
                    let data = JSON.parse(JSON.stringify(response.data));
                    data.forEach((item)=>{
                        let dashboard = item;
                        dashboard.text = item.nama
                        dashboard.value = item.id
                        this.menu_kedai_list.push(dashboard);
                    });
                }
            });
        },

        saveData(){
            let data = {
                'karyawan_id': this.form.karyawan_id,
                'no_penjualan': this.form.no_penjualan,
                'tgl_penjualan': this.form.tgl_penjualan,
                'waktu_penjualan': this.form.waktu_penjualan,
                'total_penjualan': this.form.total_penjualan,
                'detail_transaksi_kedai': this.list.datas,
            }
            
            var url = this.$api + '/transaksi-kedai';
            this.$http.post(url, data).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                setTimeout(() =>{
                    this.goToListTransaksiKedai();    
                }, 500);
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                // this.goToListTransaksiKedai();
            });
        },

        getNoPenjualan(){
            let url = this.$api + '/generate-nomor-kedai';
            this.$http.get(url).then(response => {
                this.form.no_penjualan = response.data;
            });
        },

        goToListTransaksiKedai(){
            this.$router.push({
                name: 'Transaksi Kedai',
            });
        },

        insertToTableMenu(){
            this.list.datas = [];
            this.menu_kedai_list.forEach((x)=>{
                this.form.detail_transaksi_kedai.forEach((y)=>{
                    if(x.id == y){
                        let d = JSON.parse(JSON.stringify(x));
                        d.menu_kedai_id = x.value;
                        d.nama = x.nama;
                        d.kuantitas = 1;
                        d.harga = x.harga;
                        d.sub_total = x.harga;
                        this.list.datas.push(d);     
                    }
                });
            });
            this.calculateTotal();
            this.dialogMenuKedai = false;
        },

        calculateQty(value){
            this.list.datas.map(x => {
                if(x.id == value.id){
                    let quantity = x.kuantitas * value.harga;
                    x.sub_total = quantity;
                }
            });
            this.calculateTotal();
        },

        calculateTotal(){
            let total = 0;
            this.list.datas.map(x => {
                total = total + x.sub_total;
            })
            this.form.total_penjualan = total;
        }
    },
    mounted(){

    },
    watch: {

    },
    computed:{

    },
}
</script>