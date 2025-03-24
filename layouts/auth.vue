<template>
    <div class="layout">
        <header class="header">
            <Header />
        </header>
        <div class="content">
            <main class="main-content">
                <slot />
            </main>
        </div>
    </div>
</template>

<style lang="less">
@import '../assets/css/default.less';

.slide-enter-from,
.slide-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
    transform: translateY(0);
    opacity: 1;
}

.active {
    transform: translateX(0) !important;
}
</style>
