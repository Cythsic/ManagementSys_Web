<!-- <template>
  <div id="app">
    <Main></Main>
  </div>
</template>

<script>
import Main from './components/SeaialPort.vue'
export default {
  name: 'app',
  components: {
    Main
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
 -->
 
 <template>
   <div id="app">
     <router-view/>
   </div>
 </template>
 
 <script>
 export default {
   name: 'App'
 }
 </script>
 
 <style lang="less">
 .size{
   width: 100%;
   height: 100%;
 }
 html,body{
   .size;
   overflow: hidden;
   margin: 0;
   padding: 0;
 }
 #app {
   .size;
 }
 </style>
 