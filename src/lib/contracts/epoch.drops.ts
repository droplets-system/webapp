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
    'DmVvc2lvOjphYmkvMS4yABUJYWRkb3JhY2xlAAEGb3JhY2xlBG5hbWUHYWR2YW5jZQAACmNoZWNrZXBvY2gAAwdnZW5lc2lzFGJsb2NrX3RpbWVzdGFtcF90eXBlCGR1cmF0aW9uBnVpbnQzMgVlcG9jaAZ1aW50NjQKY2xlYXJ0YWJsZQADCnRhYmxlX25hbWUEbmFtZQVzY29wZQVuYW1lPwhtYXhfcm93cwd1aW50NjQ/BmNvbW1pdAADBm9yYWNsZQRuYW1lBWVwb2NoBnVpbnQ2NAZjb21taXQLY2hlY2tzdW0yNTYKY29tbWl0X3JvdwAEAmlkBnVpbnQ2NAVlcG9jaAZ1aW50NjQGb3JhY2xlBG5hbWUGY29tbWl0C2NoZWNrc3VtMjU2C2NvbXB1dGVoYXNoAAIFZXBvY2gGdWludDY0B3JldmVhbHMIc3RyaW5nW10IZHVyYXRpb24AAQhkdXJhdGlvbgZ1aW50MzIGZW5hYmxlAAEHZW5hYmxlZARib29sCWVwb2NoX3JvdwADBWVwb2NoBnVpbnQ2NAdvcmFjbGVzBm5hbWVbXQRzZWVkC2NoZWNrc3VtMjU2C2ZvcmNlcmV2ZWFsAAIFZXBvY2gGdWludDY0BHNhbHQGc3RyaW5nCGdldGVwb2NoAAAKZ2V0b3JhY2xlcwAABGluaXQAAApvcmFjbGVfcm93AAEGb3JhY2xlBG5hbWUMcmVtb3Zlb3JhY2xlAAEGb3JhY2xlBG5hbWUGcmV2ZWFsAAMGb3JhY2xlBG5hbWUFZXBvY2gGdWludDY0BnJldmVhbAZzdHJpbmcKcmV2ZWFsX3JvdwAEAmlkBnVpbnQ2NAVlcG9jaAZ1aW50NjQGb3JhY2xlBG5hbWUGcmV2ZWFsBnN0cmluZwlzdGF0ZV9yb3cAAwdnZW5lc2lzFGJsb2NrX3RpbWVzdGFtcF90eXBlCGR1cmF0aW9uBnVpbnQzMgdlbmFibGVkBGJvb2wEdGVzdAABBGRhdGEGc3RyaW5nBHdpcGUAABAAAFARmUtTMglhZGRvcmFjbGUAAAAAQKFpdjIHYWR2YW5jZQAAQEO0KohUQwpjaGVja2Vwb2NoAACAisfka1RECmNsZWFydGFibGUAAAAAAGQnJUUGY29tbWl0AAAaNk1lXSVFC2NvbXB1dGVoYXNoAAAAAJO6bK5OCGR1cmF0aW9uAAAAAACoeMxUBmVuYWJsZQAAolFbXYUuXQtmb3JjZXJldmVhbAAAAAAN0aqyYghnZXRlcG9jaAAAAFYRmUuzYgpnZXRvcmFjbGVzAAAAAAAAkN10BGluaXQAoCIyl6pNpboMcmVtb3Zlb3JhY2xlAAAAAABEo7a6BnJldmVhbAAAAAAAAJCxygR0ZXN0AAAAAAAAoKrjBHdpcGUABQAAAABkJyVFA2k2NAAACmNvbW1pdF9yb3cAAAAAgIZoVQNpNjQAAAllcG9jaF9yb3cAAAAAqIjMpQNpNjQAAApvcmFjbGVfcm93AAAAAESjtroDaTY0AAAKcmV2ZWFsX3JvdwAAAAAAlU3GA2k2NAAACXN0YXRlX3JvdwAAAAAEAAAAQKFpdjIJZXBvY2hfcm93ABo2TWVdJUULY2hlY2tzdW0yNTYAAAAN0aqyYgZ1aW50NjQAAFYRmUuzYgZuYW1lW10='
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
    checkepoch: ActionParams.checkepoch
    cleartable: ActionParams.cleartable
    commit: ActionParams.commit
    computehash: ActionParams.computehash
    duration: ActionParams.duration
    enable: ActionParams.enable
    forcereveal: ActionParams.forcereveal
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
    export interface checkepoch {
        genesis: BlockTimestamp
        duration: UInt32Type
        epoch: UInt64Type
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
    export interface computehash {
        epoch: UInt64Type
        reveals: string[]
    }
    export interface duration {
        duration: UInt32Type
    }
    export interface enable {
        enabled: boolean
    }
    export interface forcereveal {
        epoch: UInt64Type
        salt: string
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
    @Struct.type('checkepoch')
    export class checkepoch extends Struct {
        @Struct.field(BlockTimestamp)
        genesis!: BlockTimestamp
        @Struct.field(UInt32)
        duration!: UInt32
        @Struct.field(UInt64)
        epoch!: UInt64
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
    @Struct.type('computehash')
    export class computehash extends Struct {
        @Struct.field(UInt64)
        epoch!: UInt64
        @Struct.field('string', {array: true})
        reveals!: string[]
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
        @Struct.field(Checksum256)
        seed!: Checksum256
    }
    @Struct.type('forcereveal')
    export class forcereveal extends Struct {
        @Struct.field(UInt64)
        epoch!: UInt64
        @Struct.field('string')
        salt!: string
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
    computehash: Checksum256
    getepoch: UInt64
    getoracles: Name[]
}
export type ActionReturnNames = keyof ActionReturnValues
