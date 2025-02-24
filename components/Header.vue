<script setup lang="ts">
import lang from '../languages/index'
import Logo from '../assets/logo.webp'
import { ref, onMounted } from 'vue'
import { ServerAPI_Token } from '../hooks/api'
import { useRequest } from 'alova/client'
import type { User } from '../hooks/type_models'
import { useNotification, type NotificationType } from 'naive-ui'
const { data, onSuccess } = useRequest(ServerAPI_Token.Get<User>('/v1/me'))
const notification = useNotification()
const Notify = (info: {
    type: NotificationType
    content: string
    meta: string
    duration: number
}) =>
    notification[info.type]({
        content: info.content,
        meta: info.meta,
        duration: info.duration,
        keepAliveOnHover: true,
    })
const avatar = ref(Logo)
const username_or_email = ref('')
const token_status = ref(false)
onMounted(() => {
    const token = localStorage.getItem('token')
    onSuccess(() => {
        if (token) {
            if (data.value.code == 200) {
                token_status.value = true
                avatar.value = data.value.avatar_url
                username_or_email.value = data.value.username_or_email
            }
            if (data.value.code == 401) {
                localStorage.removeItem('token')
                Notify({
                    type: 'warning',
                    content: '你的登录 失 效 啦 !',
                    duration: 2000,
                    meta: '你是不是需要重新去登录了？',
                })
            }
        }
    })
})
</script>

<template>
    <div class="c_header">
        <div class="logo">
            <img src="/logo.webp" />
            <h2>
                {{ lang.NavBar.title }}
            </h2>
        </div>
        <div class="account">
            <n-avatar size="medium" :src="avatar" />
            <NuxtLink
                class="login"
                to="/user"
                v-if="token_status"
                v-text="username_or_email"
            ></NuxtLink>
            <NuxtLink class="login" to="/auth" v-else>登录</NuxtLink>
        </div>
    </div>
</template>

<style scoped lang="less">
.c_header {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    justify-content: space-between;
    .logo {
        display: flex;
        gap: 1rem;
        align-items: center;
        height: 2rem;

        img {
            height: 100%;
        }
    }

    .account {
        display: flex;
        gap: 1rem;
        align-items: center;
        height: 2rem;

        img {
            height: 100%;
        }

        .login {
            font-size: 1rem;
        }
    }
}
</style>
