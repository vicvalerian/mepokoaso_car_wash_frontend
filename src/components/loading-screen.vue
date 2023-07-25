<template>
    <div class="">
        <v-overlay v-model="overlay">
            <img src="@/assets/loading.svg" height="150px">
        </v-overlay>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            required: true,
        },
    },
    data(){
        return {
            overlay: true,  
        }
    },
    watch: {
      value(val){
        if(!val){
            this.overlay = false;
        } else if(val && !this.overlay){
            this.overlay = true;
        }
      }
    }
};
</script>

<style>
/* Your component's styles go here */
</style>
