import type {Action, Checksum256Type, NameType, UInt32Type, UInt64Type} from '@wharfkit/antelope'
import {
    ABI,
    Blob,
    BlockTimestamp,
    Checksum256,
    Name,
    Struct,
    UInt32,
    UInt64,
} from '@wharfkit/antelope'
import type {ActionOptions, ContractArgs, PartialBy, Table} from '@wharfkit/contract'
import {Contract as BaseContract} from '@wharfkit/contract'
export const abiBlob = Blob.from(
    'DmVvc2lvOjphYmkvMS4yAA8JYWRkb3JhY2xlAAEGb3JhY2xlBG5hbWUKY2xlYXJ0YWJsZQADCnRhYmxlX25hbWUEbmFtZQVzY29wZQVuYW1lPwhtYXhfcm93cwd1aW50NjQ/BmNvbW1pdAADBm9yYWNsZQRuYW1lBWVwb2NoBnVpbnQ2NAZjb21taXQLY2hlY2tzdW0yNTYKY29tbWl0X3JvdwAEAmlkBnVpbnQ2NAVlcG9jaAZ1aW50NjQGb3JhY2xlBG5hbWUGY29tbWl0C2NoZWNrc3VtMjU2BmVuYWJsZQABB2VuYWJsZWQEYm9vbAllcG9jaF9yb3cABAVlcG9jaAZ1aW50NjQHb3JhY2xlcwZuYW1lW10JY29tcGxldGVkBnVpbnQ2NARzZWVkC2NoZWNrc3VtMjU2C2Vwb2NobGVuZ3RoAAELZXBvY2hsZW5ndGgGdWludDMyBGluaXQAAApvcmFjbGVfcm93AAEGb3JhY2xlBG5hbWUMcmVtb3Zlb3JhY2xlAAEGb3JhY2xlBG5hbWUKcmV2ZWFsX3JvdwAEAmlkBnVpbnQ2NAVlcG9jaAZ1aW50NjQGb3JhY2xlBG5hbWUGcmV2ZWFsBnN0cmluZwlzdGF0ZV9yb3cAAwdnZW5lc2lzFGJsb2NrX3RpbWVzdGFtcF90eXBlC2Vwb2NobGVuZ3RoBnVpbnQzMgdlbmFibGVkBGJvb2wOc3Vic2NyaWJlcl9yb3cAAQpzdWJzY3JpYmVyBG5hbWUEdGVzdAABBGRhdGEGc3RyaW5nBHdpcGUAAAkAAFARmUtTMglhZGRvcmFjbGUAAICKx+RrVEQKY2xlYXJ0YWJsZQAAAAAAZCclRQZjb21taXQAAAAAAKh4zFQGZW5hYmxlAABaZlPFhmhVC2Vwb2NobGVuZ3RoAAAAAAAAkN10BGluaXQAoCIyl6pNpboMcmVtb3Zlb3JhY2xlAAAAAAAAkLHKBHRlc3QAAAAAAACgquMEd2lwZQAGAAAAAGQnJUUDaTY0AAAKY29tbWl0X3JvdwAAAACAhmhVA2k2NAAACWVwb2NoX3JvdwAAAACoiMylA2k2NAAACm9yYWNsZV9yb3cAAAAARKO2ugNpNjQAAApyZXZlYWxfcm93AAAAAACVTcYDaTY0AAAJc3RhdGVfcm93AMBVx12Ej8YDaTY0AAAOc3Vic2NyaWJlcl9yb3cAAAAAAA=='
)
export const abi = ABI.from(abiBlob)
export class Contract extends BaseContract {
    constructor(args: PartialBy<ContractArgs, 'abi' | 'account'>) {
        super({
            client: args.client,
            abi: abi,
            account: args.account || Name.from('epoch.drops'),
        })
    }
    action<T extends ActionNames>(
        name: T,
        data: ActionNameParams[T],
        options?: ActionOptions
    ): Action {
        return super.action(name, data, options)
    }
    table<T extends TableNames>(name: T, scope?: NameType): Table<RowType<T>> {
        return super.table(name, scope, TableMap[name])
    }
}
export interface ActionNameParams {
    addoracle: ActionParams.addoracle
    cleartable: ActionParams.cleartable
    commit: ActionParams.commit
    enable: ActionParams.enable
    epochlength: ActionParams.epochlength
    init: ActionParams.init
    removeoracle: ActionParams.removeoracle
    test: ActionParams.test
    wipe: ActionParams.wipe
}
export namespace ActionParams {
    export namespace Type {}
    export interface addoracle {
        oracle: NameType
    }
    export interface cleartable {
        table_name: NameType
        scope?: NameType
        max_rows?: UInt64Type
    }
    export interface commit {
        oracle: NameType
        epoch: UInt64Type
        commit: Checksum256Type
    }
    export interface enable {
        enabled: boolean
    }
    export interface epochlength {
        epochlength: UInt32Type
    }
    export interface init {}
    export interface removeoracle {
        oracle: NameType
    }
    export interface test {
        data: string
    }
    export interface wipe {}
}
export namespace Types {
    @Struct.type('addoracle')
    export class addoracle extends Struct {
        @Struct.field(Name)
        oracle!: Name
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
    @Struct.type('commit')
    export class commit extends Struct {
        @Struct.field(Name)
        oracle!: Name
        @Struct.field(UInt64)
        epoch!: UInt64
        @Struct.field(Checksum256)
        commit!: Checksum256
    }
    @Struct.type('commit_row')
    export class commit_row extends Struct {
        @Struct.field(UInt64)
        id!: UInt64
        @Struct.field(UInt64)
        epoch!: UInt64
        @Struct.field(Name)
        oracle!: Name
        @Struct.field(Checksum256)
        commit!: Checksum256
    }
    @Struct.type('enable')
    export class enable extends Struct {
        @Struct.field('bool')
        enabled!: boolean
    }
    @Struct.type('epoch_row')
    export class epoch_row extends Struct {
        @Struct.field(UInt64)
        epoch!: UInt64
        @Struct.field(Name, {array: true})
        oracles!: Name[]
        @Struct.field(UInt64)
        completed!: UInt64
        @Struct.field(Checksum256)
        seed!: Checksum256
    }
    @Struct.type('epochlength')
    export class epochlength extends Struct {
        @Struct.field(UInt32)
        epochlength!: UInt32
    }
    @Struct.type('init')
    export class init extends Struct {}
    @Struct.type('oracle_row')
    export class oracle_row extends Struct {
        @Struct.field(Name)
        oracle!: Name
    }
    @Struct.type('removeoracle')
    export class removeoracle extends Struct {
        @Struct.field(Name)
        oracle!: Name
    }
    @Struct.type('reveal_row')
    export class reveal_row extends Struct {
        @Struct.field(UInt64)
        id!: UInt64
        @Struct.field(UInt64)
        epoch!: UInt64
        @Struct.field(Name)
        oracle!: Name
        @Struct.field('string')
        reveal!: string
    }
    @Struct.type('state_row')
    export class state_row extends Struct {
        @Struct.field(BlockTimestamp)
        genesis!: BlockTimestamp
        @Struct.field(UInt32)
        epochlength!: UInt32
        @Struct.field('bool')
        enabled!: boolean
    }
    @Struct.type('subscriber_row')
    export class subscriber_row extends Struct {
        @Struct.field(Name)
        subscriber!: Name
    }
    @Struct.type('test')
    export class test extends Struct {
        @Struct.field('string')
        data!: string
    }
    @Struct.type('wipe')
    export class wipe extends Struct {}
}
export const TableMap = {
    commit: Types.commit_row,
    epoch: Types.epoch_row,
    oracle: Types.oracle_row,
    reveal: Types.reveal_row,
    state: Types.state_row,
    subscriber: Types.subscriber_row,
}
export interface TableTypes {
    commit: Types.commit_row
    epoch: Types.epoch_row
    oracle: Types.oracle_row
    reveal: Types.reveal_row
    state: Types.state_row
    subscriber: Types.subscriber_row
}
export type RowType<T> = T extends keyof TableTypes ? TableTypes[T] : any
export type ActionNames = keyof ActionNameParams
export type TableNames = keyof TableTypes
