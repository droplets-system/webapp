import type {Action, Int64Type, NameType, UInt32Type, UInt64Type} from '@wharfkit/antelope'
import {ABI, Blob, BlockTimestamp, Int64, Name, Struct, UInt32, UInt64} from '@wharfkit/antelope'
import type {ActionOptions, ContractArgs, PartialBy, Table} from '@wharfkit/contract'
import {Contract as BaseContract} from '@wharfkit/contract'
export const abiBlob = Blob.from(
    'DmVvc2lvOjphYmkvMS4yAA8MYmFsYW5jZXNfcm93AAMFb3duZXIEbmFtZQVkcm9wcwVpbnQ2NAlyYW1fYnl0ZXMFaW50NjQEYmluZAACBW93bmVyBG5hbWUJZHJvcHNfaWRzCHVpbnQ2NFtdBWNsYWltAAEFb3duZXIEbmFtZQdkZXN0cm95AAQFb3duZXIEbmFtZQlkcm9wc19pZHMIdWludDY0W10EbWVtbwdzdHJpbmc/CXRvX25vdGlmeQVuYW1lPxRkZXN0cm95X3JldHVybl92YWx1ZQACEXVuYm91bmRfZGVzdHJveWVkBWludDY0D2J5dGVzX3JlY2xhaW1lZAVpbnQ2NAhkcm9wX3JvdwAEBHNlZWQGdWludDY0BW93bmVyBG5hbWUHY3JlYXRlZBRibG9ja190aW1lc3RhbXBfdHlwZQVib3VuZARib29sBmVuYWJsZQABB2VuYWJsZWQEYm9vbAhnZW5lcmF0ZQAFBW93bmVyBG5hbWUFYm91bmQEYm9vbAZhbW91bnQGdWludDMyBGRhdGEGc3RyaW5nCXRvX25vdGlmeQVuYW1lPxVnZW5lcmF0ZV9yZXR1cm5fdmFsdWUAAgpieXRlc191c2VkBWludDY0DWJ5dGVzX2JhbGFuY2UFaW50NjQIbG9nZHJvcHMABAVvd25lcgRuYW1lBmFtb3VudAVpbnQ2NAxiZWZvcmVfZHJvcHMFaW50NjQFZHJvcHMFaW50NjQLbG9ncmFtYnl0ZXMABAVvd25lcgRuYW1lBWJ5dGVzBWludDY0EGJlZm9yZV9yYW1fYnl0ZXMFaW50NjQJcmFtX2J5dGVzBWludDY0BG9wZW4AAQVvd25lcgRuYW1lCXN0YXRlX3JvdwAEB2dlbmVzaXMUYmxvY2tfdGltZXN0YW1wX3R5cGUOYnl0ZXNfcGVyX2Ryb3AFaW50NjQIc2VxdWVuY2UGdWludDY0B2VuYWJsZWQEYm9vbAh0cmFuc2ZlcgAEBGZyb20EbmFtZQJ0bwRuYW1lCWRyb3BzX2lkcwh1aW50NjRbXQRtZW1vB3N0cmluZz8GdW5iaW5kAAIFb3duZXIEbmFtZQlkcm9wc19pZHMIdWludDY0W10KAAAAAACQpjsEYmluZOwBLS0tCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogYmluZApzdW1tYXJ5OiAnQmluZCBEcm9wKHMpJwppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKLS0tCgp7e293bmVyfX0gYWdyZWVzIHRvIGJpbmQge3tkcm9wc19pZHN9fSBkcm9wcyhzKS4AAAAAAOlMRAVjbGFpbZ4CLS0tCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogY2xhaW0Kc3VtbWFyeTogJ0NsYWltIHJlbWFpbmluZyBSQU0gYmFsYW5jZScKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCi0tLQoKQ2xhaW0gYW55IHVuY2xhaW1lZCBSQU0gYmFsYW5jZSBmcm9tIHRoZSBjb250cmFjdCBiYWNrIHRvIHRoZSB7e293bmVyfX0ncyBhY2NvdW50LgAAAMDTm7FKB2Rlc3Ryb3moAy0tLQpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IGRlc3Ryb3kKc3VtbWFyeTogJ0Rlc3Ryb3kgRHJvcChzKScKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCi0tLQoKe3tvd25lcn19IGFncmVlcyB0byBkZXN0cm95IHt7ZHJvcHNfaWRzfX0gZHJvcHMocykuCgp7eyNpZiBtZW1vfX1UaGVyZSBpcyBhIG1lbW8gYXR0YWNoZWQgdG8gdGhlIHRyYW5zZmVyIHN0YXRpbmc6Cnt7bWVtb319Cnt7L2lmfX0KCnt7I2lmX2hhc192YWx1ZSB0b19ub3RpZnl9fVRoZXJlIGlzIGEgbm90aWZpY2F0aW9uIHRvIGJlIHNlbnQgdG8ge3t0b19ub3RpZnl9fS4Ke3svaWZfaGFzX3ZhbHVlfX0AAAAAqHjMVAZlbmFibGXEAS0tLQpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IGVuYWJsZQpzdW1tYXJ5OiAnRW5hYmxlIERyb3BzIGNvbnRyYXQnCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAotLS0AAAAqm6umYghnZW5lcmF0ZfwCLS0tCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogZ2VuZXJhdGUKc3VtbWFyeTogJ0dlbmVyYXRlIERyb3AocyknCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAotLS0KCnt7b3duZXJ9fSBhZ3JlZXMgdG8gZ2VuZXJhdGUge3thbW91bnR9fSBib3VuZD17e2JvdW5kfX0gZHJvcHMocykgdXNpbmcge3tkYXRhfX0gZGF0YS4KCnt7I2lmX2hhc192YWx1ZSB0b19ub3RpZnl9fVRoZXJlIGlzIGEgbm90aWZpY2F0aW9uIHRvIGJlIHNlbnQgdG8ge3t0b19ub3RpZnl9fS4Ke3svaWZfaGFzX3ZhbHVlfX0AAAC40psYjQhsb2dkcm9wc7gBLS0tCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogbG9nZHJvcHMKc3VtbWFyeTogbG9nZHJvcHMKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCi0tLQCwyv5IcxmNC2xvZ3JhbWJ5dGVzvgEtLS0Kc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBsb2dyYW1ieXRlcwpzdW1tYXJ5OiBsb2dyYW1ieXRlcwppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKLS0tAAAAAAAwVaUEb3BlbuQBLS0tCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogb3BlbgpzdW1tYXJ5OiAnT3BlbiBhY2NvdW50IGJhbGFuY2UnCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAotLS0KCk9wZW5zIFJBTSBiYWxhbmNlIGZvciB7e293bmVyfX0uAAAAVy08zc0IdHJhbnNmZXKAAy0tLQpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IHRyYW5zZmVyCnN1bW1hcnk6ICdUcmFuc2ZlciBEcm9wKHMpJwppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKLS0tCgp7e2Zyb219fSBhZ3JlZXMgdG8gdHJhbnNmZXIge3tkcm9wc19pZHN9fSBkcm9wcyhzKSB0byB7e3RvfX0uCgp7eyNpZiBtZW1vfX1UaGVyZSBpcyBhIG1lbW8gYXR0YWNoZWQgdG8gdGhlIHRyYW5zZmVyIHN0YXRpbmc6Cnt7bWVtb319Cnt7L2lmfX0KClRoZXJlIGlzIGEgbm90aWZpY2F0aW9uIHRvIGJlIHNlbnQgdG8ge3t0b319LgAAAACk6c7UBnVuYmluZPIBLS0tCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogdW5iaW5kCnN1bW1hcnk6ICdVbmJpbmQgRHJvcChzKScKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCi0tLQoKe3tvd25lcn19IGFncmVlcyB0byB1bmJpbmQge3tkcm9wc19pZHN9fSBkcm9wcyhzKS4DAAAAWKFpojkDaTY0AAAMYmFsYW5jZXNfcm93AAAAAABQ6U0DaTY0AAAIZHJvcF9yb3cAAAAAAJVNxgNpNjQAAAlzdGF0ZV9yb3cBBURyb3BzBURyb3BzAAAABgAAAAAAkKY7BWludDY0AAAAAADpTEQFaW50NjQAAADA05uxShRkZXN0cm95X3JldHVybl92YWx1ZQAAACqbq6ZiFWdlbmVyYXRlX3JldHVybl92YWx1ZQAAAAAAMFWlBGJvb2wAAAAApOnO1AVpbnQ2NA=='
)
export const abi = ABI.from(abiBlob)
export class Contract extends BaseContract {
    constructor(args: PartialBy<ContractArgs, 'abi' | 'account'>) {
        super({
            client: args.client,
            abi: abi,
            account: args.account || Name.from('drops'),
        })
    }
    action<T extends ActionNames>(
        name: T,
        data: ActionNameParams[T],
        options?: ActionOptions
    ): Action {
        return super.action(name, data, options)
    }
    readonly<T extends ActionReturnNames>(
        name: T,
        data?: ActionNameParams[T]
    ): ActionReturnValues[T] {
        return super.readonly(name, data) as unknown as ActionReturnValues[T]
    }
    table<T extends TableNames>(name: T, scope?: NameType): Table<RowType<T>> {
        return super.table(name, scope, TableMap[name])
    }
}
export interface ActionNameParams {
    bind: ActionParams.bind
    claim: ActionParams.claim
    destroy: ActionParams.destroy
    enable: ActionParams.enable
    generate: ActionParams.generate
    logdrops: ActionParams.logdrops
    logrambytes: ActionParams.logrambytes
    open: ActionParams.open
    transfer: ActionParams.transfer
    unbind: ActionParams.unbind
}
export namespace ActionParams {
    export namespace Type {}
    export interface bind {
        owner: NameType
        drops_ids: UInt64Type[]
    }
    export interface claim {
        owner: NameType
    }
    export interface destroy {
        owner: NameType
        drops_ids: UInt64Type[]
        memo?: string
        to_notify?: NameType
    }
    export interface enable {
        enabled: boolean
    }
    export interface generate {
        owner: NameType
        bound: boolean
        amount: UInt32Type
        data: string
        to_notify?: NameType
    }
    export interface logdrops {
        owner: NameType
        amount: Int64Type
        before_drops: Int64Type
        drops: Int64Type
    }
    export interface logrambytes {
        owner: NameType
        bytes: Int64Type
        before_ram_bytes: Int64Type
        ram_bytes: Int64Type
    }
    export interface open {
        owner: NameType
    }
    export interface transfer {
        from: NameType
        to: NameType
        drops_ids: UInt64Type[]
        memo?: string
    }
    export interface unbind {
        owner: NameType
        drops_ids: UInt64Type[]
    }
}
export namespace Types {
    @Struct.type('balances_row')
    export class balances_row extends Struct {
        @Struct.field(Name)
        owner!: Name
        @Struct.field(Int64)
        drops!: Int64
        @Struct.field(Int64)
        ram_bytes!: Int64
    }
    @Struct.type('bind')
    export class bind extends Struct {
        @Struct.field(Name)
        owner!: Name
        @Struct.field(UInt64, {array: true})
        drops_ids!: UInt64[]
    }
    @Struct.type('claim')
    export class claim extends Struct {
        @Struct.field(Name)
        owner!: Name
    }
    @Struct.type('destroy')
    export class destroy extends Struct {
        @Struct.field(Name)
        owner!: Name
        @Struct.field(UInt64, {array: true})
        drops_ids!: UInt64[]
        @Struct.field('string', {optional: true})
        memo?: String
        @Struct.field(Name, {optional: true})
        to_notify?: Name
    }
    @Struct.type('destroy_return_value')
    export class destroy_return_value extends Struct {
        @Struct.field(Int64)
        unbound_destroyed!: Int64
        @Struct.field(Int64)
        bytes_reclaimed!: Int64
    }
    @Struct.type('drop_row')
    export class drop_row extends Struct {
        @Struct.field(UInt64)
        seed!: UInt64
        @Struct.field(Name)
        owner!: Name
        @Struct.field(BlockTimestamp)
        created!: BlockTimestamp
        @Struct.field('bool')
        bound!: boolean
    }
    @Struct.type('enable')
    export class enable extends Struct {
        @Struct.field('bool')
        enabled!: boolean
    }
    @Struct.type('generate')
    export class generate extends Struct {
        @Struct.field(Name)
        owner!: Name
        @Struct.field('bool')
        bound!: boolean
        @Struct.field(UInt32)
        amount!: UInt32
        @Struct.field('string')
        data!: string
        @Struct.field(Name, {optional: true})
        to_notify?: Name
    }
    @Struct.type('generate_return_value')
    export class generate_return_value extends Struct {
        @Struct.field(Int64)
        bytes_used!: Int64
        @Struct.field(Int64)
        bytes_balance!: Int64
    }
    @Struct.type('logdrops')
    export class logdrops extends Struct {
        @Struct.field(Name)
        owner!: Name
        @Struct.field(Int64)
        amount!: Int64
        @Struct.field(Int64)
        before_drops!: Int64
        @Struct.field(Int64)
        drops!: Int64
    }
    @Struct.type('logrambytes')
    export class logrambytes extends Struct {
        @Struct.field(Name)
        owner!: Name
        @Struct.field(Int64)
        bytes!: Int64
        @Struct.field(Int64)
        before_ram_bytes!: Int64
        @Struct.field(Int64)
        ram_bytes!: Int64
    }
    @Struct.type('open')
    export class open extends Struct {
        @Struct.field(Name)
        owner!: Name
    }
    @Struct.type('state_row')
    export class state_row extends Struct {
        @Struct.field(BlockTimestamp)
        genesis!: BlockTimestamp
        @Struct.field(Int64)
        bytes_per_drop!: Int64
        @Struct.field(UInt64)
        sequence!: UInt64
        @Struct.field('bool')
        enabled!: boolean
    }
    @Struct.type('transfer')
    export class transfer extends Struct {
        @Struct.field(Name)
        from!: Name
        @Struct.field(Name)
        to!: Name
        @Struct.field(UInt64, {array: true})
        drops_ids!: UInt64[]
        @Struct.field('string', {optional: true})
        memo?: String
    }
    @Struct.type('unbind')
    export class unbind extends Struct {
        @Struct.field(Name)
        owner!: Name
        @Struct.field(UInt64, {array: true})
        drops_ids!: UInt64[]
    }
}
export const TableMap = {
    balances: Types.balances_row,
    drop: Types.drop_row,
    state: Types.state_row,
}
export interface TableTypes {
    balances: Types.balances_row
    drop: Types.drop_row
    state: Types.state_row
}
export type RowType<T> = T extends keyof TableTypes ? TableTypes[T] : any
export type ActionNames = keyof ActionNameParams
export type TableNames = keyof TableTypes
export interface ActionReturnValues {
    bind: Int64
    claim: Int64
    destroy: Types.destroy_return_value
    generate: Types.generate_return_value
    open: boolean
    unbind: Int64
}
export type ActionReturnNames = keyof ActionReturnValues
