<script lang="ts">
    export let middle = 0;
    export let side = 0;
    const cls = "as-end bg-success rounded";
    const style = (i) => `width:6px;height:${i}px;transition:width ease`;
</script>

<div class="m-0 p-0 d-flex ai-end item" style="height:12.5px">
    <div class={cls} style={style(side)} />
    <div class="{cls} mx-1" style={style(middle)} />
    <div class={cls} style={style(side)} />
</div>
