<script setup lang="ts">
import { ref } from 'vue'
import { ServerAPI } from '../../hooks/api'
import { useRequest } from 'alova/client'
import reCaptcha from '../../components/Recaptcha/ReCaptchaV3.vue'
import type { SiteKey, Login } from '../../hooks/type_models'

const form = ref({
    email: '',
})

const rules = {
    email: [
        {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
        },
    ],
}

const isLoaded = ref(false)

const getSiteKey = () => ServerAPI.Get<SiteKey>('/v1/reCAPTCHA_site_key')
const { data } = useRequest(getSiteKey())
const login = (data: {
    username: string
    password: string
    captcha_response: string
}) => ServerAPI.Post<Login>('/v1/login', data)

const token = ref('')

const handleSubmit = () => {
    // 发送请求到后端验证reCaptcha、用户名和密码
    const { data, onSuccess } = useRequest(
        login({
            username: form.value.account,
            password: form.value.password,
            captcha_response: token.value,
        }),
    )
    onSuccess(() => {
        // 登录成功，保存token
        if (data.value.access_token) {
            localStorage.setItem('token', data.value.access_token)
            location.href = '/'
        }
    })
}
</script>

<template>
    <h2>注册</h2>
    <n-form :model="form" :rules="rules">
        <n-form-item path="email" label="邮箱">
            <n-input v-model:value="form.email" @keydown.enter.prevent />
        </n-form-item>
        <n-row :gutter="[0, 24]">
            <n-col :span="24">
                <div style="display: flex; justify-content: flex-end">
                    <reCaptcha
                        v-if="data"
                        v-model="token"
                        @loaded="isLoaded"
                        :siteKey="data.recapcha_sitekey"
                        action="submit"
                    >
                        <n-button
                            type="primary"
                            :loading="token == ''"
                            @click="handleSubmit()"
                        >
                            验证
                        </n-button>
                    </reCaptcha>
                    <n-button v-else type="primary" :loading="true">
                        加载中...
                    </n-button>
                </div>
            </n-col>
        </n-row>
    </n-form>
</template>
