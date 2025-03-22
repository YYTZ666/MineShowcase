<script setup lang="ts">
import config from '~/package.json'
import Logo from '@/assets/logo.svg'
const title = useState<string>('pageTitle')
title.value = '关于 MineShowcase'
useHead({
    title: title,
})

const commitHash = process.env.NUXT_PUBLIC_COMMIT_HASH
    ? process.env.NUXT_PUBLIC_COMMIT_HASH.slice(0, 8)
    : 'dev build'
</script>

<template>
    <div class="about-box">
        <div class="logo-box">
            <img class="logo-img" :src="Logo" />
            <div class="logo-title">
                <h1>MineShowcase</h1>
                <div class="ver">
                    Version: {{ config.version }} ({{ commitHash }})
                </div>
                <div class="icons">
                    <a-tooltip title="项目 Github 仓库">
                        <a
                            href="https://github.com/MSCPO/MineShowcase"
                            class="icon"
                        >
                            <GithubOutlined />
                        </a>
                    </a-tooltip>

                    <a-tooltip title="玩家交流群">
                        <a href="https://qm.qq.com/q/SHcbys4Scw" class="icon">
                            <QqOutlined />
                        </a>
                    </a-tooltip>
                </div>
            </div>
        </div>

        <a-card title="关于 MineShowcase">
            <p>
                MineShowcase 是一个以 MSCPO/ServerAPI 作为后端的 MSCPO
                开源宣传平台
            </p>
            <p>此项目基于 Vue 3 语言，以及 Nuxt 3 框架</p>
            <p>MineShowcase © 2025 MSCPO 保留所有权利。</p>
        </a-card>
    </div>
</template>

<style scoped lang="less">
@import '@/assets/css/variables.less';
.about-box {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    padding: 1rem;
    .logo-box {
        display: flex;
        padding: 4rem;
        .logo-img {
            width: 8rem;
        }
        .logo-title {
            color: @text-color-light;
            display: flex;
            line-height: 1rem;
            flex-direction: column;
            padding-inline: 1rem;
            @media (prefers-color-scheme: dark) {
                color: @text-color-dark;
            }
            .icons {
                width: 100%;
                padding-top: 1rem;
                display: flex;
                justify-content: center;
                gap: 1rem;
                .icon {
                    color: @text-color-light;
                    @media (prefers-color-scheme: dark) {
                        color: @text-color-dark;
                    }
                    width: 32px;
                    height: 32px;
                    border-radius: 1rem;
                    word-break: break-all;
                    text-decoration: none;
                    display: flex;
                    justify-content: center;
                    cursor: pointer;
                    align-items: center;
                    font-size: 1.5rem;
                    text-align: center;
                    transition: all 0.3s ease;
                    &:hover {
                        background: @hover-primary;
                        transform: scale(1.2);
                    }
                }
            }
        }
    }
}
</style>
