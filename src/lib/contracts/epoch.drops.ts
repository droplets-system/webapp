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
    'DmVvc2lvOjphYmkvMS4yABIJYWRkb3JhY2xlAAEGb3JhY2xlBG5hbWUHYWR2YW5jZQAACmNsZWFydGFibGUAAwp0YWJsZV9uYW1lBG5hbWUFc2NvcGUFbmFtZT8IbWF4X3Jvd3MHdWludDY0PwZjb21taXQAAwZvcmFjbGUEbmFtZQVlcG9jaAZ1aW50NjQGY29tbWl0C2NoZWNrc3VtMjU2CmNvbW1pdF9yb3cABAJpZAZ1aW50NjQFZXBvY2gGdWludDY0Bm9yYWNsZQRuYW1lBmNvbW1pdAtjaGVja3N1bTI1NghkdXJhdGlvbgABCGR1cmF0aW9uBnVpbnQzMgZlbmFibGUAAQdlbmFibGVkBGJvb2wJZXBvY2hfcm93AAQFZXBvY2gGdWludDY0B29yYWNsZXMGbmFtZVtdCWNvbXBsZXRlZAZ1aW50NjQEc2VlZAtjaGVja3N1bTI1NghnZXRlcG9jaAAACmdldG9yYWNsZXMAAARpbml0AAAKb3JhY2xlX3JvdwABBm9yYWNsZQRuYW1lDHJlbW92ZW9yYWNsZQABBm9yYWNsZQRuYW1lBnJldmVhbAADBm9yYWNsZQRuYW1lBWVwb2NoBnVpbnQ2NAZyZXZlYWwGc3RyaW5nCnJldmVhbF9yb3cABAJpZAZ1aW50NjQFZXBvY2gGdWludDY0Bm9yYWNsZQRuYW1lBnJldmVhbAZzdHJpbmcJc3RhdGVfcm93AAMHZ2VuZXNpcxRibG9ja190aW1lc3RhbXBfdHlwZQhkdXJhdGlvbgZ1aW50MzIHZW5hYmxlZARib29sBHRlc3QAAQRkYXRhBnN0cmluZwR3aXBlAAANAABQEZlLUzIJYWRkb3JhY2xlAAAAAEChaXYyB2FkdmFuY2UAAICKx+RrVEQKY2xlYXJ0YWJsZQAAAAAAZCclRQZjb21taXQAAAAAk7psrk4IZHVyYXRpb24AAAAAAKh4zFQGZW5hYmxlAAAAAA3RqrJiCGdldGVwb2NoAAAAVhGZS7NiCmdldG9yYWNsZXMAAAAAAACQ3XQEaW5pdACgIjKXqk2lugxyZW1vdmVvcmFjbGUAAAAAAESjtroGcmV2ZWFsAAAAAAAAkLHKBHRlc3QAAAAAAACgquMEd2lwZQAFAAAAAGQnJUUDaTY0AAAKY29tbWl0X3JvdwAAAACAhmhVA2k2NAAACWVwb2NoX3JvdwAAAACoiMylA2k2NAAACm9yYWNsZV9yb3cAAAAARKO2ugNpNjQAAApyZXZlYWxfcm93AAAAAACVTcYDaTY0AAAJc3RhdGVfcm93AAAAAAMAAABAoWl2MgllcG9jaF9yb3cAAAAN0aqyYgZ1aW50NjQAAFYRmUuzYgZuYW1lW10='
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
    addoracle: ActionParams.addoracle
    advance: ActionParams.advance
    cleartable: ActionParams.cleartable
    commit: ActionParams.commit
    duration: ActionParams.duration
    enable: ActionParams.enable
    getepoch: ActionParams.getepoch
    getoracles: ActionParams.getoracles
    init: ActionParams.init
    removeoracle: ActionParams.removeoracle
    reveal: ActionParams.reveal
    test: ActionParams.test
    wipe: ActionParams.wipe
}
export namespace ActionParams {
    export namespace Type {}
    export interface addoracle {
        oracle: NameType
    }
    export interface advance {}
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
    export interface duration {
        duration: UInt32Type
    }
    export interface enable {
        enabled: boolean
    }
    export interface getepoch {}
    export interface getoracles {}
    export interface init {}
    export interface removeoracle {
        oracle: NameType
    }
    export interface reveal {
        oracle: NameType
        epoch: UInt64Type
        reveal: string
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
    @Struct.type('advance')
    export class advance extends Struct {}
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
    @Struct.type('duration')
    export class duration extends Struct {
        @Struct.field(UInt32)
        duration!: UInt32
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
    @Struct.type('getepoch')
    export class getepoch extends Struct {}
    @Struct.type('getoracles')
    export class getoracles extends Struct {}
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
    @Struct.type('reveal')
    export class reveal extends Struct {
        @Struct.field(Name)
        oracle!: Name
        @Struct.field(UInt64)
        epoch!: UInt64
        @Struct.field('string')
        reveal!: string
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
        duration!: UInt32
        @Struct.field('bool')
        enabled!: boolean
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
}
export interface TableTypes {
    commit: Types.commit_row
    epoch: Types.epoch_row
    oracle: Types.oracle_row
    reveal: Types.reveal_row
    state: Types.state_row
}
export type RowType<T> = T extends keyof TableTypes ? TableTypes[T] : any
export type ActionNames = keyof ActionNameParams
export type TableNames = keyof TableTypes
export interface ActionReturnValues {
    advance: Types.epoch_row
    getepoch: UInt64
    getoracles: Name[]
}
export type ActionReturnNames = keyof ActionReturnValues
