<template>
    <div class="c_header">
        <div class="logo">
            <img src="/logo.webp" />
            <h2>MineShowcase</h2>
        </div>
    </div>
</template>

<style scoped lang="less">
.c_header {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;

    .logo {
        display: flex;
        gap: 1rem;
        align-items: center;
        height: 2rem;
        img {
            height: 100%;
        }
    }
}
</style>