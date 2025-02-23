<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { ServerAPI } from '../../hooks/api'
import { useRequest } from 'alova/client'
import reCaptcha from '../../components/Recaptcha/ReCaptchaV3.vue'
import type { SiteKey, Login } from '../../hooks/type_models'
import type { FormItemRule, NotificationType } from 'naive-ui'
import { useNotification } from 'naive-ui'
// 通知组件构造函数
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

const RegToken = defineProps<{ token?: string }>()

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

const { data: SiteKey } = useRequest(
    ServerAPI.Get<SiteKey>('/v1/reCAPTCHA_site_key'),
)

const site_key = ref('')

const handleMailSubmit = () => {
    // 发送请求到后端验证reCaptcha、邮箱
    const { data } = useRequest(
        ServerAPI.Post<Login>('/v1/verifyemail', {
            email: form.value.email,
            captcha_response: site_key.value,
        }),
    ).onSuccess(() => {
        if (data.value.code == 200) {
            Notify({
                type: 'success',
                content: '验证邮件已发送',
                meta: '请及时检查邮箱是否收到验证邮件',
                duration: 2000,
            })
        }
    })
}

const VerifyEmail = ref({
    regstatus: false,
    detail: '',
    style: { color: 'black' },
})

onMounted(() => {
    // 挂载组件后检查URL是否为验证态
    if (RegToken.token) {
        const { data } = useRequest(
            ServerAPI.Post<SiteKey>(`/v1/verify/${RegToken.token}`),
        ).onSuccess(() => {
            // 邮箱验证
            if (data.value.code == 200) {
                VerifyEmail.value.regstatus = data.value.success
                VerifyEmail.value.detail = `ヾ(^▽^*))) ${data.value.detail}`
                VerifyEmail.value.style.color = 'green'
                Notify({
                    type: 'success',
                    content: '邮箱验证通过',
                    meta: '邮箱验证成功,请填写详细信息',
                    duration: 2000,
                })
            } else {
                VerifyEmail.value.detail = `〒▽〒 ${data.value.detail}`
                VerifyEmail.value.style.color = 'red'
            }
        })
    }
})

const RegRules = {
    display_name: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
    ],
    f_password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        },
    ],
    s_password: [
        {
            required: true,
            validator(rule: FormItemRule, value: string) {
                if (!value) {
                    return new Error('请再次输入密码')
                } else if (RegForm.value.f_password !== value) {
                    return new Error('两次输入的密码不一致')
                } else {
                    return true
                }
            },
            trigger: 'blur',
        },
    ],
}

const RegForm = ref({
    f_password: '',
    s_password: '',
    display_name: '',
    avatar: undefined,
})

const handleRegSubmit = () => {
    if (VerifyEmail.value.regstatus) {
        console.log('awa')
        if (RegForm.value.f_password == RegForm.value.s_password) {
            const { data } = useRequest(
                ServerAPI.Post('/v1/register', {
                    request: {
                        captcha_response: site_key.value,
                        password: RegForm.value.s_password,
                        display_name: RegForm.value.display_name,
                        token: RegToken.token,
                    },
                    avatar: RegForm.value.avatar,
                }),
            ).onSuccess(() => {
                if (data.value.code == 200) {
                    Notify({
                        type: 'success',
                        content: '已成功注册！',
                        meta: '请用新的账户密码登录网站',
                        duration: 2000,
                    })
                }
            })
        }
    }
}
</script>

<template>
    <h2>注册</h2>
    <n-form :model="RegForm" :rules="RegRules" v-if="RegToken.token">
        <p :style="VerifyEmail.style">{{ VerifyEmail.detail }}！</p>
        <n-form-item path="display_name" label="用户名">
            <n-input
                v-model:value="RegForm.display_name"
                @keydown.enter.prevent
            />
        </n-form-item>
        <n-form-item path="f_password" label="密码">
            <n-input
                type="password"
                v-model:value="RegForm.f_password"
                @keydown.enter.prevent
            />
        </n-form-item>
        <n-form-item path="s_password" label="再次输入密码">
            <n-input
                type="password"
                v-model:value="RegForm.s_password"
                @keydown.enter.prevent
            />
        </n-form-item>
        <n-row :gutter="[0, 24]">
            <n-col :span="24">
                <div style="display: flex; justify-content: flex-end">
                    <reCaptcha
                        v-if="SiteKey"
                        v-model="site_key"
                        @loaded="isLoaded"
                        :siteKey="SiteKey.recapcha_sitekey"
                        action="submit"
                    >
                        <n-button
                            type="primary"
                            :loading="site_key == '' || RegToken == undefined"
                            @click="handleRegSubmit()"
                        >
                            注册
                        </n-button>
                    </reCaptcha>
                    <n-button v-else type="primary" :loading="true">
                        加载中...
                    </n-button>
                </div>
            </n-col>
        </n-row>
    </n-form>
    <n-form :model="form" :rules="rules" v-else>
        <n-form-item path="email" label="邮箱">
            <n-input v-model:value="form.email" @keydown.enter.prevent />
        </n-form-item>
        <n-row :gutter="[0, 24]">
            <n-col :span="24">
                <div style="display: flex; justify-content: flex-end">
                    <reCaptcha
                        v-if="SiteKey"
                        v-model="site_key"
                        @loaded="isLoaded"
                        :siteKey="SiteKey.recapcha_sitekey"
                        action="submit"
                    >
                        <n-button
                            type="primary"
                            :loading="site_key == ''"
                            @click="handleMailSubmit()"
                        >
                            验证并继续
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
