<template>

    <v-main class="list">
        <h1 class="page-custom-title">DATA PENGELUARAN KEDAI</h1>
        <v-card>
            <v-card-title>
                <v-spacer></v-spacer>
                <v-btn dense class="btn-add-data" @click="dialogSelect=true">Tambah Data</v-btn>
                <v-text-field v-model="list.search" append-icon="mdi-magnify" label="Cari pengeluaran kedai" single-line hide-details></v-text-field>
            </v-card-title>

            <v-data-table :headers="list.headers" :items="list.datas" :search="list.search" class="elevation-1">
                <template v-slot:[`item.harga_pembelian`]="{ item }">
                    <template>{{ formatRupiah(item.harga_pembelian, 'Rp') }}</template>
                </template>
                <template v-slot:[`item.stok`]="{ item }">
                    <template v-if="item.stok == null"><b>-</b></template>
                    <template v-else-if="item.stok >= 0 && item.stok <= 10"><b class="red--text">{{ item.stok }}</b></template>
                    <template v-else-if="item.stok > 10 && item.stok <= 30"><b class="orange--text">{{ item.stok }}</b></template>
                    <template v-else><b class="green--text">{{ item.stok }}</b></template>
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

        <v-dialog v-model="dialogConfirmDelete" persistent max-width="400px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">Hapus Data Pengeluaran Kedai</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <span >Apakah anda yakin ingin menghapus data pengeluaran kedai ini?</span>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="dialogConfirmDelete = false">Batal</v-btn>
                    <v-btn dense class="btn-confirm-delete" @click="deleteData()">Hapus</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDetail" persistent max-width="600px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">Detail Data Pengeluaran Kedai</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-content">
                    <v-container fluid>
                        <v-layout justify-center>
                            <v-flex xs12>
                                <div>
                                    <div>
                                        <v-text-field v-model="formDetail.nama_barang" label="Nama Barang" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.tgl_pembelian" label="Tanggal Pembelian" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.jumlah_barang" label="Jumlah Barang" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.harga_pembelian" label="Harga Pembelian" readonly ></v-text-field>
                                    </div>
                                </div>       
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="dialogDetail = false">Tutup</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogSelect" persistent max-width="600px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">{{formTitle}} Data Pengeluaran Kedai</span>
                </v-card-title>
                <v-card-text class="text">
                    <v-flex xs12 mt-4>
                        <v-btn dense class="btn-select-stok" @click="openSelectedDialogStok(true)">Stok</v-btn>
                    </v-flex>
                    <v-flex xs12 mt-4>
                        <v-btn dense class="btn-select-stok" @click="openSelectedDialogStok(false)">Non Stok</v-btn>
                    </v-flex>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="dialogSelect = false">Batal</v-btn>
                    <!-- <v-btn dense class="btn-confirm-delete" @click="setForm()">Simpan</v-btn> -->
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogAddEditStok" persistent max-width="600px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">{{formTitle}} Data Pengeluaran Kedai</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <v-container v-if="inputType == 'Tambah'">
                        <v-select :items="menu_kedai_list" v-model="form.menu_kedai_id" label="Nama Barang" required></v-select>
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="form.tgl_pembelian" persistent width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="form.tgl_pembelian"
                                    label="Tanggal Pembelian"
                                    prepend-icon="mdi-calendar-blank-outline"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="form.tgl_pembelian" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal = false">Batal</v-btn>
                                <v-btn text color="primary" @click="$refs.dialog.save(form.tgl_pembelian)">Simpan</v-btn>
                            </v-date-picker>
                        </v-dialog>
                        <v-text-field v-model="form.jumlah_barang" label="Jumlah Barang (pcs)" required></v-text-field>
                        <v-text-field v-model="form.harga_pembelian" label="Harga Barang" required></v-text-field>
                    </v-container>
                    <v-container v-else>
                        <v-select :items="menu_kedai_list" v-model="form.menu_kedai_id" label="Nama Barang" required></v-select>
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="form.tgl_pembelian" persistent width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="form.tgl_pembelian"
                                    label="Tanggal Pembelian"
                                    prepend-icon="mdi-calendar-blank-outline"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="form.tgl_pembelian" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal = false">Batal</v-btn>
                                <v-btn text color="primary" @click="$refs.dialog.save(form.tgl_pembelian)">Simpan</v-btn>
                            </v-date-picker>
                        </v-dialog>
                        <v-text-field v-model="form.jumlah_barang" label="Jumlah Barang (pcs)" required></v-text-field>
                        <v-text-field v-model="form.harga_pembelian" label="Harga Barang" required></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="cancelForm()">Batal</v-btn>
                    <v-btn dense class="btn-confirm-delete" @click="setForm()">Simpan</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogAddEditNonStok" persistent max-width="600px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">{{formTitle}} Data Pengeluaran Kedai</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <v-container v-if="inputType == 'Tambah'">
                        <v-text-field v-model="form.nama_barang" label="Nama Barang" required></v-text-field>
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="form.tgl_pembelian" persistent width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="form.tgl_pembelian"
                                    label="Tanggal Pembelian"
                                    prepend-icon="mdi-calendar-blank-outline"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="form.tgl_pembelian" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal = false">Batal</v-btn>
                                <v-btn text color="primary" @click="$refs.dialog.save(form.tgl_pembelian)">Simpan</v-btn>
                            </v-date-picker>
                        </v-dialog>
                        <v-text-field v-model="form.jumlah_barang" label="Jumlah Barang (pcs)" required></v-text-field>
                        <v-text-field v-model="form.harga_pembelian" label="Harga Barang" required></v-text-field>
                    </v-container>
                    <v-container v-else>
                        <v-text-field v-model="form.nama_barang" label="Nama Menu" required></v-text-field>
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="form.tgl_pembelian" persistent width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="form.tgl_pembelian"
                                    label="Tanggal Pembelian"
                                    prepend-icon="mdi-calendar-blank-outline"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="form.tgl_pembelian" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal = false">Batal</v-btn>
                                <v-btn text color="primary" @click="$refs.dialog.save(form.tgl_pembelian)">Simpan</v-btn>
                            </v-date-picker>
                        </v-dialog>
                        <v-text-field v-model="form.jumlah_barang" label="Jumlah Barang (pcs)" required></v-text-field>
                        <v-text-field v-model="form.harga_pembelian" label="Harga Barang" required></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense color="btn-confirm-cancel" @click="cancelForm()">Batal</v-btn>
                    <v-btn dense class="btn-confirm-delete" @click="setForm()">Simpan</v-btn>
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

    .btn-select-stok{
        background-color: #316291 !important;
        color: #FCFDEF !important;
        padding: 15px !important;
        text-align: center !important;
        font-size: 16px !important;
        border-radius: 15px !important;
        width: 100%;
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
    name: 'pengeluaran-kedai-list',
    data() {
        return {
            modal: false,
            menu_kedai_list: [],
            inputType: 'Tambah',
            dialogConfirmDelete: false,
            dialogDetail: false,
            dialogAddEditStok: false,
            dialogAddEditNonStok: false,
            dialogSelect: false,
            pengeluaranKedai: new FormData(),
            editId: '',
            deleteId: '',
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
            formDetail: {
                nama_barang: '',
                tgl_pembelian: '',
                jumlah_barang: '',
                harga_pembelian: '',
            },
            form: {
                menu_kedai_id: '',
                nama_barang: '',
                tgl_pembelian: new Date().toISOString().substr(0, 10),
                jumlah_barang: '',
                harga_pembelian: '',
            },
            filter: {
                search: '',
            },
        }
    },
    created(){
        this.initialize();    
    },
    methods: {
        setForm(){
            if (this.inputType !== 'Tambah') {
                this.updateData();
            } else {
                this.saveData();
            }
        },

        onPreviewImage(e) {
            this.previewImgLogo = URL.createObjectURL(e)
        },

        initialize(){
            this.list.headers = [
                { text: "Tanggal Pembelian", value: "tgl_pembelian" },
                { text: "Nama Barang", value: "nama_barang" },
                { text: "Jumlah Barang (pcs)", value: "jumlah_barang" },
                { text: "Harga", value: "harga_pembelian" },
                { text: "Aksi", value: "actions", sortable: false },
            ];

            this.axioData();
            this.axioMenuKedai();
        },

        axioData() {
            let url = this.$api + '/pengeluaran-kedai';
            this.$http.get(url).then(response => {
                this.list.datas = response.data.data;
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
                        dashboard.nama = item.nama
                        dashboard.value = item.id
                        this.menu_kedai_list.push(dashboard);
                    });
                }
            });
        },

        saveData(){
            this.pengeluaranKedai.append('menu_kedai_id', this.form.menu_kedai_id ?? '');
            this.pengeluaranKedai.append('nama_barang', this.form.nama_barang);
            this.pengeluaranKedai.append('tgl_pembelian', this.form.tgl_pembelian);
            this.pengeluaranKedai.append('jumlah_barang', this.form.jumlah_barang);
            this.pengeluaranKedai.append('harga_pembelian', this.form.harga_pembelian);

            var url = this.$api + '/pengeluaran-kedai';
            this.$http.post(url, this.pengeluaranKedai).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEditStok = false
                this.dialogAddEditNonStok = false
                this.axioData();
                this.cancelForm();
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEditStok = false
                this.dialogAddEditNonStok = false
            });
        },

        updateData(){
            var data = new FormData();
            data.append('menu_kedai_id', this.form.menu_kedai_id ?? '');
            data.append('nama_barang', this.form.nama_barang);
            data.append('tgl_pembelian', this.form.tgl_pembelian);
            data.append('jumlah_barang', this.form.jumlah_barang);
            data.append('harga_pembelian', this.form.harga_pembelian);

            var url = this.$api + '/pengeluaran-kedai/' + this.editId;
            this.load = true;
            this.$http.post(url, data).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEditStok = false
                this.dialogAddEditNonStok = false
                this.axioData();
                this.cancelForm();
                this.inputType = 'Tambah';
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEditStok = false
                this.dialogAddEditNonStok = false
            });
        },

        deleteData(){
            let id = this.deleteId;
            var url = this.$api + "/pengeluaran-kedai/" + id;
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

        detailHandler(item){
            this.formDetail.nama_barang = item.nama_barang;
            this.formDetail.tgl_pembelian = item.tgl_pembelian;
            this.formDetail.jumlah_barang = item.jumlah_barang+" pcs";
            this.formDetail.harga_pembelian = this.formatRupiah(item.harga_pembelian, 'Rp');
            this.dialogDetail = true
        },

        editHandler(item) {
            this.inputType = 'Ubah';
            this.editId = item.id;
            this.form.menu_kedai_id = item.menu_kedai_id;
            this.form.nama_barang = item.nama_barang;
            this.form.tgl_pembelian = item.tgl_pembelian;
            this.form.jumlah_barang = item.jumlah_barang;
            this.form.harga_pembelian = item.harga_pembelian;

            if(item.menu_kedai_id != null){
                this.dialogAddEditStok = true
            } else if(item.menu_kedai_id == null){
                this.dialogAddEditNonStok = true
            }
        },

        deleteHandler(item) {
            this.deleteId = item
            this.dialogConfirmDelete = true
        },

        clearForm(){
            this.form = {
                menu_kedai_id: '',
                nama_barang: '',
                tgl_pembelian: new Date().toISOString().substr(0, 10),
                jumlah_barang: '',
                harga_pembelian: '',
            };
        },

        cancelForm(){
            this.clearForm()
            this.dialogAddEditStok = false
            this.dialogAddEditNonStok = false
            this.inputType = 'Tambah'
        },

        openSelectedDialogStok(value){
            this.dialogSelect = false
            if(value == true){
                this.dialogAddEditStok = true
            } else if(value == false){
                this.dialogAddEditNonStok = true
            }
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
        'filter.search'(val){
            if(!val){
                this.filter.search = ''
            }
            this.axioData();
        },

        'form.menu_kedai_id'(val){
            this.menu_kedai_list.forEach((item)=>{
                if(item.id == val){
                    this.form.nama_barang = item.nama
                }
            });
        }
    },
    computed:{
        formTitle() {
            return this.inputType;
        },
    },
}
</script>