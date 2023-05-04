<template>
    <v-main class="list">
        <v-app-bar app fixed height="80px" id="primary-bg">
            <v-app-bar-nav-icon class="ml-4">
                <img src="@/assets/logocarwash.png" height="75px">
            </v-app-bar-nav-icon>
            <v-toolbar-title class="text-center">
                <b class="white--text">MEPOKASO CAR WASH</b>
            </v-toolbar-title>
        </v-app-bar>
        <v-container fill-height>
            <v-layout row wrap>
            <!-- <v-layout row wrap justify-start> -->
                <v-flex xs12 align-self-end class="text-right">
                    <v-btn dense class="btn-confirm-delete right" @click="goToPencarian()">Kembali</v-btn>
                </v-flex>
                <v-flex xs12 class="mb-4">
                    <h1 class="page-custom-title">RIWAYAT PENCUCIAN MOBIL</h1>
                    <h4 class="page-custom-subtitle">Nomor Plat: {{ form.no_polisi }}</h4>
                    <h4 class="page-custom-subtitle">Jenis Kendaraan: {{ form.nama_kendaraan }}</h4>
                    <h4 class="page-custom-subtitle">Jumlah Transaksi: {{ form.jml_transaksi }}</h4>
                </v-flex>
                <v-timeline dense>
                    <template v-for="(item,index) in this.tamp_logs">
                        <v-timeline-item class="mb-12" :key="index" color="#316291" small>
                            <v-layout align-center justify-center>
                                <v-flex class="black--text">{{ item }}</v-flex>
                            </v-layout>
                        </v-timeline-item>
                    </template>
                </v-timeline>
            </v-layout>
        </v-container>
        <v-snackbar v-model="snackbar.snackbarNotif" :color="snackbar.color" timeout="3000" bottom>{{ snackbar.error_message }}</v-snackbar>
    </v-main>
</template>

<style>
    #img-login{
        max-width:40%;
        height:auto;
    }
    #login-contain{
        background:#303f9f;
    }
    #login-layout{
        padding:30px 7px 30px 7px;
        /* margin-top:30px; */
    }
    #login-btn{
        width:100%;
    }
    #primary-bg{
        background-color: #316291 !important;
    }
    .page-custom-title{
        margin: 24px 0px;
        text-align: left;
        color: black !important;
    }

    .page-custom-subtitle{
        text-align: left;
        color: black !important;
    }

    .btn-confirm-delete{
        background-color: #316291 !important;
        color: #FCFDEF !important;
        padding: 15px !important;
        text-align: center !important;
        font-size: 12px !important;
        border-radius: 15px !important;
    }
</style>

<script>

export default {
    name: 'login-view',

    created() {
        this.axioData();
    },

    data() {
        return {
            no_polisi: localStorage.getItem('no_polisi'),
            tamp_logs: [],
            form: {
                nama: '',
                no_polisi: '',
                jml_transaksi: '',
                transaksis: [],
            },
            snackbar: {
                snackbarNotif: false,
                color: '',
                message: '',
            },
        }
    },
    methods: {
        axioData(){
            let url = this.$api + '/riwayat/mobil-pelanggan?no_polisi=' + this.no_polisi;
            this.$http.get(url).then(response => {
                this.form = response.data.data;
                this.form.transaksis = response.data.data.transaksis;
                this.processTimelineItem();
            });
        },

        processTimelineItem(){
            for (let index = 0; index < this.form.transaksis.length; index++) {
                let text = '';
                text = 'Kendaraan melakukan pencucian pada tanggal ' + this.form.transaksis[index].formatTgl + ' pukul ' + this.form.transaksis[index].waktu_pencucian + ' WITA';
                this.tamp_logs.push(text);
            }
        },

        goToPencarian(){
            localStorage.removeItem('no_polisi');
            this.$router.push({
                name: 'Riwayat Pencucian Mobil',
            });
        }
    },

    mounted() {
        
    },
  }
</script>