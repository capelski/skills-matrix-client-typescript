<template>
    <div id="app" class="container">
        <navbar/>
        <router-view :key="$route.fullPath">
        </router-view>
        <hr />
        <footer>
            <p>&#169; 2017 - Skills Matrix</p>
        </footer>
    </div>
</template>

<script lang="ts">
    import Navbar from '@/components/Navbar.vue';

    export default {
        name: 'app',
        components: {
            Navbar
        }
    };
</script>

<style>
    @import '../node_modules/font-awesome/css/font-awesome.min.css';
    @import '../node_modules/spinkit/css/spinkit.css';
    @import '../node_modules/toastr/build/toastr.min.css';
    @import '../node_modules/basicmodal/dist/basicModal.min.css';
    @import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

    @import '../static/css/bootstrap-fixes.css';
    @import '../static/css/generics.css';
    @import '../static/css/loading-animations.css';
    @import '../static/css/paginated-list.css';
</style>

