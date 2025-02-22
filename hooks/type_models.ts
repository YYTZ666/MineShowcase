/**
 * 数据模型
 * 此文件，定义了数据的类型以便于类型重用
 */

// 用户
export interface User {
    username: string
    email: string
    display_name: string
    avatar_url: string
    role: string
    is_active: boolean
    id: number
    created_at: string
    last_login: string
}

export interface Status {
    id: number
    name: string
    ip: string | null
    type: 'JAVA' | 'BEDROCK'
    version: string
    desc: string
    link: string
    is_member: boolean
    is_hide: boolean
    auth_mode: 'OFFLINE' | 'OFFICIAL' | 'YGGDRASIL'
    tags: Array<string>
    status: {
        players: {
            online: number
            max: number
        }
        delay: number
        version: string
        motd: {
            plain: string
            html: string
            minecraft: string
            ansi: string
        }
        icon: string | null
    } | null
    code: number
    detail?: string
}

export interface ListItem {
    name: string
    id: number
    type: 'JAVA' | 'BEDROCK'
    version: string
    desc: string
    link: string
    ip: string | null
    is_member: boolean
    is_hide: boolean
    auth_mode: 'OFFLINE' | 'OFFICIAL' | 'YGGDRASIL'
    tags: Array<string>
}

export interface SiteKey {
    recapcha_sitekey: string
}

export interface Login {
    access_token: string
    token_type: string
}
