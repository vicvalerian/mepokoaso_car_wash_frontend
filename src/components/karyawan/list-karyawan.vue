<template>

    <v-main class="list">
        <loading-screen :value="loadingScreen"></loading-screen>
        <h1 class="page-custom-title">DATA KARYAWAN</h1>
        <v-card>
            <v-card-title>
                <v-flex xs4>
                    <v-text-field v-model="list.search" append-icon="mdi-magnify" label="Cari karyawan" single-line hide-details></v-text-field>
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
                <template v-slot:[`item.gaji`]="{ item }">
                    <template v-if="item.gaji">{{ formatRupiah(item.gaji, 'Rp') }}</template>
                    <template v-else>-</template>
                </template>
                <template v-slot:[`item.foto`]="{ item }">
                    <v-img :src="$baseUrl+'/storage/'+item.foto" height="30px" width="30px" style="object-fit:cover; border-radius:50%; padding: 15px 0;"/>
                </template>
                <template v-slot:[`item.status`]="{ item }">
                    <v-chip v-if="item.status === 'Tidak Aktif'" class="red-chip" label>{{ item.status }}</v-chip>
                    <v-chip v-if="item.status === 'Izin'" class="orange-chip" label>{{ item.status }}</v-chip>
                    <v-chip v-if="item.status === 'Aktif'" class="green-chip" label>{{ item.status }}</v-chip>
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
                    <span class="headline white--text">Hapus Data Karyawan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <span >Apakah anda yakin ingin menghapus data karyawan ini?</span>
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
                    <span class="headline white--text">Detail Data Karyawan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-content">
                    <v-container fluid>
                        <v-layout justify-center>
                            <v-flex xs12>
                                <div class="row">
                                    <div class="mr-8">
                                        <v-img contain width="300px" height="400px" :src="previewImgLogo == '' ? $baseUrl+'/storage/'+formDetail.foto : previewImgLogo" style="object-fit:cover;"></v-img>
                                    </div>
                                    <div>
                                        <v-text-field v-model="formDetail.jabatan" label="Jabatan" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.nama" label="Nama Karyawan" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.no_telp" label="Nomor Telepon Karyawan" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.username" label="Nama Pengguna Karyawan" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.gaji" label="Gaji Karyawan" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.status" label="Status Karyawan" readonly></v-text-field>
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
                    <span class="headline white--text">{{formTitle}} Data Karyawan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <v-container v-if="inputType == 'Tambah'">
                        <v-select :items="jabatan_list" v-model="form.jabatan_id" label="Jabatan Karyawan" item-value="id" item-text="nama" required></v-select>
                        <v-text-field v-model="form.nama" label="Nama Karyawan" required></v-text-field>
                        <v-text-field v-model="form.no_telp" label="Nomor Telepon Karyawan" required></v-text-field>
                        <v-text-field v-model="form.username" label="Nama Pengguna Karyawan" required></v-text-field>
                        <v-text-field v-model="form.gaji" label="Gaji Karyawan" required></v-text-field>
                        <v-select :items="statuses" v-model="form.status" label="Status Karyawan" item-value="id" item-text="nama" required></v-select>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Foto Karyawan" id="fotoKaryawan" ref="fileKaryawan"></v-file-input>
                    </v-container>
                    <v-container v-else>
                        <v-select :items="jabatan_list" v-model="form.jabatan_id" label="Jabatan Karyawan" item-value="id" item-text="nama" required></v-select>
                        <v-text-field v-model="form.nama" label="Nama Karyawan" required></v-text-field>
                        <v-text-field v-model="form.no_telp" label="Nomor Telepon Karyawan" required></v-text-field>
                        <v-text-field v-model="form.username" label="Nama Pengguna Karyawan" required></v-text-field>
                        <v-text-field v-model="form.gaji" label="Gaji Karyawan" required></v-text-field>
                        <v-select :items="statuses" v-model="form.status" label="Status Karyawan" item-value="id" item-text="nama" required></v-select>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Foto Karyawan" id="fotoKaryawan" ref="fileKaryawan"></v-file-input>
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
    name: 'karyawan-list',
    data() {
        return {
            userLogin: JSON.parse(localStorage.getItem('userLogin')),
            loadingScreen: true,
            statuses: ['Aktif', 'Izin', 'Tidak Aktif'],
            previewImgLogo: '',
            inputType: 'Tambah',
            dialogConfirmDelete: false,
            dialogDetail: false,
            dialogAddEdit: false,
            jabatan_list: [],
            karyawan: new FormData(),
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
                jabatan: '',
                nama: '',
                no_telp: '',
                username: '',
                gaji: '',
                foto: '',
                status: '',
            },
            form: {
                jabatan: '',
                nama: '',
                no_telp: '',
                username: '',
                password: '',
                gaji: '',
                foto: '',
                status: '',
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
                { text: "Jabatan", value: "jabatan.nama" },
                { text: "Nama", value: "nama" },
                { text: "Nomor Telepon", value: "no_telp", filterable:false, sortable: false },
                { text: "Gaji", value: "gaji" },
                { text: "Foto", value: "foto", filterable: false, sortable: false },
                { text: "Status", value: "status", width: '10%' },
                { text: "Aksi", value: "actions", sortable: false },
            ];

            this.axioData();
            this.axioJabatan();
        },

        axioData() {
            let url = this.$api + '/karyawan';
            this.$http.get(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then(response => {
                this.list.datas = response.data.data;
                setTimeout(() =>{
                    this.loadingScreen = false;
                }, 300);
            });
        },

        axioJabatan(){
            let url = this.$api + '/list-selection-jabatan';
            this.$http.get(url, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then(response => {
                if(response.status == 200){
                    let data = JSON.parse(JSON.stringify(response.data));
                    data.forEach((item)=>{
                        let dashboard = item;
                        dashboard.text = item.nama
                        dashboard.value = item.id
                        this.jabatan_list.push(dashboard);
                    });
                }
            });
        },

        saveData(){
            this.karyawan.append('jabatan_id', this.form.jabatan_id);
            this.karyawan.append('nama', this.form.nama);
            this.karyawan.append('no_telp', this.form.no_telp);
            this.karyawan.append('username', this.form.username);
            this.karyawan.append('gaji', this.form.gaji);
            this.karyawan.append('status', this.form.status);

            var foto_karyawan = document.getElementById('fotoKaryawan'), dataFotoKaryawan = foto_karyawan.files[0];
            this.karyawan.append('foto', dataFotoKaryawan);

            this.loadingScreen = true;
            var url = this.$api + '/karyawan';
            this.$http.post(url, this.karyawan, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then((response) => {
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
            data.append('jabatan_id', this.form.jabatan_id);
            data.append('nama', this.form.nama);
            data.append('no_telp', this.form.no_telp);
            data.append('username', this.form.username);
            data.append('password', this.form.password);
            data.append('gaji', this.form.gaji);
            data.append('status', this.form.status);

            var foto_karyawan = document.getElementById('fotoKaryawan'), dataFotoKaryawan = foto_karyawan.files[0];

            if(dataFotoKaryawan){
                data.append('foto', dataFotoKaryawan);
            }

            this.loadingScreen = true;
            var url = this.$api + '/karyawan/' + this.editId;
            this.load = true;
            this.$http.post(url, data, {headers: {'Authorization' : 'Bearer ' + this.userLogin.token}}).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEdit = false
                this.axioData();
                this.cancelForm();
                this.inputType = 'Tambah';

                if(dataFotoKaryawan){
                    location.reload();
                }
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
            var url = this.$api + "/karyawan/" + id;
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
            this.formDetail.nama = item.nama
            this.formDetail.no_telp = item.no_telp
            this.formDetail.username = item.username
            if(!item.gaji || item.gaji <= 0){
                this.formDetail.gaji = "-"   
            } else{
                this.formDetail.gaji = this.formatRupiah(item.gaji, 'Rp')
            }
            this.formDetail.foto = item.foto
            this.formDetail.status = item.status
            if(item.jabatan){
                this.formDetail.jabatan = item.jabatan.nama
            } else{
                this.formDetail.jabatan = "-"
            }
            this.dialogDetail = true
        },

        editHandler(item) {
            this.inputType = 'Ubah';
            this.editId = item.uuid;
            this.form.jabatan_id = item.jabatan_id;
            this.form.nama = item.nama;
            this.form.no_telp = item.no_telp;
            this.form.username = item.username;
            this.form.password = item.password;
            this.form.gaji = item.gaji ?? 0;
            this.form.status = item.status;
            this.form.foto = item.foto;
            this.dialogAddEdit = true;
        },

        deleteHandler(item) {
            this.deleteId = item
            this.dialogConfirmDelete = true
        },

        clearForm(){
            this.form = {
                jabatan: '',
                nama: '',
                no_telp: '',
                username: '',
                password: '',
                gaji: '',
                foto: '',
                status: '',
            },
            this.$refs.fileKaryawan.reset();
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
    },
    computed:{
        formTitle() {
            return this.inputType;
        },
    },
}
</script>