<template>

    <v-main class="list">
        <loading-screen :value="loadingScreen"></loading-screen>
        <h1 class="page-custom-title">DATA MENU KEDAI</h1>
        <v-card>
            <v-card-title>
                <v-flex xs3>
                    <v-select class="mr-4" label="Pilih jenis menu" :items="jenis_makanan_list" v-model="filter.search" single-line hide-details clearable></v-select>
                </v-flex>
                <v-flex xs3>
                    <v-text-field v-model="list.search" append-icon="mdi-magnify" label="Cari menu kedai" single-line hide-details></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-btn dense class="btn-add-data" @click="dialogAddEdit=true">Tambah Data</v-btn>

            </v-card-title>

            <v-data-table :headers="list.headers" :items="list.datas" :search="list.search" class="elevation-1">
                <template v-slot:[`item.nomor`]="{ item }">
                    <template>{{ list.datas.indexOf(item) + 1 }}</template>
                </template>
                <template v-slot:[`item.harga`]="{ item }">
                    <template>{{ formatRupiah(item.harga, 'Rp') }}</template>
                </template>
                <template v-slot:[`item.stok`]="{ item }">
                    <template v-if="item.stok == null || item.is_stok == false"><b>-</b></template>
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
                    <span class="headline white--text">Hapus Data Menu Kedai</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <span >Apakah anda yakin ingin menghapus data menu kedai ini?</span>
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
                    <span class="headline white--text">Detail Data Menu Kedai</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-content">
                    <v-container fluid>
                        <v-layout justify-center>
                            <v-flex xs12>
                                <div>
                                    <div>
                                        <v-text-field v-model="formDetail.nama" label="Nama Menu" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.jenis" label="Jenis Menu" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.harga" label="Harga Menu" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.stok" label="Stok Menu" readonly ></v-text-field>
                                        <v-text-field v-model="formDetail.is_stok" label="Memiliki Stok" readonly></v-text-field>
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

        <v-dialog v-model="dialogAddEdit" persistent max-width="600px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">{{formTitle}} Data Menu Kedai</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <v-container v-if="inputType == 'Tambah'">
                        <v-select :items="jenis_makanan_list" v-model="form.jenis" label="Jenis Menu" item-value="id" item-text="nama" required></v-select>
                        <v-text-field v-model="form.nama" label="Nama Menu" required></v-text-field>
                        <v-text-field v-model="form.harga" label="Harga Menu" required></v-text-field>
                        <v-text-field v-model="form.stok" label="Stok Menu" required></v-text-field>
                        <v-select :items="fieldBolean" label="Memiliki Stok" v-model="form.is_stok"></v-select>
                    </v-container>
                    <v-container v-else>
                        <v-select :items="jenis_makanan_list" v-model="form.jenis" label="Jenis Menu" item-value="id" item-text="nama" required></v-select>
                        <v-text-field v-model="form.nama" label="Nama Menu" required></v-text-field>
                        <v-text-field v-model="form.harga" label="Harga Menu" required></v-text-field>
                        <v-text-field v-model="form.stok" label="Stok Menu" required></v-text-field>
                        <v-select :items="fieldBolean" label="Memiliki Stok" v-model="form.is_stok"></v-select>
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
    name: 'menu-kedai-list',
    data() {
        return {
            loadingScreen: true,
            fieldBolean : [{ text: "Ya", value: 1 }, { text: "Tidak", value: 0 }],
            inputType: 'Tambah',
            dialogConfirmDelete: false,
            dialogDetail: false,
            dialogAddEdit: false,
            jenis_makanan_list: ['Makanan', 'Minuman'],
            menuKedai: new FormData(),
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
                nama: '',
                jenis: '',
                harga: '',
                stok: '',
                is_stok: '',
            },
            form: {
                nama: '',
                jenis: '',
                harga: '',
                stok: '',
                is_stok: false,
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
                { text: "No", value: "nomor", width: '5%' },
                { text: "Nama Menu", value: "nama" },
                { text: "Jenis Menu", value: "jenis" },
                { text: "Harga", value: "harga", filterable:false },
                { text: "Stok Tersedia", value: "stok", filterable: false },
                { text: "Aksi", value: "actions", sortable: false },
            ];

            this.axioData();
        },

        axioData() {
            let url = this.$api + '/menu-kedai?jenis=' + this.filter.search;
            this.$http.get(url).then(response => {
                this.list.datas = response.data.data;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
            });
        },

        saveData(){
            this.menuKedai.append('nama', this.form.nama);
            this.menuKedai.append('jenis', this.form.jenis);
            this.menuKedai.append('harga', this.form.harga);
            this.menuKedai.append('stok', this.form.stok ? this.form.stok : 0);
            this.menuKedai.append('is_stok', this.form.is_stok);

            this.loadingScreen = true;
            var url = this.$api + '/menu-kedai';
            this.$http.post(url, this.menuKedai).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEdit = false
                this.axioData();
                this.cancelForm();
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
                this.dialogAddEdit = false
            });
        },

        updateData(){
            var data = new FormData();
            data.append('nama', this.form.nama);
            data.append('jenis', this.form.jenis);
            data.append('harga', this.form.harga);
            data.append('stok', this.form.stok ? this.form.stok : 0);
            data.append('is_stok', this.form.is_stok);

            this.loadingScreen = true;
            var url = this.$api + '/menu-kedai/' + this.editId;
            this.load = true;
            this.$http.post(url, data).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEdit = false
                this.axioData();
                this.cancelForm();
                this.inputType = 'Tambah';
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
                this.dialogAddEdit = false
            });
        },

        deleteData(){
            this.loadingScreen = true;
            let id = this.deleteId;
            var url = this.$api + "/menu-kedai/" + id;
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
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
                this.dialogConfirmDelete = false
            });
        },

        detailHandler(item){
            this.formDetail.nama = item.nama;
            this.formDetail.jenis = item.jenis;
            this.formDetail.harga = this.formatRupiah(item.harga, 'Rp');
            this.formDetail.stok = item.stok ?? "-";
            if(item.is_stok == true){
                this.formDetail.is_stok = 'Ya'
            } else{
                this.formDetail.is_stok = 'Tidak'
            }
            this.dialogDetail = true
        },

        editHandler(item) {
            this.inputType = 'Ubah';
            this.editId = item.id;
            this.form.nama = item.nama;
            this.form.jenis = item.jenis;
            this.form.harga = item.harga;
            this.form.stok = item.stok;
            this.form.is_stok = item.is_stok;
            this.dialogAddEdit = true;
        },

        deleteHandler(item) {
            this.deleteId = item
            this.dialogConfirmDelete = true
        },

        clearForm(){
            this.form = {
                nama: '',
                jenis: '',
                harga: '',
                stok: '',
                is_stok: false,
            };
        },

        cancelForm(){
            this.clearForm()
            this.dialogAddEdit = false
            this.inputType = 'Tambah'
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
        }
    },
    computed:{
        formTitle() {
            return this.inputType;
        },
    },
}
</script>