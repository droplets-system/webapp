import type {Action, Int64Type, NameType, UInt32Type, UInt64Type} from '@wharfkit/antelope'
import {ABI, Blob, BlockTimestamp, Int64, Name, Struct, UInt32, UInt64} from '@wharfkit/antelope'
import type {ActionOptions, ContractArgs, PartialBy, Table} from '@wharfkit/contract'
import {Contract as BaseContract} from '@wharfkit/contract'
export const abiBlob = Blob.from(
    'DmVvc2lvOjphYmkvMS4yABEMYmFsYW5jZXNfcm93AAMFb3duZXIEbmFtZQVkcm9wcwVpbnQ2NAlyYW1fYnl0ZXMFaW50NjQEYmluZAACBW93bmVyBG5hbWUJZHJvcHNfaWRzCHVpbnQ2NFtdBWNsYWltAAEFb3duZXIEbmFtZQpjbGVhcnRhYmxlAAMKdGFibGVfbmFtZQRuYW1lBXNjb3BlBW5hbWU/CG1heF9yb3dzB3VpbnQ2ND8HZGVzdHJveQAEBW93bmVyBG5hbWUJZHJvcHNfaWRzCHVpbnQ2NFtdBG1lbW8Hc3RyaW5nPwl0b19ub3RpZnkFbmFtZT8UZGVzdHJveV9yZXR1cm5fdmFsdWUAAhF1bmJvdW5kX2Rlc3Ryb3llZAVpbnQ2NA9ieXRlc19yZWNsYWltZWQFaW50NjQIZHJvcF9yb3cABARzZWVkBnVpbnQ2NAVvd25lcgRuYW1lB2NyZWF0ZWQUYmxvY2tfdGltZXN0YW1wX3R5cGUFYm91bmQEYm9vbAZlbmFibGUAAQdlbmFibGVkBGJvb2wIZ2VuZXJhdGUABQVvd25lcgRuYW1lBWJvdW5kBGJvb2wGYW1vdW50BnVpbnQzMgRkYXRhBnN0cmluZwl0b19ub3RpZnkFbmFtZT8VZ2VuZXJhdGVfcmV0dXJuX3ZhbHVlAAIKYnl0ZXNfdXNlZAVpbnQ2NA1ieXRlc19iYWxhbmNlBWludDY0CGxvZ2Ryb3BzAAMFb3duZXIEbmFtZQxiZWZvcmVfZHJvcHMFaW50NjQFZHJvcHMFaW50NjQLbG9ncmFtYnl0ZXMAAwVvd25lcgRuYW1lEGJlZm9yZV9yYW1fYnl0ZXMFaW50NjQJcmFtX2J5dGVzBWludDY0BG9wZW4AAQVvd25lcgRuYW1lCXN0YXRlX3JvdwADB2dlbmVzaXMUYmxvY2tfdGltZXN0YW1wX3R5cGUOYnl0ZXNfcGVyX2Ryb3AFaW50NjQHZW5hYmxlZARib29sBHRlc3QAAQRkYXRhBnN0cmluZwh0cmFuc2ZlcgAEBGZyb20EbmFtZQJ0bwRuYW1lCWRyb3BzX2lkcwh1aW50NjRbXQRtZW1vB3N0cmluZz8GdW5iaW5kAAIFb3duZXIEbmFtZQlkcm9wc19pZHMIdWludDY0W10MAAAAAACQpjsEYmluZLIBLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IGJpbmQKc3VtbWFyeTogYmluZAppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQAAAAAA6UxEBWNsYWlttAEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogY2xhaW0Kc3VtbWFyeTogY2xhaW0KaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0AgIrH5GtURApjbGVhcnRhYmxlvgEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogY2xlYXJ0YWJsZQpzdW1tYXJ5OiBjbGVhcnRhYmxlCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tAAAAwNObsUoHZGVzdHJvebgBLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IGRlc3Ryb3kKc3VtbWFyeTogZGVzdHJveQppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQAAAACoeMxUBmVuYWJsZbYBLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IGVuYWJsZQpzdW1tYXJ5OiBlbmFibGUKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0AAAAqm6umYghnZW5lcmF0ZboBLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IGdlbmVyYXRlCnN1bW1hcnk6IGdlbmVyYXRlCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tAAAAuNKbGI0IbG9nZHJvcHO6AS0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBsb2dkcm9wcwpzdW1tYXJ5OiBsb2dkcm9wcwppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQCwyv5IcxmNC2xvZ3JhbWJ5dGVzwAEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogbG9ncmFtYnl0ZXMKc3VtbWFyeTogbG9ncmFtYnl0ZXMKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0AAAAAADBVpQRvcGVusgEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogb3BlbgpzdW1tYXJ5OiBvcGVuCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tAAAAAACQscoEdGVzdLIBLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IHRlc3QKc3VtbWFyeTogdGVzdAppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQAAAFctPM3NCHRyYW5zZmVyugEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogdHJhbnNmZXIKc3VtbWFyeTogdHJhbnNmZXIKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0AAAAApOnO1AZ1bmJpbmS2AS0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiB1bmJpbmQKc3VtbWFyeTogdW5iaW5kCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tAwAAAFihaaI5A2k2NAAADGJhbGFuY2VzX3JvdwAAAAAAUOlNA2k2NAAACGRyb3Bfcm93AAAAAACVTcYDaTY0AAAJc3RhdGVfcm93AQVEcm9wcwVEcm9wcwAAAAYAAAAAAJCmOwVpbnQ2NAAAAAAA6UxEBWludDY0AAAAwNObsUoUZGVzdHJveV9yZXR1cm5fdmFsdWUAAAAqm6umYhVnZW5lcmF0ZV9yZXR1cm5fdmFsdWUAAAAAADBVpQRib29sAAAAAKTpztQFaW50NjQ='
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
    cleartable: ActionParams.cleartable
    destroy: ActionParams.destroy
    enable: ActionParams.enable
    generate: ActionParams.generate
    logdrops: ActionParams.logdrops
    logrambytes: ActionParams.logrambytes
    open: ActionParams.open
    test: ActionParams.test
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
    export interface cleartable {
        table_name: NameType
        scope?: NameType
        max_rows?: UInt64Type
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
        before_drops: Int64Type
        drops: Int64Type
    }
    export interface logrambytes {
        owner: NameType
        before_ram_bytes: Int64Type
        ram_bytes: Int64Type
    }
    export interface open {
        owner: NameType
    }
    export interface test {
        data: string
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
    @Struct.type('cleartable')
    export class cleartable extends Struct {
        @Struct.field(Name)
        table_name!: Name
        @Struct.field(Name, {optional: true})
        scope?: Name
        @Struct.field(UInt64, {optional: true})
        max_rows?: UInt64
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
        before_drops!: Int64
        @Struct.field(Int64)
        drops!: Int64
    }
    @Struct.type('logrambytes')
    export class logrambytes extends Struct {
        @Struct.field(Name)
        owner!: Name
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
        @Struct.field('bool')
        enabled!: boolean
    }
    @Struct.type('test')
    export class test extends Struct {
        @Struct.field('string')
        data!: string
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
