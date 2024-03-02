import type {
    Action,
    AssetType,
    Int64Type,
    NameType,
    UInt32Type,
    UInt64Type,
} from '@wharfkit/antelope'
import {
    ABI,
    Asset,
    Blob,
    BlockTimestamp,
    Int64,
    Name,
    Struct,
    UInt32,
    UInt64,
} from '@wharfkit/antelope'
import type {ActionOptions, ContractArgs, PartialBy, Table} from '@wharfkit/contract'
import {Contract as BaseContract} from '@wharfkit/contract'
export const abiBlob = Blob.from(
    'DmVvc2lvOjphYmkvMS4yABMMYmFsYW5jZXNfcm93AAMFb3duZXIEbmFtZQVkcm9wcwVpbnQ2NAlyYW1fYnl0ZXMFaW50NjQEYmluZAACBW93bmVyBG5hbWULZHJvcGxldF9pZHMIdWludDY0W10JYnl0ZXNjb3N0AAEIcXVhbnRpdHkFYXNzZXQFY2xhaW0AAQVvd25lcgRuYW1lB2Rlc3Ryb3kABAVvd25lcgRuYW1lC2Ryb3BsZXRfaWRzCHVpbnQ2NFtdBG1lbW8Hc3RyaW5nPwl0b19ub3RpZnkFbmFtZT8UZGVzdHJveV9yZXR1cm5fdmFsdWUAAhF1bmJvdW5kX2Rlc3Ryb3llZAVpbnQ2NA9ieXRlc19yZWNsYWltZWQFaW50NjQIZHJvcF9yb3cABARzZWVkBnVpbnQ2NAVvd25lcgRuYW1lB2NyZWF0ZWQUYmxvY2tfdGltZXN0YW1wX3R5cGUFYm91bmQEYm9vbAZlbmFibGUAAQdlbmFibGVkBGJvb2wIZ2VuZXJhdGUABgVvd25lcgRuYW1lBWJvdW5kBGJvb2wGYW1vdW50BnVpbnQzMgRkYXRhBnN0cmluZwl0b19ub3RpZnkFbmFtZT8EbWVtbwdzdHJpbmc/FWdlbmVyYXRlX3JldHVybl92YWx1ZQACCmJ5dGVzX3VzZWQFaW50NjQNYnl0ZXNfYmFsYW5jZQVpbnQ2NApsb2dkZXN0cm95AAcFb3duZXIEbmFtZQVkcm9wcwpkcm9wX3Jvd1tdCWRlc3Ryb3llZAVpbnQ2NBF1bmJvdW5kX2Rlc3Ryb3llZAVpbnQ2NA9ieXRlc19yZWNsYWltZWQFaW50NjQEbWVtbwdzdHJpbmc/CXRvX25vdGlmeQVuYW1lPwhsb2dkcm9wcwAEBW93bmVyBG5hbWUGYW1vdW50BWludDY0DGJlZm9yZV9kcm9wcwVpbnQ2NAVkcm9wcwVpbnQ2NAtsb2dnZW5lcmF0ZQAIBW93bmVyBG5hbWUFZHJvcHMKZHJvcF9yb3dbXQlnZW5lcmF0ZWQFaW50NjQKYnl0ZXNfdXNlZAVpbnQ2NA1ieXRlc19iYWxhbmNlBWludDY0BGRhdGEGc3RyaW5nCXRvX25vdGlmeQVuYW1lPwRtZW1vB3N0cmluZz8LbG9ncmFtYnl0ZXMABAVvd25lcgRuYW1lBWJ5dGVzBWludDY0EGJlZm9yZV9yYW1fYnl0ZXMFaW50NjQJcmFtX2J5dGVzBWludDY0BG9wZW4AAQVvd25lcgRuYW1lB3JhbWNvc3QAAQVieXRlcwVpbnQ2NAlzdGF0ZV9yb3cABAdnZW5lc2lzFGJsb2NrX3RpbWVzdGFtcF90eXBlDmJ5dGVzX3Blcl9kcm9wBWludDY0CHNlcXVlbmNlBnVpbnQ2NAdlbmFibGVkBGJvb2wIdHJhbnNmZXIABARmcm9tBG5hbWUCdG8EbmFtZQtkcm9wbGV0X2lkcwh1aW50NjRbXQRtZW1vB3N0cmluZz8GdW5iaW5kAAIFb3duZXIEbmFtZQtkcm9wbGV0X2lkcwh1aW50NjRbXQ4AAAAAAJCmOwRiaW5k8AEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogYmluZApzdW1tYXJ5OiAnQmluZCBEcm9wKHMpJwppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQoKe3tvd25lcn19IGFncmVlcyB0byBiaW5kIHt7ZHJvcGxldF9pZHN9fSBkcm9wcyhzKS4AAMiYIqyyPwlieXRlc2Nvc3S8AS0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBieXRlc2Nvc3QKc3VtbWFyeTogYnl0ZXNjb3N0Cmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tAAAAAADpTEQFY2xhaW2gAi0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBjbGFpbQpzdW1tYXJ5OiAnQ2xhaW0gcmVtYWluaW5nIFJBTSBiYWxhbmNlJwppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQoKQ2xhaW0gYW55IHVuY2xhaW1lZCBSQU0gYmFsYW5jZSBmcm9tIHRoZSBjb250cmFjdCBiYWNrIHRvIHRoZSB7e293bmVyfX0ncyBhY2NvdW50LgAAAMDTm7FKB2Rlc3Ryb3msAy0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBkZXN0cm95CnN1bW1hcnk6ICdEZXN0cm95IERyb3AocyknCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tCgp7e293bmVyfX0gYWdyZWVzIHRvIGRlc3Ryb3kge3tkcm9wbGV0X2lkc319IGRyb3BzKHMpLgoKe3sjaWYgbWVtb319VGhlcmUgaXMgYSBtZW1vIGF0dGFjaGVkIHRvIHRoZSB0cmFuc2ZlciBzdGF0aW5nOgp7e21lbW99fQp7ey9pZn19Cgp7eyNpZl9oYXNfdmFsdWUgdG9fbm90aWZ5fX1UaGVyZSBpcyBhIG5vdGlmaWNhdGlvbiB0byBiZSBzZW50IHRvIHt7dG9fbm90aWZ5fX0uCnt7L2lmX2hhc192YWx1ZX19AAAAAKh4zFQGZW5hYmxlxgEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogZW5hYmxlCnN1bW1hcnk6ICdFbmFibGUgRHJvcHMgY29udHJhdCcKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0AAAAqm6umYghnZW5lcmF0Zf4CLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IGdlbmVyYXRlCnN1bW1hcnk6ICdHZW5lcmF0ZSBEcm9wKHMpJwppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQoKe3tvd25lcn19IGFncmVlcyB0byBnZW5lcmF0ZSB7e2Ftb3VudH19IGJvdW5kPXt7Ym91bmR9fSBkcm9wcyhzKSB1c2luZyB7e2RhdGF9fSBkYXRhLgoKe3sjaWZfaGFzX3ZhbHVlIHRvX25vdGlmeX19VGhlcmUgaXMgYSBub3RpZmljYXRpb24gdG8gYmUgc2VudCB0byB7e3RvX25vdGlmeX19Lgp7ey9pZl9oYXNfdmFsdWV9fQCApzdjlRiNCmxvZ2Rlc3Ryb3m+AS0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBsb2dkZXN0cm95CnN1bW1hcnk6IGxvZ2Rlc3Ryb3kKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0AAAC40psYjQhsb2dkcm9wc7oBLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IGxvZ2Ryb3BzCnN1bW1hcnk6IGxvZ2Ryb3BzCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tAFQ2V03FGI0LbG9nZ2VuZXJhdGXAAS0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBsb2dnZW5lcmF0ZQpzdW1tYXJ5OiBsb2dnZW5lcmF0ZQppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQCwyv5IcxmNC2xvZ3JhbWJ5dGVzwAEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogbG9ncmFtYnl0ZXMKc3VtbWFyeTogbG9ncmFtYnl0ZXMKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0AAAAAADBVpQRvcGVu5gEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogb3BlbgpzdW1tYXJ5OiAnT3BlbiBhY2NvdW50IGJhbGFuY2UnCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tCgpPcGVucyBSQU0gYmFsYW5jZSBmb3Ige3tvd25lcn19LgAAACBjiqS5B3JhbWNvc3S4AS0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiByYW1jb3N0CnN1bW1hcnk6IHJhbWNvc3QKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0AAABXLTzNzQh0cmFuc2ZlcoQDLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IHRyYW5zZmVyCnN1bW1hcnk6ICdUcmFuc2ZlciBEcm9wKHMpJwppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQoKe3tmcm9tfX0gYWdyZWVzIHRvIHRyYW5zZmVyIHt7ZHJvcGxldF9pZHN9fSBkcm9wcyhzKSB0byB7e3RvfX0uCgp7eyNpZiBtZW1vfX1UaGVyZSBpcyBhIG1lbW8gYXR0YWNoZWQgdG8gdGhlIHRyYW5zZmVyIHN0YXRpbmc6Cnt7bWVtb319Cnt7L2lmfX0KClRoZXJlIGlzIGEgbm90aWZpY2F0aW9uIHRvIGJlIHNlbnQgdG8ge3t0b319LgAAAACk6c7UBnVuYmluZPYBLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IHVuYmluZApzdW1tYXJ5OiAnVW5iaW5kIERyb3AocyknCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tCgp7e293bmVyfX0gYWdyZWVzIHRvIHVuYmluZCB7e2Ryb3BsZXRfaWRzfX0gZHJvcHMocykuAwAAAFihaaI5A2k2NAAADGJhbGFuY2VzX3JvdwAAAAAAUOlNA2k2NAAACGRyb3Bfcm93AAAAAACVTcYDaTY0AAAJc3RhdGVfcm93AQVEcm9wcwVEcm9wcwAAAAgAAAAAAJCmOwVpbnQ2NAAAyJgirLI/BWludDY0AAAAAADpTEQFaW50NjQAAADA05uxShRkZXN0cm95X3JldHVybl92YWx1ZQAAACqbq6ZiFWdlbmVyYXRlX3JldHVybl92YWx1ZQAAAAAAMFWlBGJvb2wAAAAgY4qkuQVhc3NldAAAAACk6c7UBWludDY0'
)
export const abi = ABI.from(abiBlob)
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
        droplet_ids!: UInt64[]
    }
    @Struct.type('bytescost')
    export class bytescost extends Struct {
        @Struct.field(Asset)
        quantity!: Asset
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
        droplet_ids!: UInt64[]
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
        @Struct.field('string', {optional: true})
        memo?: String
    }
    @Struct.type('generate_return_value')
    export class generate_return_value extends Struct {
        @Struct.field(Int64)
        bytes_used!: Int64
        @Struct.field(Int64)
        bytes_balance!: Int64
    }
    @Struct.type('logdestroy')
    export class logdestroy extends Struct {
        @Struct.field(Name)
        owner!: Name
        @Struct.field(drop_row, {array: true})
        drops!: drop_row[]
        @Struct.field(Int64)
        destroyed!: Int64
        @Struct.field(Int64)
        unbound_destroyed!: Int64
        @Struct.field(Int64)
        bytes_reclaimed!: Int64
        @Struct.field('string', {optional: true})
        memo?: String
        @Struct.field(Name, {optional: true})
        to_notify?: Name
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
    @Struct.type('loggenerate')
    export class loggenerate extends Struct {
        @Struct.field(Name)
        owner!: Name
        @Struct.field(drop_row, {array: true})
        drops!: drop_row[]
        @Struct.field(Int64)
        generated!: Int64
        @Struct.field(Int64)
        bytes_used!: Int64
        @Struct.field(Int64)
        bytes_balance!: Int64
        @Struct.field('string')
        data!: string
        @Struct.field(Name, {optional: true})
        to_notify?: Name
        @Struct.field('string', {optional: true})
        memo?: String
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
    @Struct.type('ramcost')
    export class ramcost extends Struct {
        @Struct.field(Int64)
        bytes!: Int64
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
        droplet_ids!: UInt64[]
        @Struct.field('string', {optional: true})
        memo?: String
    }
    @Struct.type('unbind')
    export class unbind extends Struct {
        @Struct.field(Name)
        owner!: Name
        @Struct.field(UInt64, {array: true})
        droplet_ids!: UInt64[]
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
export type TableNames = keyof TableTypes
export namespace ActionParams {
    export namespace Type {
        export interface drop_row {
            seed: UInt64Type
            owner: NameType
            created: BlockTimestamp
            bound: boolean
        }
    }
    export interface bind {
        owner: NameType
        droplet_ids: UInt64Type[]
    }
    export interface bytescost {
        quantity: AssetType
    }
    export interface claim {
        owner: NameType
    }
    export interface destroy {
        owner: NameType
        droplet_ids: UInt64Type[]
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
        memo?: string
    }
    export interface logdestroy {
        owner: NameType
        drops: Type.drop_row[]
        destroyed: Int64Type
        unbound_destroyed: Int64Type
        bytes_reclaimed: Int64Type
        memo?: string
        to_notify?: NameType
    }
    export interface logdrops {
        owner: NameType
        amount: Int64Type
        before_drops: Int64Type
        drops: Int64Type
    }
    export interface loggenerate {
        owner: NameType
        drops: Type.drop_row[]
        generated: Int64Type
        bytes_used: Int64Type
        bytes_balance: Int64Type
        data: string
        to_notify?: NameType
        memo?: string
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
    export interface ramcost {
        bytes: Int64Type
    }
    export interface transfer {
        from: NameType
        to: NameType
        droplet_ids: UInt64Type[]
        memo?: string
    }
    export interface unbind {
        owner: NameType
        droplet_ids: UInt64Type[]
    }
}
export interface ActionNameParams {
    bind: ActionParams.bind
    bytescost: ActionParams.bytescost
    claim: ActionParams.claim
    destroy: ActionParams.destroy
    enable: ActionParams.enable
    generate: ActionParams.generate
    logdestroy: ActionParams.logdestroy
    logdrops: ActionParams.logdrops
    loggenerate: ActionParams.loggenerate
    logrambytes: ActionParams.logrambytes
    open: ActionParams.open
    ramcost: ActionParams.ramcost
    transfer: ActionParams.transfer
    unbind: ActionParams.unbind
}
export type ActionNames = keyof ActionNameParams
export interface ActionReturnValues {
    bind: Int64
    bytescost: Int64
    claim: Int64
    destroy: Types.destroy_return_value
    generate: Types.generate_return_value
    open: boolean
    ramcost: Asset
    unbind: Int64
}
export type ActionReturnNames = keyof ActionReturnValues
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
