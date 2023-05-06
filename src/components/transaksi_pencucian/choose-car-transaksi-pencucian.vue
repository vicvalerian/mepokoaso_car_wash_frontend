<template>

    <v-main class="list">
        <h1 class="page-custom-title">PILIH KENDARAAN</h1>
        <v-card>
            <v-card-text class="dialog-confirm-content">
                <v-container fluid>
                    <v-layout justify-center>
                        <v-flex xs12>
                            <div class="row">
                                <v-flex xs2>
                                    <v-item-group mandatory>
                                        <v-col v-for="(item, index) in jenis_kendaraan_list" :key="index">
                                            <v-item v-slot="{ active }">
                                                <v-card class="mt-4" width="150" height="160" :color="active ? '#BCBCBC' : ''" @click="axioKendaraan(item.nama)">
                                                    <v-card-title class="justify-center">
                                                        <v-img contain width="100" height="100" :src="previewImageUrl == '' ? $baseUrl+'/storage/'+item.logo : previewImageUrl" style="object-fit:cover;"></v-img>
                                                    </v-card-title>
                                                    <v-card-text>
                                                        {{ item.nama }}
                                                    </v-card-text>
                                                </v-card>
                                            </v-item>
                                        </v-col>
                                    </v-item-group>
                                </v-flex>
                                <v-spacer></v-spacer>
                                <v-flex xs10>
                                    <div class="container">
                                        <v-card class="mt-4" width="330" height="350" v-for="(item, index) in kendaraan_list" :key="index" @click="goToTambahPencucian(item)">
                                            <v-card-title class="justify-center">
                                                <v-img contain width="100" height="250" :src="previewImageUrl == '' ? $baseUrl+'/storage/'+item.foto : previewImageUrl" style="object-fit:cover;"></v-img>
                                            </v-card-title>
                                            <v-card-text>
                                                <b class="black--text" style="font-size: 16px">
                                                {{ item.nama }} <br>
                                                {{ formatRupiah(item.harga, 'Rp') }}
                                                </b>
                                            </v-card-text>
                                        </v-card>
                                    </div>
                                    
                                </v-flex>
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
    .container{
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: space-around;
        flex-wrap: wrap;
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

export default {
    name: 'transaksi-pencucian-choose-car',
    data() {
        return {
            jenis_kendaraan_list: [],
            kendaraan_list: [],
            previewImageUrl: '',
            init_jenis: '',
            snackbar: {
                snackbarNotif: false,
                color: '',
                message: '',
            },
        }
    },
    created(){
        this.initialize();
    },
    methods: {
        onPreviewImage(e) {
            this.previewImageUrl = URL.createObjectURL(e);
        },

        initialize(){
            this.axioJenisKendaraan();
        },

        axioJenisKendaraan(){
            let url = this.$api + '/list-card-jenis-kendaraan';
            this.$http.get(url).then(response => {
                this.jenis_kendaraan_list = response.data;
                this.init_jenis = this.jenis_kendaraan_list[0].nama;

                this.axioKendaraan(this.init_jenis)
            });
        },

        axioKendaraan(value){
            let url = this.$api + '/kendaraan?jenis=' + value;
            this.$http.get(url).then(response => {
                this.kendaraan_list = response.data.data;
                window.scrollTo(0,0);
            });
        },

        goToTambahPencucian(item){
            this.setPencucianCart(item);

            this.$router.push({
                name: 'Tambah Transaksi Pencucian',
            });
        },

        setPencucianCart(item){
            let parsed = {
                "kendaraan_id": item.id,
                "nama": item.nama,
                "tarif": item.harga,
            }
            localStorage.setItem('pencucianCart', JSON.stringify(parsed));
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

    },
}
</script>