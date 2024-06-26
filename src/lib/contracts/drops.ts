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
    'DmVvc2lvOjphYmkvMS4yABYMYmFsYW5jZXNfcm93AAMFb3duZXIEbmFtZQVkcm9wcwVpbnQ2NAlyYW1fYnl0ZXMFaW50NjQEYmluZAACBW93bmVyBG5hbWULZHJvcGxldF9pZHMIdWludDY0W10JYnl0ZXNjb3N0AAEIcXVhbnRpdHkFYXNzZXQFY2xhaW0AAQVvd25lcgRuYW1lB2Rlc3Ryb3kABAVvd25lcgRuYW1lC2Ryb3BsZXRfaWRzCHVpbnQ2NFtdBG1lbW8Hc3RyaW5nPwl0b19ub3RpZnkFbmFtZT8UZGVzdHJveV9yZXR1cm5fdmFsdWUAAhF1bmJvdW5kX2Rlc3Ryb3llZAVpbnQ2NA9ieXRlc19yZWNsYWltZWQFaW50NjQIZHJvcF9yb3cABARzZWVkBnVpbnQ2NAVvd25lcgRuYW1lB2NyZWF0ZWQUYmxvY2tfdGltZXN0YW1wX3R5cGUFYm91bmQEYm9vbAZlbmFibGUAAQdlbmFibGVkBGJvb2wIZ2VuZXJhdGUABgVvd25lcgRuYW1lBWJvdW5kBGJvb2wGYW1vdW50BnVpbnQzMgRkYXRhBnN0cmluZwl0b19ub3RpZnkFbmFtZT8EbWVtbwdzdHJpbmc/FWdlbmVyYXRlX3JldHVybl92YWx1ZQACCmJ5dGVzX3VzZWQFaW50NjQNYnl0ZXNfYmFsYW5jZQVpbnQ2NARsb2NrAAIFb3duZXIEbmFtZQtkcm9wbGV0X2lkcwh1aW50NjRbXQhsb2NrX3JvdwABBHNlZWQGdWludDY0CmxvZ2Rlc3Ryb3kABwVvd25lcgRuYW1lBWRyb3BzCmRyb3Bfcm93W10JZGVzdHJveWVkBWludDY0EXVuYm91bmRfZGVzdHJveWVkBWludDY0D2J5dGVzX3JlY2xhaW1lZAVpbnQ2NARtZW1vB3N0cmluZz8JdG9fbm90aWZ5BW5hbWU/CGxvZ2Ryb3BzAAQFb3duZXIEbmFtZQZhbW91bnQFaW50NjQMYmVmb3JlX2Ryb3BzBWludDY0BWRyb3BzBWludDY0C2xvZ2dlbmVyYXRlAAgFb3duZXIEbmFtZQVkcm9wcwpkcm9wX3Jvd1tdCWdlbmVyYXRlZAVpbnQ2NApieXRlc191c2VkBWludDY0DWJ5dGVzX2JhbGFuY2UFaW50NjQEZGF0YQZzdHJpbmcJdG9fbm90aWZ5BW5hbWU/BG1lbW8Hc3RyaW5nPwtsb2dyYW1ieXRlcwAEBW93bmVyBG5hbWUFYnl0ZXMFaW50NjQQYmVmb3JlX3JhbV9ieXRlcwVpbnQ2NAlyYW1fYnl0ZXMFaW50NjQEb3BlbgABBW93bmVyBG5hbWUHcmFtY29zdAABBWJ5dGVzBWludDY0CXN0YXRlX3JvdwAEB2dlbmVzaXMUYmxvY2tfdGltZXN0YW1wX3R5cGUOYnl0ZXNfcGVyX2Ryb3AFaW50NjQIc2VxdWVuY2UGdWludDY0B2VuYWJsZWQEYm9vbAh0cmFuc2ZlcgAEBGZyb20EbmFtZQJ0bwRuYW1lC2Ryb3BsZXRfaWRzCHVpbnQ2NFtdBG1lbW8Hc3RyaW5nPwZ1bmJpbmQAAgVvd25lcgRuYW1lC2Ryb3BsZXRfaWRzCHVpbnQ2NFtdBnVubG9jawACBW93bmVyBG5hbWULZHJvcGxldF9pZHMIdWludDY0W10QAAAAAACQpjsEYmluZPABLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IGJpbmQKc3VtbWFyeTogJ0JpbmQgRHJvcChzKScKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0KCnt7b3duZXJ9fSBhZ3JlZXMgdG8gYmluZCB7e2Ryb3BsZXRfaWRzfX0gZHJvcHMocykuAADImCKssj8JYnl0ZXNjb3N0vAEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogYnl0ZXNjb3N0CnN1bW1hcnk6IGJ5dGVzY29zdAppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQAAAAAA6UxEBWNsYWltoAItLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogY2xhaW0Kc3VtbWFyeTogJ0NsYWltIHJlbWFpbmluZyBSQU0gYmFsYW5jZScKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0KCkNsYWltIGFueSB1bmNsYWltZWQgUkFNIGJhbGFuY2UgZnJvbSB0aGUgY29udHJhY3QgYmFjayB0byB0aGUge3tvd25lcn19J3MgYWNjb3VudC4AAADA05uxSgdkZXN0cm95rAMtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogZGVzdHJveQpzdW1tYXJ5OiAnRGVzdHJveSBEcm9wKHMpJwppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQoKe3tvd25lcn19IGFncmVlcyB0byBkZXN0cm95IHt7ZHJvcGxldF9pZHN9fSBkcm9wcyhzKS4KCnt7I2lmIG1lbW99fVRoZXJlIGlzIGEgbWVtbyBhdHRhY2hlZCB0byB0aGUgdHJhbnNmZXIgc3RhdGluZzoKe3ttZW1vfX0Ke3svaWZ9fQoKe3sjaWZfaGFzX3ZhbHVlIHRvX25vdGlmeX19VGhlcmUgaXMgYSBub3RpZmljYXRpb24gdG8gYmUgc2VudCB0byB7e3RvX25vdGlmeX19Lgp7ey9pZl9oYXNfdmFsdWV9fQAAAACoeMxUBmVuYWJsZcYBLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IGVuYWJsZQpzdW1tYXJ5OiAnRW5hYmxlIERyb3BzIGNvbnRyYXQnCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tAAAAKpurpmIIZ2VuZXJhdGX+Ai0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBnZW5lcmF0ZQpzdW1tYXJ5OiAnR2VuZXJhdGUgRHJvcChzKScKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0KCnt7b3duZXJ9fSBhZ3JlZXMgdG8gZ2VuZXJhdGUge3thbW91bnR9fSBib3VuZD17e2JvdW5kfX0gZHJvcHMocykgdXNpbmcge3tkYXRhfX0gZGF0YS4KCnt7I2lmX2hhc192YWx1ZSB0b19ub3RpZnl9fVRoZXJlIGlzIGEgbm90aWZpY2F0aW9uIHRvIGJlIHNlbnQgdG8ge3t0b19ub3RpZnl9fS4Ke3svaWZfaGFzX3ZhbHVlfX0AAAAAAAARjQRsb2Nr8AEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogbG9jawpzdW1tYXJ5OiAnTG9jayBEcm9wKHMpJwppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQoKe3tvd25lcn19IGFncmVlcyB0byBsb2NrIHt7ZHJvcGxldF9pZHN9fSBkcm9wcyhzKS4AgKc3Y5UYjQpsb2dkZXN0cm95vgEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogbG9nZGVzdHJveQpzdW1tYXJ5OiBsb2dkZXN0cm95Cmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tAAAAuNKbGI0IbG9nZHJvcHO6AS0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBsb2dkcm9wcwpzdW1tYXJ5OiBsb2dkcm9wcwppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQBUNldNxRiNC2xvZ2dlbmVyYXRlwAEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogbG9nZ2VuZXJhdGUKc3VtbWFyeTogbG9nZ2VuZXJhdGUKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0AsMr+SHMZjQtsb2dyYW1ieXRlc8ABLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IGxvZ3JhbWJ5dGVzCnN1bW1hcnk6IGxvZ3JhbWJ5dGVzCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tAAAAAAAwVaUEb3BlbuYBLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IG9wZW4Kc3VtbWFyeTogJ09wZW4gYWNjb3VudCBiYWxhbmNlJwppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQoKT3BlbnMgUkFNIGJhbGFuY2UgZm9yIHt7b3duZXJ9fS4AAAAgY4qkuQdyYW1jb3N0uAEtLS0KCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogcmFtY29zdApzdW1tYXJ5OiByYW1jb3N0Cmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tAAAAVy08zc0IdHJhbnNmZXKEAy0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiB0cmFuc2ZlcgpzdW1tYXJ5OiAnVHJhbnNmZXIgRHJvcChzKScKaWNvbjogaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1ODExMzc4MiNkM2JmMjkwZmRkZWRkYmI3ZDMyYWE4OTdlOWY3ZTllMTNhMmFlNDQ5NTYxNDJlMjNlYjQ3Yjc3MDk2YTJlYThkCgotLS0KCnt7ZnJvbX19IGFncmVlcyB0byB0cmFuc2ZlciB7e2Ryb3BsZXRfaWRzfX0gZHJvcHMocykgdG8ge3t0b319LgoKe3sjaWYgbWVtb319VGhlcmUgaXMgYSBtZW1vIGF0dGFjaGVkIHRvIHRoZSB0cmFuc2ZlciBzdGF0aW5nOgp7e21lbW99fQp7ey9pZn19CgpUaGVyZSBpcyBhIG5vdGlmaWNhdGlvbiB0byBiZSBzZW50IHRvIHt7dG99fS4AAAAApOnO1AZ1bmJpbmT2AS0tLQoKc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiB1bmJpbmQKc3VtbWFyeTogJ1VuYmluZCBEcm9wKHMpJwppY29uOiBodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU4MTEzNzgyI2QzYmYyOTBmZGRlZGRiYjdkMzJhYTg5N2U5ZjdlOWUxM2EyYWU0NDk1NjE0MmUyM2ViNDdiNzcwOTZhMmVhOGQKCi0tLQoKe3tvd25lcn19IGFncmVlcyB0byB1bmJpbmQge3tkcm9wbGV0X2lkc319IGRyb3BzKHMpLgAAAABAROPUBnVubG9ja/YBLS0tCgpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IHVubG9jawpzdW1tYXJ5OiAnVW5sb2NrIERyb3AocyknCmljb246IGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xNTgxMTM3ODIjZDNiZjI5MGZkZGVkZGJiN2QzMmFhODk3ZTlmN2U5ZTEzYTJhZTQ0OTU2MTQyZTIzZWI0N2I3NzA5NmEyZWE4ZAoKLS0tCgp7e293bmVyfX0gYWdyZWVzIHRvIHVubG9jayB7e2Ryb3BsZXRfaWRzfX0gZHJvcHMocykuBAAAAFihaaI5A2k2NAAADGJhbGFuY2VzX3JvdwAAAAAAUOlNA2k2NAAACGRyb3Bfcm93AAAAAAAAEY0DaTY0AAAIbG9ja19yb3cAAAAAAJVNxgNpNjQAAAlzdGF0ZV9yb3cBBURyb3BzBURyb3BzAAAACAAAAAAAkKY7BWludDY0AADImCKssj8FaW50NjQAAAAAAOlMRAVpbnQ2NAAAAMDTm7FKFGRlc3Ryb3lfcmV0dXJuX3ZhbHVlAAAAKpurpmIVZ2VuZXJhdGVfcmV0dXJuX3ZhbHVlAAAAAAAwVaUEYm9vbAAAACBjiqS5BWFzc2V0AAAAAKTpztQFaW50NjQ='
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
    @Struct.type('lock')
    export class lock extends Struct {
        @Struct.field(Name)
        owner!: Name
        @Struct.field(UInt64, {array: true})
        droplet_ids!: UInt64[]
    }
    @Struct.type('lock_row')
    export class lock_row extends Struct {
        @Struct.field(UInt64)
        seed!: UInt64
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
    @Struct.type('unlock')
    export class unlock extends Struct {
        @Struct.field(Name)
        owner!: Name
        @Struct.field(UInt64, {array: true})
        droplet_ids!: UInt64[]
    }
}
export const TableMap = {
    balances: Types.balances_row,
    drop: Types.drop_row,
    lock: Types.lock_row,
    state: Types.state_row,
}
export interface TableTypes {
    balances: Types.balances_row
    drop: Types.drop_row
    lock: Types.lock_row
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
    export interface lock {
        owner: NameType
        droplet_ids: UInt64Type[]
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
    export interface unlock {
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
    lock: ActionParams.lock
    logdestroy: ActionParams.logdestroy
    logdrops: ActionParams.logdrops
    loggenerate: ActionParams.loggenerate
    logrambytes: ActionParams.logrambytes
    open: ActionParams.open
    ramcost: ActionParams.ramcost
    transfer: ActionParams.transfer
    unbind: ActionParams.unbind
    unlock: ActionParams.unlock
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
