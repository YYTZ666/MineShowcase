<template>
    <div class="layout">
        <header class="header">
            <Header />
        </header>
        <main class="main-content">
            <slot />
        </main>
    </div>
</template>

<style lang="less" scoped>
@import '../assets/css/default.less';
</style>
