export interface FilterOptions {
    modes: string | undefined
    authModes: string[]
    tags: string[] | undefined
}

// 默认筛选器
export const defaultFilterOptions: FilterOptions = {
    modes: undefined,
    authModes: [],
    tags: undefined,
}
