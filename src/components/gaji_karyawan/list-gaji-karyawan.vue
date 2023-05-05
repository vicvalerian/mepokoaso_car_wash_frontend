<template>

    <v-main class="list">
        <h1 class="page-custom-title">DATA GAJI KARYAWAN</h1>
        <v-card>
            <v-card-title>
                <v-flex xs3>
                    <v-select class="mr-4" label="Pilih Karyawan" :items="karyawan_list" v-model="filter.search" item-value="nama" item-text="nama" single-line hide-details clearable></v-select>
                </v-flex>
                <v-flex xs3>
                    <v-text-field v-model="list.search" append-icon="mdi-magnify" label="Cari gaji karyawan" single-line hide-details></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-btn dense class="btn-add-data" @click="dialogAddEdit=true">Sinkronisasi Gaji</v-btn>

            </v-card-title>

            <v-data-table :headers="list.headers" :items="list.datas" :search="list.search" class="elevation-1">
                <template v-slot:[`item.total_gaji_bersih`]="{ item }">
                    <template v-if="item.total_gaji_bersih <= 0"><b class="red--text">{{ formatRupiah(item.total_gaji_bersih, 'Rp') }}</b></template>
                    <template v-else><b class="green--text">{{ formatRupiah(item.total_gaji_bersih, 'Rp') }}</b></template>
                </template>
                <template v-slot:[`item.status`]="{ item }">
                    <v-chip v-if="item.status === 'Utang'" color="red" outlined>{{ item.status }}</v-chip>
                    <v-chip v-if="item.status === 'Belum Diterima'" color="orange" outlined>{{ item.status }}</v-chip>
                    <v-chip v-if="item.status === 'Lunas'" color="green" outlined>{{ item.status }}</v-chip>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon dense color="#316291" @click="detailHandler(item)" class="data-table-icon">mdi-information</v-icon>
                    <v-icon dense color="#316291" @click="editHandler(item)" class="data-table-icon">mdi-pencil</v-icon>
                </template>
                <template v-slot:no-data>
                  <div color="white" class="red--text" icon="warning"><b>Maaf, tidak ada data tersedia.</b></div>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialogDetail" persistent max-width="600px">
            <v-card>
                <v-card-title class="dialog-confirm-title">
                    <span class="headline white--text">Detail Data Gaji Karyawan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-content">
                    <v-container fluid>
                        <v-layout justify-center>
                            <v-flex xs12>
                                <div>
                                    <div>
                                        <v-text-field v-model="formDetail.karyawan" label="Nama Karyawan" readonly></v-text-field>
                                        <v-layout justify>
                                            <v-flex xs5>
                                                <v-text-field v-model="formDetail.bulan" label="Bulan Gaji" readonly></v-text-field>
                                            </v-flex>
                                            <v-spacer></v-spacer>
                                            <v-flex xs6>
                                                <v-text-field v-model="formDetail.tahun" label="Tahun Gaji" readonly></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-text-field v-model="formDetail.total_gaji_kotor" label="Total Gaji Kotor" readonly ></v-text-field>
                                        <v-text-field v-model="formDetail.total_utang" label="Total Utang" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.total_gaji_bersih" label="Total Gaji Bersih" readonly></v-text-field>
                                        <v-text-field v-model="formDetail.status" label="Status Gaji" readonly></v-text-field>
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
                    <span class="headline white--text">{{formTitle}} Data Gaji Karyawan</span>
                </v-card-title>
                <v-card-text class="dialog-confirm-text">
                    <v-container v-if="inputType == 'Sync'">
                        <v-select :items="karyawan_list" v-model="form.karyawan_id" label="Pilih Karyawan" item-value="id" item-text="nama" required></v-select>
                        <v-select :items="select_bulan" label="Pilih Bulan" v-model="form.bulan"></v-select>
                        <v-select :items="select_tahun" label="Pilih Tahun" v-model="form.tahun"></v-select>
                    </v-container>
                    <v-container v-else>
                        <v-select :items="karyawan_list" v-model="form.karyawan_id" label="Nama Karyawan" item-value="id" item-text="nama" readonly required></v-select>
                        <v-layout justify>
                            <v-flex xs5>
                                <v-select :items="select_bulan" label="Bulan" v-model="form.bulan" readonly></v-select>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs6>
                                <v-select :items="select_tahun" label="Tahun" v-model="form.tahun" readonly></v-select>
                            </v-flex>
                        </v-layout>
                        <v-text-field v-model="form.total_gaji_kotor" label="Total Gaji Kotor" readonly ></v-text-field>
                        <v-text-field v-model="form.total_utang" label="Total Utang" readonly></v-text-field>
                        <v-text-field v-model="form.total_gaji_bersih" label="Total Gaji Bersih" readonly></v-text-field>
                        <v-select :items="statuses" label="Pilih Status" v-model="form.status"></v-select>
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
    name: 'gaji-karyawan-list',
    data() {
        return {
            inputType: 'Sync',
            dialogDetail: false,
            dialogAddEdit: false,
            karyawan_list: [],
            select_bulan: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
            select_tahun: [2021, 2022, 2023, 2024, 2025],
            statuses: ['Belum Diterima', 'Utang', 'Lunas'],
            menuKedai: new FormData(),
            editId: '',
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
                karyawan: '',
                bulan: '',
                tahun: '',
                total_gaji_kotor: '',
                total_utang: '',
                total_gaji_bersih: '',
                status: '',
            },
            form: {
                karyawan_id: '',
                bulan: '',
                tahun: '',
                total_gaji_kotor: '',
                total_utang: '',
                total_gaji_bersih: '',
                status: '',
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
            if (this.inputType !== 'Sync') {
                this.updateData();
            } else {
                this.syncData();
            }
        },

        onPreviewImage(e) {
            this.previewImgLogo = URL.createObjectURL(e)
        },

        initialize(){
            this.list.headers = [
                { text: "Nama Karyawan", value: "karyawan.nama" },
                { text: "Bulan", value: "bulan" },
                { text: "Tahun", value: "tahun" },
                { text: "Total Gaji", value: "total_gaji_bersih" },
                { text: "Status", value: "status" },
                { text: "Aksi", value: "actions", sortable: false },
            ];

            this.axioData();
            this.axioKaryawan();
        },

        axioData() {
            let url = this.$api + '/gaji-karyawan?karyawan=' + this.filter.search;
            this.$http.get(url).then(response => {
                this.list.datas = response.data.data;
            });
        },

        axioKaryawan(){
            let url = this.$api + '/list-selection-karyawan';
            this.$http.get(url).then(response => {
                if(response.status == 200){
                    let data = JSON.parse(JSON.stringify(response.data));
                    data.forEach((item)=>{
                        let dashboard = item;
                        dashboard.text = item.nama
                        dashboard.value = item.id
                        this.karyawan_list.push(dashboard);
                    });
                }
            });
        },

        syncData(){
            var url = this.$api + '/gaji-karyawan?karyawan_id=' + this.form.karyawan_id + '&bulan=' + this.form.bulan + '&tahun=' + this.form.tahun;
            this.$http.post(url).then((response) => {
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
            let data = {
                "status": this.form.status,
            }

            var url = this.$api + '/gaji-karyawan/status/' + this.editId;
            this.load = true;
            this.$http.put(url, data).then((response) => {
                this.snackbar.error_message = response.data.message;
                this.snackbar.color = "green";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEdit = false
                this.axioData();
                this.cancelForm();
                this.inputType = 'Sync';
            })
            .catch((error) => {
                this.snackbar.error_message = error.response.data.message;
                this.snackbar.color = "red";
                this.snackbar.snackbarNotif = true;
                this.dialogAddEdit = false
            });
        },

        detailHandler(item){
            this.formDetail.karyawan = item.karyawan.nama;
            this.formDetail.bulan = item.bulan;
            this.formDetail.tahun = item.tahun;
            this.formDetail.total_gaji_kotor = this.formatRupiah(item.total_gaji_kotor, 'Rp');
            this.formDetail.total_utang = this.formatRupiah(item.total_utang, 'Rp');
            this.formDetail.total_gaji_bersih = this.formatRupiah(item.total_gaji_bersih, 'Rp');
            this.formDetail.status = item.status;
            this.dialogDetail = true
        },

        editHandler(item) {
            this.inputType = 'Ubah';
            this.editId = item.id;
            this.form.karyawan_id = item.karyawan_id;
            this.form.bulan = item.bulan;
            this.form.tahun = item.tahun;
            this.form.total_gaji_kotor = item.total_gaji_kotor;
            this.form.total_utang = item.total_utang;
            this.form.total_gaji_bersih = item.total_gaji_bersih;
            this.form.status = item.status;
            this.dialogAddEdit = true;
        },

        clearForm(){
            this.form = {
                karyawan_id: '',
                bulan: '',
                tahun: '',
                total_gaji_kotor: '',
                total_utang: '',
                total_gaji_bersih: '',
                status: '',
            };
        },

        cancelForm(){
            this.clearForm()
            this.dialogAddEdit = false
            this.inputType = 'Sync'
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