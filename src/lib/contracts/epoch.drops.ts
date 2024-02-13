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
    'DmVvc2lvOjphYmkvMS4yABYJYWRkb3JhY2xlAAEGb3JhY2xlBG5hbWUHYWR2YW5jZQAACmNsZWFydGFibGUAAwp0YWJsZV9uYW1lBG5hbWUFc2NvcGUFbmFtZT8IbWF4X3Jvd3MHdWludDY0PwZjb21taXQAAwZvcmFjbGUEbmFtZQVlcG9jaAZ1aW50NjQGY29tbWl0C2NoZWNrc3VtMjU2CmNvbW1pdF9yb3cABAJpZAZ1aW50NjQFZXBvY2gGdWludDY0Bm9yYWNsZQRuYW1lBmNvbW1pdAtjaGVja3N1bTI1Ngtjb21wdXRlaGFzaAACBWVwb2NoBnVpbnQ2NAdyZXZlYWxzCHN0cmluZ1tdCGR1cmF0aW9uAAEIZHVyYXRpb24GdWludDMyBmVuYWJsZQABB2VuYWJsZWQEYm9vbAplcG9jaF9pbmZvAAUFZXBvY2gGdWludDY0BXN0YXJ0FGJsb2NrX3RpbWVzdGFtcF90eXBlA2VuZBRibG9ja190aW1lc3RhbXBfdHlwZQRzZWVkC2NoZWNrc3VtMjU2B29yYWNsZXMGbmFtZVtdCWVwb2NoX3JvdwADBWVwb2NoBnVpbnQ2NAdvcmFjbGVzBm5hbWVbXQRzZWVkC2NoZWNrc3VtMjU2C2ZvcmNlcmV2ZWFsAAIFZXBvY2gGdWludDY0BHNhbHQGc3RyaW5nCGdldGVwb2NoAAAMZ2V0ZXBvY2hpbmZvAAEFZXBvY2gHdWludDY0PwpnZXRvcmFjbGVzAAAEaW5pdAAACm9yYWNsZV9yb3cAAQZvcmFjbGUEbmFtZQxyZW1vdmVvcmFjbGUAAQZvcmFjbGUEbmFtZQZyZXZlYWwAAwZvcmFjbGUEbmFtZQVlcG9jaAZ1aW50NjQGcmV2ZWFsBnN0cmluZwpyZXZlYWxfcm93AAQCaWQGdWludDY0BWVwb2NoBnVpbnQ2NAZvcmFjbGUEbmFtZQZyZXZlYWwGc3RyaW5nCXN0YXRlX3JvdwADB2dlbmVzaXMUYmxvY2tfdGltZXN0YW1wX3R5cGUIZHVyYXRpb24GdWludDMyB2VuYWJsZWQEYm9vbAR0ZXN0AAEEZGF0YQZzdHJpbmcEd2lwZQAAEAAAUBGZS1MyCWFkZG9yYWNsZQAAAABAoWl2MgdhZHZhbmNlAACAisfka1RECmNsZWFydGFibGUAAAAAAGQnJUUGY29tbWl0AAAaNk1lXSVFC2NvbXB1dGVoYXNoAAAAAJO6bK5OCGR1cmF0aW9uAAAAAACoeMxUBmVuYWJsZQAAolFbXYUuXQtmb3JjZXJldmVhbAAAAAAN0aqyYghnZXRlcG9jaABA13QN0aqyYgxnZXRlcG9jaGluZm8AAABWEZlLs2IKZ2V0b3JhY2xlcwAAAAAAAJDddARpbml0AKAiMpeqTaW6DHJlbW92ZW9yYWNsZQAAAAAARKO2ugZyZXZlYWwAAAAAAACQscoEdGVzdAAAAAAAAKCq4wR3aXBlAAUAAAAAZCclRQNpNjQAAApjb21taXRfcm93AAAAAICGaFUDaTY0AAAJZXBvY2hfcm93AAAAAKiIzKUDaTY0AAAKb3JhY2xlX3JvdwAAAABEo7a6A2k2NAAACnJldmVhbF9yb3cAAAAAAJVNxgNpNjQAAAlzdGF0ZV9yb3cAAAAABQAAAEChaXYyCWVwb2NoX3JvdwAaNk1lXSVFC2NoZWNrc3VtMjU2AAAADdGqsmIGdWludDY0QNd0DdGqsmIKZXBvY2hfaW5mbwAAVhGZS7NiBm5hbWVbXQ=='
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
    computehash: ActionParams.computehash
    duration: ActionParams.duration
    enable: ActionParams.enable
    forcereveal: ActionParams.forcereveal
    getepoch: ActionParams.getepoch
    getepochinfo: ActionParams.getepochinfo
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
    export interface getepochinfo {
        epoch?: UInt64Type
    }
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
    @Struct.type('epoch_info')
    export class epoch_info extends Struct {
        @Struct.field(UInt64)
        epoch!: UInt64
        @Struct.field(BlockTimestamp)
        start!: BlockTimestamp
        @Struct.field(BlockTimestamp)
        end!: BlockTimestamp
        @Struct.field(Checksum256)
        seed!: Checksum256
        @Struct.field(Name, {array: true})
        oracles!: Name[]
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
    @Struct.type('getepochinfo')
    export class getepochinfo extends Struct {
        @Struct.field(UInt64, {optional: true})
        epoch?: UInt64
    }
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
    getepochinfo: Types.epoch_info
    getoracles: Name[]
}
export type ActionReturnNames = keyof ActionReturnValues
