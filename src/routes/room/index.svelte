<script context="module">
  import { v4 } from 'uuid';
  export async function preload() {
    this.redirect(200, `room/${v4()}`);
    console.log('redirected to new random room');
  }
</script>
