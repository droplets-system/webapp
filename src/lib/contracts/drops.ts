import type {Action, NameType, UInt32Type, UInt64Type} from '@wharfkit/antelope'
import {ABI, Blob, BlockTimestamp, Int64, Name, Struct, UInt32, UInt64} from '@wharfkit/antelope'
import type {ActionOptions, ContractArgs, PartialBy, Table} from '@wharfkit/contract'
import {Contract as BaseContract} from '@wharfkit/contract'
export const abiBlob = Blob.from(
    'DmVvc2lvOjphYmkvMS4yAA0MYmFsYW5jZXNfcm93AAMFb3duZXIEbmFtZQVkcm9wcwVpbnQ2NAlyYW1fYnl0ZXMFaW50NjQEYmluZAACBW93bmVyBG5hbWUJZHJvcHNfaWRzCHVpbnQ2NFtdBWNsYWltAAEFb3duZXIEbmFtZQdkZXN0cm95AAMFb3duZXIEbmFtZQlkcm9wc19pZHMIdWludDY0W10EbWVtbwZzdHJpbmcUZGVzdHJveV9yZXR1cm5fdmFsdWUAAhF1bmJvdW5kX2Rlc3Ryb3llZAVpbnQ2NA9ieXRlc19yZWNsYWltZWQFaW50NjQIZHJvcF9yb3cABARzZWVkBnVpbnQ2NAVvd25lcgRuYW1lB2NyZWF0ZWQUYmxvY2tfdGltZXN0YW1wX3R5cGUFYm91bmQEYm9vbAZlbmFibGUAAQdlbmFibGVkBGJvb2wIZ2VuZXJhdGUABAVvd25lcgRuYW1lBWJvdW5kBGJvb2wGYW1vdW50BnVpbnQzMgRkYXRhBnN0cmluZwRvcGVuAAEFb3duZXIEbmFtZQhzdGF0X3JvdwACBWRyb3BzBWludDY0CXJhbV9ieXRlcwVpbnQ2NAlzdGF0ZV9yb3cAAwdnZW5lc2lzFGJsb2NrX3RpbWVzdGFtcF90eXBlDmJ5dGVzX3Blcl9kcm9wBWludDY0B2VuYWJsZWQEYm9vbAh0cmFuc2ZlcgAEBGZyb20EbmFtZQJ0bwRuYW1lCWRyb3BzX2lkcwh1aW50NjRbXQRtZW1vBnN0cmluZwZ1bmJpbmQAAgVvd25lcgRuYW1lCWRyb3BzX2lkcwh1aW50NjRbXQgAAAAAAJCmOwRiaW5ksgEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogYmluZApzdW1tYXJ5OiBiaW5kCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tAAAAAADpTEQFY2xhaW20AS0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBjbGFpbQpzdW1tYXJ5OiBjbGFpbQppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQAAAMDTm7FKB2Rlc3Ryb3m4AS0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBkZXN0cm95CnN1bW1hcnk6IGRlc3Ryb3kKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0AAAAAqHjMVAZlbmFibGW2AS0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBlbmFibGUKc3VtbWFyeTogZW5hYmxlCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tAAAAKpurpmIIZ2VuZXJhdGW6AS0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBnZW5lcmF0ZQpzdW1tYXJ5OiBnZW5lcmF0ZQppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQAAAAAAMFWlBG9wZW6yAS0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBvcGVuCnN1bW1hcnk6IG9wZW4KaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0AAABXLTzNzQh0cmFuc2ZlcroBLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IHRyYW5zZmVyCnN1bW1hcnk6IHRyYW5zZmVyCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tAAAAAKTpztQGdW5iaW5ktgEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogdW5iaW5kCnN1bW1hcnk6IHVuYmluZAppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQQAAABYoWmiOQNpNjQAAAxiYWxhbmNlc19yb3cAAAAAAFDpTQNpNjQAAAhkcm9wX3JvdwAAAAAAkE3GA2k2NAAACHN0YXRfcm93AAAAAACVTcYDaTY0AAAJc3RhdGVfcm93AQVEcm9wcwVEcm9wcwAAAAYAAAAAAJCmOwVpbnQ2NAAAAAAA6UxEBWludDY0AAAAwNObsUoUZGVzdHJveV9yZXR1cm5fdmFsdWUAAAAqm6umYgVpbnQ2NAAAAAAAMFWlBGJvb2wAAAAApOnO1AVpbnQ2NA=='
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
        memo: string
    }
    export interface enable {
        enabled: boolean
    }
    export interface generate {
        owner: NameType
        bound: boolean
        amount: UInt32Type
        data: string
    }
    export interface open {
        owner: NameType
    }
    export interface transfer {
        from: NameType
        to: NameType
        drops_ids: UInt64Type[]
        memo: string
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
        @Struct.field('string')
        memo!: string
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
    }
    @Struct.type('open')
    export class open extends Struct {
        @Struct.field(Name)
        owner!: Name
    }
    @Struct.type('stat_row')
    export class stat_row extends Struct {
        @Struct.field(Int64)
        drops!: Int64
        @Struct.field(Int64)
        ram_bytes!: Int64
    }
    @Struct.type('state_row')
    export class state_row extends Struct {
        @Struct.field(BlockTimestamp)
        genesis!: BlockTimestamp
        @Struct.field(Int64)
        bytes_per_drop!: Int64
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
        @Struct.field('string')
        memo!: string
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
    stat: Types.stat_row,
    state: Types.state_row,
}
export interface TableTypes {
    balances: Types.balances_row
    drop: Types.drop_row
    stat: Types.stat_row
    state: Types.state_row
}
export type RowType<T> = T extends keyof TableTypes ? TableTypes[T] : any
export type ActionNames = keyof ActionNameParams
export type TableNames = keyof TableTypes
export interface ActionReturnValues {
    bind: Int64
    claim: Int64
    destroy: Types.destroy_return_value
    generate: Int64
    open: boolean
    unbind: Int64
}
export type ActionReturnNames = keyof ActionReturnValues
