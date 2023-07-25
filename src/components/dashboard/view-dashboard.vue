<template>

    <v-main class="list">
        <loading-screen :value="loadingScreen"></loading-screen>
        <h1 class="page-custom-title">DASHBOARD</h1>
        <v-layout justify>
            <v-flex xs5>
                <v-select v-model="form.bulan" :items="bulan_list" label="Bulan"></v-select>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs6>
                <v-select v-model="form.tahun" :items="tahun_list" label="Tahun"></v-select>
            </v-flex>
        </v-layout>
        <v-layout justify wrap>
            <v-flex md6 sm6 xs12 class="pr-2 pb-2">
                <v-card>
                    <v-card-title><b>Pencucian Kendaraan</b></v-card-title>
                        <apex-chart width="100%" type="bar" :options="pencucianChartOptions" :series="pencucianChart.series"></apex-chart>  
                </v-card>
            </v-flex>
            <v-flex md6 sm6 xs12 class="pr-2 pb-2">
                <v-card>
                    <v-card-title><b>Penjualan Kedai</b></v-card-title>
                        <apex-chart 
                            width="100%" type="bar" :options="kedaiChartOptions" :series="kedaiChart.series">
                        </apex-chart>  
                </v-card>
            </v-flex>
        </v-layout>
        <v-snackbar v-model="snackbar.snackbarNotif" :color="snackbar.color" timeout="3000" bottom>{{ snackbar.error_message }}</v-snackbar>
    </v-main>

</template>

<style>
    .center {
        display: flex;
        justify-content: center;
        align-items: center;
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
import loadingScreen from '@/components/loading-screen.vue';

export default {
    components: {
        'loading-screen': loadingScreen,
    },
    name: 'dashboard-view',
    data() {
        return {
            loadingScreen: true,
            bulan_list: [
                { text: "Januari", value: 1 },
                { text: "Februari", value: 2 },
                { text: "Maret", value: 3 },
                { text: "April", value: 4 },
                { text: "Mei", value: 5 },
                { text: "Juni", value: 6 },
                { text: "Juli", value: 7 },
                { text: "Agustus", value: 8 },
                { text: "September", value: 9 },
                { text: "Oktober", value: 10 },
                { text: "November", value: 11 },
                { text: "December", value: 12 }
            ],
            tahun_list: [
                { text: "2021", value: 2021 },
                { text: "2022", value: 2022 },
                { text: "2023", value: 2023 },
                { text: "2024", value: 2024 },
                { text: "2025", value: 2025 },
            ],
            snackbar: {
                snackbarNotif: false,
                color: '',
                message: '',
            },
            form: {
                bulan: new Date().getMonth() + 1,
                tahun: new Date().getFullYear(),
            },
            pencucianChart: {
                series: [{
                    name: 'Jumlah Transaksi Pencucian',
                    data: [],
                }],
            },
            pencucianChartOptions: {
                noData:{
                    text: "Tidak Ada Data Tersedia",
                    align: "center",
                    verticalAlign: "middle",
                    offsetX: 0,
                    offsetY: 0,
                },
                chart: {
                    toolbar: {
                        show: false,
                    }
                },
                labels: [],
                yaxis:{
                    decimalsInFloat: 0,
                    labels: {
                        formatter: function (val) {
                            return val.toFixed(0);
                        }
                    },
                },
            },
            kedaiChart: {
                series: [{
                    name: 'Jumlah Transaksi Penjualan',
                    data: [],
                }],
            },
            kedaiChartOptions: {
                noData:{
                    text: "Tidak Ada Data Tersedia",
                    align: "center",
                    verticalAlign: "middle",
                    offsetX: 0,
                    offsetY: 0,
                },
                chart: {
                    toolbar: {
                        show: false,
                    }
                },
                labels: [],
                yaxis:{
                    decimalsInFloat: 0,
                    labels: {
                        formatter: function (val) {
                            return val.toFixed(0);
                        }
                    },
                },
            },
        }
    },
    created(){
        this.refreshChart();
    },
    methods: {
        refreshChart(){
            let urlPencucianChart = this.$api + '/chart/transaksi-pencucian?bulan=' + this.form.bulan + '&tahun=' + this.form.tahun;
            let urlKedaiChart = this.$api + '/chart/transaksi-kedai?bulan=' + this.form.bulan + '&tahun=' + this.form.tahun;

            this.getPencucianChart(urlPencucianChart);
            this.getKedaiChart(urlKedaiChart);
            setTimeout(() =>{
                this.loadingScreen = false;
            }, 300);
        },

        getPencucianChart(url){
            this.$http.get(url).then(response => {
                this.filterPencucianChart(response.data);
            });
        },

        getKedaiChart(url){
            this.$http.get(url).then(response => {
                this.filterKedaiChart(response.data);
            });
        },

        filterPencucianChart(data){
            this.pencucianChart.series.length = 0;
            this.pencucianChart.series.data = [];
            this.pencucianChartOptions.labels.length = 0;
            
            let isNull = true;
            
            let dataTotal = [];
            data.forEach(element => {
                let series = element.total;
                let label = element.formatTgl;

                dataTotal.push(series);
                this.pencucianChartOptions.labels.push(label);

                if(element.total !== 0) {
                    isNull = false;
                }
            });

            let insertData = {
                name: 'Jumlah Transaksi Pencucian',
                data: dataTotal,
            }
            this.pencucianChart.series.push(insertData);

            if (isNull === true) {
                this.pencucianChart.series = [];
                this.pencucianChartOptions.labels.length = 0;
            }
        },

        filterKedaiChart(data){
            this.kedaiChart.series.length = 0;
            this.kedaiChartOptions.labels.length = 0;
            let isNull = true;

            let dataTotal = [];
            data.forEach(element => {
                let series = element.total;
                let label = element.formatTgl;
                
                dataTotal.push(series);
                this.kedaiChartOptions.labels.push(label);

                if(element.total !== 0) {
                    isNull = false;
                }
            });

            let insertData = {
                name: 'Jumlah Transaksi Penjualan',
                data: dataTotal,
            }
            this.kedaiChart.series.push(insertData);

            if (isNull === true) {
                this.kedaiChart.series = [];
                this.kedaiChartOptions.labels.length = 0;
            }
        },
    },
    mounted(){
        
    },
    watch: {
        'form.bulan'(){
            this.loadingScreen = true;
            this.refreshChart();
        },

        'form.tahun'(){
            this.loadingScreen = true;
            this.refreshChart();
        },
    },
    computed:{

    },
}
</script>