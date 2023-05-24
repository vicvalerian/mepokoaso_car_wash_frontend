<template>

    <v-main class="list">
        <h1 class="page-custom-title">DATA KENDARAAN</h1>
        <v-card>
            <v-card-title>
                <v-flex xs3>
                    <v-select class="mr-4" label="Pilih jenis kendaraan" :items="jenis_kendaraan_list" v-model="filter.search" single-line hide-details clearable></v-select>
                </v-flex>
                <v-flex xs3>
                    <v-text-field v-model="list.search" append-icon="mdi-magnify" label="Cari kendaraan" single-line hide-details></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-btn dense class="btn-add-data" @click="dialogAddEdit=true">Tambah Data</v-btn>

            </v-card-title>

            <v-data-table :headers="list.headers" :items="list.datas" :search="list.search" class="elevation-1">
                <template v-slot:[`item.harga`]="{ item }">
                    <template>{{ formatRupiah(item.harga, 'Rp') }}</template>
                </template>
                <template v-slot:[`item.jenis_kendaraan.nama`]="{ item }">
                    <template v-if="item.jenis_kendaraan">{{ item.jenis_kendaraan.nama }}</template>
                    <template v-else>-</template>
                </template>
                <template v-slot:[`item.foto`]="{ item }">
                    <v-img :src="$baseUrl+'/storage/'+item.foto" height="30px" width="30px" style="object-fit:cover; border-radius:50%; padding: 15px 0;"/>
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
                    <span class="headline white--text">Hapus Data Kendaraan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <span >Apakah anda yakin ingin menghapus data kendaraan ini?</span>
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
                    <span class="headline white--text">Detail Data Kendaraan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-content">
                    <v-container fluid>
                        <v-layout justify-center>
                            <v-flex xs12>
                                <div class="row">
                                    <div class="mr-8">
                                        <v-img contain width="300px" :src="previewImgLogo == '' ? $baseUrl+'/storage/'+formDetail.foto : previewImgLogo" style="object-fit:cover;"></v-img>
                                    </div>
                                    <div>
                                        <v-text-field v-model="formDetail.nama" label="Nama Kendaraan" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.jenis_kendaraan" label="Jenis Kendaraan" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.harga" label="Harga Kendaraan" readonly></v-text-field>
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
                    <span class="headline white--text">{{formTitle}} Data Kendaraan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <v-container v-if="inputType == 'Tambah'">
                        <v-select :items="jenis_kendaraan_list" v-model="form.jenis_kendaraan_id" label="Jenis Kendaraan" item-value="id" item-text="nama" clearable required></v-select>
                        <v-text-field v-model="form.nama" label="Nama Kendaraan" required></v-text-field>
                        <v-text-field v-model="form.harga" label="Harga Kendaraan" required></v-text-field>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Foto Kendaraan" id="fotoKendaraan" ref="fileKendaraan"></v-file-input>
                    </v-container>
                    <v-container v-else>
                        <v-select :items="jenis_kendaraan_list" v-model="form.jenis_kendaraan_id" label="Jenis Kendaraan" item-value="id" item-text="nama" required></v-select>
                        <v-text-field v-model="form.nama" label="Nama Jenis Kendaraan" required></v-text-field>
                        <v-text-field v-model="form.harga" label="Harga Kendaraan" required></v-text-field>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Foto Kendaraan" id="fotoKendaraan" ref="fileKendaraan"></v-file-input>
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

export default {
    name: 'kendaraan-list',
    data() {
        return {
            previewImgLogo: '',
            inputType: 'Tambah',
            dialogConfirmDelete: false,
            dialogDetail: false,
            dialogAddEdit: false,
            jenis_kendaraan_list: [],
            kendaraan: new FormData(),
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
                harga: '',
                foto: '',
                jenis_kendaraan: '',
            },
            form: {
                jenis_kendaraan_id: '',
                nama: '',
                harga: '',
                foto: '',
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
                { text: "Jenis Kendaraan", value: "jenis_kendaraan.nama" },
                { text: "Nama Kendaraan", value: "nama" },
                { text: "Harga", value: "harga", filterable:false },
                { text: "Foto", value: "foto", filterable: false, sortable: false },
                { text: "Aksi", value: "actions", sortable: false },
            ];

            this.axioData();
            this.axioJenisKendaraan();
        },

        axioData() {
            let url = this.$api + '/kendaraan?jenis=' + this.filter.search;
            this.$http.get(url).then(response => {
                this.list.datas = response.data.data;
            });
        },

        axioJenisKendaraan(){
            let url = this.$api + '/list-selection-jenis-kendaraan';
            this.$http.get(url).then(response => {
                if(response.status == 200){
                    let data = JSON.parse(JSON.stringify(response.data));
                    data.forEach((item)=>{
                        let dashboard = item;
                        dashboard.text = item.nama
                        dashboard.value = item.nama
                        this.jenis_kendaraan_list.push(dashboard);
                    });
                }
            });
        },

        saveData(){
            this.kendaraan.append('jenis_kendaraan_id', this.form.jenis_kendaraan_id);
            this.kendaraan.append('nama', this.form.nama);
            this.kendaraan.append('harga', this.form.harga);

            var logo_kendaraan = document.getElementById('fotoKendaraan'), dataFotoKendaraan = logo_kendaraan.files[0];
            this.kendaraan.append('foto', dataFotoKendaraan);

            var url = this.$api + '/kendaraan';
            this.$http.post(url, this.kendaraan).then((response) => {
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
                this.dialogAddEdit = false
            });
        },

        updateData(){
            var data = new FormData();
            data.append('jenis_kendaraan_id', this.form.jenis_kendaraan_id);
            data.append('nama', this.form.nama);
            data.append('harga', this.form.harga);

            var logo_kendaraan = document.getElementById('fotoKendaraan'), dataFotoKendaraan = logo_kendaraan.files[0];

            if(dataFotoKendaraan){
                data.append('foto', dataFotoKendaraan);
            }

            var url = this.$api + '/kendaraan/' + this.editId;
            this.load = true;
            this.$http.post(url, data).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEdit = false
                this.axioData();
                this.cancelForm();
                this.inputType = 'Tambah';

                if(dataFotoKendaraan){
                    location.reload();
                }
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEdit = false
            });
        },

        deleteData(){
            let id = this.deleteId;
            var url = this.$api + "/kendaraan/" + id;
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
            this.formDetail.nama = item.nama
            this.formDetail.harga = this.formatRupiah(item.harga, 'Rp')
            this.formDetail.foto = item.foto
            if(item.jenis_kendaraan){
                this.formDetail.jenis_kendaraan = item.jenis_kendaraan.nama
            } else{
                this.formDetail.jenis_kendaraan = "-"
            }
            this.dialogDetail = true
        },

        editHandler(item) {
            this.inputType = 'Ubah';
            this.editId = item.id;
            this.form.jenis_kendaraan_id = item.jenis_kendaraan_id;
            this.form.nama = item.nama;
            this.form.harga = item.harga;
            this.form.foto = item.foto;
            this.dialogAddEdit = true;
        },

        deleteHandler(item) {
            this.deleteId = item
            this.dialogConfirmDelete = true
        },

        clearForm(){
            this.form = {
                jenis_kendaraan_id: '',
                nama: '',
                harga: '',
                foto: '',
            };
            this.$refs.fileKendaraan.reset();
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