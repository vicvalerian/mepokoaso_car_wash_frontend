<template>

    <v-main class="list">
        <loading-screen :value="loadingScreen"></loading-screen>
        <h1 class="page-custom-title">DATA PEMINJAMAN KARYAWAN</h1>
        <v-card>
            <v-card-title>
                <v-flex xs3>
                    <v-select class="mr-4" label="Pilih karyawan" :items="karyawan_list" v-model="filter.search" single-line hide-details clearable></v-select>
                </v-flex>
                <v-flex xs3>
                    <v-text-field v-model="list.search" append-icon="mdi-magnify" label="Cari peminjaman karyawan" single-line hide-details></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-btn dense class="btn-add-data" @click="dialogAddEdit=true">Tambah Data</v-btn>
            </v-card-title>

            <v-data-table :headers="list.headers" :items="list.datas" :search="list.search" class="elevation-1"
                :footer-props="{
                    showFirstLastPage: true,
                    firstIcon: 'mdi-skip-previous',
                    lastIcon: 'mdi-skip-next',
                    itemsPerPageAllText: 'Semua',
                    itemsPerPageText: 'Data per halaman',
                }"
                >
                <template v-slot:[`item.nomor`]="{ item }">
                    <template>{{ list.datas.indexOf(item) + 1 }}</template>
                </template>
                <template v-slot:[`item.tgl_peminjaman`]="{ item }">
                    <template>{{ formatTanggal(item.tgl_peminjaman) }}</template>
                </template>
                <template v-slot:[`item.nominal`]="{ item }">
                    <template>{{ formatRupiah(item.nominal, 'Rp') }}</template>
                </template>
                <template v-slot:[`item.foto`]="{ item }">
                    <v-img :src="$baseUrl+'/storage/'+item.foto" height="30px" width="30px" style="object-fit:cover; border-radius:50%; padding: 15px 0;"/>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon dense color="#316291" @click="detailHandler(item)" class="data-table-icon">mdi-information</v-icon>
                    <v-icon dense color="#316291" @click="editHandler(item)" class="data-table-icon">mdi-pencil</v-icon>
                    <v-icon dense color="#316291" @click="deleteHandler(item.uuid)" class="data-table-icon">mdi-delete</v-icon>
                </template>
                <template v-slot:[`footer.page-text`]="items"> 
                    {{ items.pageStart }} - {{ items.pageStop }} dari {{ items.itemsLength }}
                </template>
                <template v-slot:no-data>
                  <div color="white" class="red--text" icon="warning"><b>Maaf, tidak ada data tersedia.</b></div>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialogConfirmDelete" persistent max-width="400px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">Hapus Data Peminjaman Karyawan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <span >Apakah anda yakin ingin menghapus data peminjaman karyawan ini?</span>
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
                    <span class="headline white--text">Detail Data Peminjaman Karyawan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-content">
                    <v-container fluid>
                        <v-layout justify-center>
                            <v-flex xs12>
                                <div>
                                    <div>
                                        <v-text-field v-model="formDetail.nama_karyawan" label="Nama Karyawan" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.tgl_peminjaman" label="Tanggal Peminjaman" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.nominal" label="Nominal Peminjaman" readonly></v-text-field>
                                        <v-textarea v-model="formDetail.alasan" label="Alasan Peminjaman" readonly auto-grow></v-textarea>
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
                    <span class="headline white--text">{{formTitle}} Data Peminjaman Karyawan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <v-container v-if="inputType == 'Tambah'">
                        <v-select :items="karyawan_list" v-model="form.karyawan_id" label="Nama Karyawan" item-value="id" item-text="nama" required></v-select>
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="form.tgl_peminjaman" persistent width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="form.tgl_peminjaman_show"
                                    label="Tanggal Peminjaman"
                                    prepend-icon="mdi-calendar-blank-outline"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="form.tgl_peminjaman" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal = false">Batal</v-btn>
                                <v-btn text color="primary" @click="$refs.dialog.save(form.tgl_peminjaman)">Simpan</v-btn>
                            </v-date-picker>
                        </v-dialog>
                        <v-text-field v-model="form.nominal" label="Nominal Peminjaman" required></v-text-field>
                        <v-textarea v-model="form.alasan" label="Alasan Peminjaman" auto-grow></v-textarea>
                    </v-container>
                    <v-container v-else>
                        <v-select :items="karyawan_list" v-model="form.karyawan_id" label="Nama Karyawan" item-value="id" item-text="nama" required></v-select>
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="form.tgl_peminjaman" persistent width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="form.tgl_peminjaman_show"
                                    label="Tanggal Peminjaman"
                                    prepend-icon="mdi-calendar-blank-outline"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="form.tgl_peminjaman" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal = false">Batal</v-btn>
                                <v-btn text color="primary" @click="$refs.dialog.save(form.tgl_peminjaman)">Simpan</v-btn>
                            </v-date-picker>
                        </v-dialog>
                        <v-text-field v-model="form.nominal" label="Nominal Peminjaman" required></v-text-field>
                        <v-textarea v-model="form.alasan" label="Alasan Peminjaman" auto-grow></v-textarea>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dense class="btn-confirm-cancel" @click="cancelForm()">Batal</v-btn>
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
    name: 'peminjaman-karyawan-list',
    data() {
        return {
            userLogin: JSON.parse(localStorage.getItem('userLogin')),
            loadingScreen: true,
            modal: false,
            previewImgLogo: '',
            inputType: 'Tambah',
            dialogConfirmDelete: false,
            dialogDetail: false,
            dialogAddEdit: false,
            karyawan_list: [],
            peminjamanKaryawan: new FormData(),
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
                nama_karyawan: '',
                tgl_peminjaman: '',
                nominal: '',
                alasan: '',
            },
            form: {
                karyawan_id: '',
                tgl_peminjaman: new Date().toISOString().substr(0, 10),
                tgl_peminjaman_show: '',
                nominal: '',
                alasan: '',
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
                { text: "Nama Karyawan", value: "karyawan.nama" },
                { text: "Tanggal Peminjaman", value: "tgl_peminjaman" },
                { text: "Nominal", value: "nominal" },
                { text: "Aksi", value: "actions", sortable: false },
            ];

            this.axioData();
            this.axioKaryawan();
            this.form.tgl_peminjaman_show = this.formatTanggal(this.form.tgl_peminjaman);
        },

        axioData() {
            let url = this.$api + '/peminjaman-karyawan?karyawan=' + this.filter.search;
            this.$http.get(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then(response => {
                this.list.datas = response.data.data;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
            });
        },

        axioKaryawan(){
            let url = this.$api + '/list-selection-karyawan';
            this.$http.get(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then(response => {
                if(response.status == 200){
                    let data = JSON.parse(JSON.stringify(response.data));
                    data.forEach((item)=>{
                        let dashboard = item;
                        dashboard.text = item.nama
                        dashboard.value = item.nama
                        this.karyawan_list.push(dashboard);
                    });
                }
            });
        },

        saveData(){
            this.peminjamanKaryawan.append('karyawan_id', this.form.karyawan_id);
            this.peminjamanKaryawan.append('tgl_peminjaman', this.form.tgl_peminjaman);
            this.peminjamanKaryawan.append('nominal', this.form.nominal);
            this.peminjamanKaryawan.append('alasan', this.form.alasan);

            this.loadingScreen = true;
            var url = this.$api + '/peminjaman-karyawan';
            this.$http.post(url, this.peminjamanKaryawan, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then((response) => {
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
            data.append('karyawan_id', this.form.karyawan_id);
            data.append('tgl_peminjaman', this.form.tgl_peminjaman);
            data.append('nominal', this.form.nominal);
            data.append('alasan', this.form.alasan);

            this.loadingScreen = true;
            var url = this.$api + '/peminjaman-karyawan/' + this.editId;
            this.load = true;
            this.$http.post(url, data, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then((response) => {
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
            var url = this.$api + "/peminjaman-karyawan/" + id;
            this.$http.delete(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then((response) => {
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
            this.formDetail.tgl_peminjaman = this.formatTanggal(item.tgl_peminjaman)
            this.formDetail.nominal = this.formatRupiah(item.nominal, 'Rp')
            this.formDetail.alasan = item.alasan
            if(item.karyawan){
                this.formDetail.nama_karyawan = item.karyawan.nama
            } else{
                this.formDetail.nama_karyawan = "-"
            }
            this.dialogDetail = true
        },

        editHandler(item) {
            this.inputType = 'Ubah';
            this.editId = item.uuid;
            this.form.karyawan_id = item.karyawan_id;
            this.form.tgl_peminjaman = item.tgl_peminjaman;
            this.form.tgl_peminjaman_show = this.formatTanggal(item.tgl_peminjaman);
            this.form.nominal = item.nominal;
            this.form.alasan = item.alasan;
            this.dialogAddEdit = true;
        },

        deleteHandler(item) {
            this.deleteId = item
            this.dialogConfirmDelete = true
        },

        clearForm(){
            this.form = {
                karyawan_id: '',
                tgl_peminjaman: new Date().toISOString().substr(0, 10),
                tgl_peminjaman_show: this.formatTanggal(this.form.tgl_peminjaman),
                nominal: '',
                alasan: '',
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

        formatTanggal(value){
            return value.split("-").reverse().join("-");
        },
    },
    mounted(){
        
    },
    watch: {
        'form.tgl_peminjaman'(val){
            if(val){
                this.form.tgl_peminjaman_show = this.formatTanggal(val)
            }
        },

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