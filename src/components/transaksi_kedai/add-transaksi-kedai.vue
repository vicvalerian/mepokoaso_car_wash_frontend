<template>

    <v-main class="list">
        <loading-screen :value="loadingScreen"></loading-screen>
        <h1 class="page-custom-title">TAMBAH TRANSAKSI KEDAI</h1>
        <v-card>
            <v-card-text class="dialog-confirm-content">
                <v-container fluid>
                    <v-layout justify-center>
                        <v-flex xs12>
                            <div>
                                <v-layout justify>
                                    <v-flex xs7>
                                        <v-item-group mandatory>
                                            <v-container>
                                                <v-row>
                                                    <v-col v-for="(item, index) in jenis_menu_list" :key="index" cols="12" md="3" style="padding-top: 0;">
                                                        <v-item v-slot="{ active, toggle }">
                                                            <v-card :color="active ? '#316291' : ''" @click="toggle">
                                                                <v-card-text :class="active ? 'white--text justify-center' : 'black--text justify-center'" @click="axioMenuKedai(item.value)">
                                                                    <div class="row center">
                                                                        <v-icon :class="active ? 'white--text' : 'black--text'">{{item.icon}}</v-icon>
                                                                        <h4>{{ item.name }}</h4>
                                                                    </div>
                                                                </v-card-text>
                                                            </v-card>
                                                        </v-item>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-item-group>
                                        <v-item-group>
                                            <v-container>
                                                <v-row>
                                                    <v-col v-for="(item, index) in menu_kedai_list" :key="index" cols="12" md="3">
                                                        <v-item>
                                                            <v-card elevation="5" class="" style="height: auto;">
                                                                <v-card-title class="justify-center" style="padding: 8px">
                                                                    <v-card color="#316291" width="100%" height="100" elevation="0" class="center mb-2">
                                                                        <v-icon v-if="item.jenis == 'Makanan'" color="white" x-large>mdi-rice</v-icon>
                                                                        <v-icon v-else color="white" x-large>mdi-cup</v-icon>
                                                                    </v-card>
                                                                </v-card-title>
                                                                <v-card-text style="height: 50px;">
                                                                    <h3 class="black--text" style="text-align: left;">{{ item.nama }}</h3>
                                                                </v-card-text>
                                                                <v-card-actions>
                                                                    <v-chip class="white--text" color="#316291" label><b>{{ formatRupiah(item.harga, 'Rp') }}</b></v-chip>
                                                                    <v-spacer></v-spacer>
                                                                    <v-chip @click="insertTableMenu(item)" class="custom-blue--text" color="#B3E5FC" label><v-icon>mdi-plus</v-icon></v-chip>
                                                                </v-card-actions>
                                                            </v-card>
                                                        </v-item>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-item-group>
                                    </v-flex>
                                    <v-flex xs5>
                                        <v-card>
                                            <v-card-title>
                                                <h3 class="page-custom-title">DAFTAR PESANAN</h3>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-data-table :headers="list.headers" :items="list.datas" class="elevation-1" hide-default-footer>
                                                    <template v-slot:[`item.kuantitas`]="{ item }">
                                                        <v-text-field type="number" min="1" v-model="item.kuantitas" @change="calculateQty(item)"></v-text-field>
                                                    </template>
                                                    <template v-slot:[`item.sub_total_show`]="{ item }">
                                                        <v-text-field v-model="item.sub_total_show" readonly></v-text-field>
                                                    </template>
                                                    <template v-slot:[`item.actions`]="{ item }">
                                                        <v-icon dense color="#316291" @click="deleteTableMenu(item.id)" class="data-table-icon">mdi-delete</v-icon>
                                                    </template>
                                                    <template v-slot:no-data>
                                                        <div color="white" class="red--text" icon="warning"><b>Maaf, tidak ada data tersedia.</b></div>
                                                    </template>
                                                </v-data-table>
                                                <br/>
                                                <v-layout justify>
                                                    <v-flex xs5>
                                                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="form.tgl_penjualan" persistent width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field
                                                                    v-model="form.tgl_penjualan_show"
                                                                    label="Tanggal Penjualan" outlined
                                                                    prepend-inner-icon="mdi-calendar-blank-outline"
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
                                                                    label="Waktu Penjualan" outlined
                                                                    prepend-inner-icon="mdi-clock-time-four-outline"
                                                                    readonly
                                                                    v-bind="attrs"
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-time-picker v-if="modal2" v-model="form.waktu_penjualan" format="24hr" full-width use-seconds>
                                                                <v-spacer></v-spacer>
                                                                <v-btn text color="primary" @click="modal2 = false">Batal</v-btn>
                                                                <v-btn text color="primary" @click="$refs.dialog2.save(form.waktu_penjualan)">Simpan</v-btn>
                                                            </v-time-picker>
                                                        </v-dialog>
                                                    </v-flex>
                                                </v-layout>
                                                <!-- <v-select outlined :items="penjaga_kedai_list" v-model="form.karyawan_id" label="Pilih Penjaga Kedai" required></v-select> -->
                                                <v-layout>
                                                    <v-card width="100%" height="32px" color="grey lighten-4" elevation="0" class="center">
                                                        <v-flex xs5>
                                                            <h3 class="black--text"><b>Total</b></h3>
                                                        </v-flex>
                                                        <v-spacer></v-spacer>
                                                        <v-flex xs6>
                                                            <h3 class="black--text"><b>{{ form.total_penjualan_show }}</b></h3>
                                                        </v-flex>
                                                    </v-card>
                                                </v-layout>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn dense color="btn-confirm-cancel" @click="goToListTransaksiKedai()">Batal</v-btn>
                                                <v-btn dense class="btn-confirm-delete" @click="saveData()">Simpan Pesanan</v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </div>     
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
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

    .chip-add-menu{
        background-color: #316291 !important;
    }

    .v-application .custom-blue--text {
        color: #316291!important;
        caret-color: #316291!important;
    }

    .center {
        display: flex;
        justify-content: center;
        align-items: center;
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
    name: 'transaksi-kedai-add',
    data() {
        return {
            loadingScreen: true,
            userLogin: JSON.parse(localStorage.getItem('userLogin')),
            jenis_menu_list: [
                { name: 'Semua', value: '', icon: 'mdi-silverware' }, 
                { name: 'Makanan', value: 'Makanan', icon: 'mdi-rice' }, 
                { name: 'Minuman', value: 'Minuman', icon: 'mdi-cup' }
            ],
            modal: false,
            modal2: false,
            penjaga_kedai_list: [],
            menu_kedai_list: [],
            snackbar: {
                snackbarNotif: false,
                color: '',
                message: '',
            },
            form: {
                karyawan_id: '',
                total_penjualan: '',
                total_penjualan_show: '',
                tgl_penjualan: new Date().toISOString().substr(0, 10),
                tgl_penjualan_show: '',
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
                { text: "Nama Menu", value: "nama", width: '40%'},
                { text: "Kuantitas", value: "kuantitas", width: '25%'},
                { text: "Subtotal", value: "sub_total_show", width: '25%'},
                { text: "Aksi", value: "actions", sortable: false },
            ];

            this.axioKaryawanPenjagaKedai();
            this.axioMenuKedai('');
            this.setFieldWaktu();
            this.setFieldKaryawan();
            this.calculateTotal();
            this.form.tgl_penjualan_show = this.formatTanggal(this.form.tgl_penjualan);
        },

        axioKaryawanPenjagaKedai(){
            let url = this.$api + '/list-selection-karyawan';
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

        axioMenuKedai(jenis){
            this.loadingScreen = true;
            let url = this.$api + '/menu-kedai?jenis=' + jenis;
            this.$http.get(url).then(response => {
                this.menu_kedai_list = response.data.data;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
            });
        },

        setFieldWaktu(){
            let now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
            this.form.waktu_penjualan = hours+':'+minutes+':'+seconds;
        },

        setFieldKaryawan(){
            this.form.karyawan_id = this.userLogin.id;
        },

        saveData(){
            let data = {
                'karyawan_id': this.form.karyawan_id,
                'tgl_penjualan': this.form.tgl_penjualan,
                'waktu_penjualan': this.form.waktu_penjualan,
                'total_penjualan': this.form.total_penjualan,
                'detail_transaksi_kedai': this.list.datas,
            }
            
            this.loadingScreen = true;
            var url = this.$api + '/transaksi-kedai';
            this.$http.post(url, data).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
                setTimeout(() =>{
                    this.goToListTransaksiKedai();    
                }, 500);
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
                // this.goToListTransaksiKedai();
            });
        },

        insertTableMenu(item){
            let found = false;
            let arrIndex = 0;
            for (let index = 0; index < this.list.datas.length; index++) {
                if(this.list.datas[index].id == item.id){
                    found = true;
                    arrIndex = index;
                }
            }

            if(!found){
                item.menu_kedai_id = item.id;
                item.kuantitas = 1;
                item.sub_total = item.harga;
                item.sub_total_show = this.formatRupiah(item.harga, 'Rp');
                this.list.datas.push(item);
                this.calculateTotal();
            } else{
                this.list.datas[arrIndex].kuantitas = this.list.datas[arrIndex].kuantitas + 1;
                this.list.datas[arrIndex].sub_total = this.list.datas[arrIndex].sub_total + item.harga;
                this.list.datas[arrIndex].sub_total_show = this.formatRupiah(this.list.datas[arrIndex].sub_total, 'Rp');
                this.calculateTotal();  
            }
        },

        deleteTableMenu(item){
            let objWithIdIndex = this.list.datas.findIndex((obj) => obj.id === item);

            if(objWithIdIndex > -1) {
                this.list.datas.splice(objWithIdIndex, 1);
                this.calculateTotal();
            }
        },

        goToListTransaksiKedai(){
            this.$router.push({
                name: 'Transaksi Kedai',
            });
        },

        calculateQty(value){
            this.list.datas.map(x => {
                if(x.id == value.id){
                    let quantity = x.kuantitas * value.harga;
                    x.sub_total = quantity;
                    x.sub_total_show = this.formatRupiah(quantity, 'Rp');
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
            this.form.total_penjualan_show = this.formatRupiah(total, 'Rp');
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
        'form.tgl_penjualan'(val){
            if(val){
                this.form.tgl_penjualan_show = this.formatTanggal(val)
            }
        },
    },
    computed:{

    },
}
</script>