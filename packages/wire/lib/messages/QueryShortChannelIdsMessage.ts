import { BufferReader, BufferWriter } from "@lntools/bufio";
import { MessageType } from "../MessageType";
import { Encoder } from "../serialize/Encoder";
import { EncodingType } from "../serialize/EncodingType";
import { TlvStreamReader } from "../serialize/TlvStreamReader";
import { ShortChannelId } from "../ShortChannelId";
import { shortChannelIdFromBuffer } from "../ShortChannelIdUtils";
import { IWireMessage } from "./IWireMessage";
import { QueryShortChannelIdsFlags } from "./tlvs/QueryShortChannelIdsFlags";

export class QueryShortChannelIdsMessage implements IWireMessage {
    public static deserialize(payload: Buffer): QueryShortChannelIdsMessage {
        const reader = new BufferReader(payload);
        reader.readUInt16BE(); // read off type

        const instance = new QueryShortChannelIdsMessage();
        instance.chainHash = reader.readBytes(32);

        const len = reader.readUInt16BE();
        const esidBuffer = reader.readBytes(len);

        const rawShortIdBuffer = new Encoder().decode(esidBuffer);
        const reader2 = new BufferReader(rawShortIdBuffer);
        while (!reader2.eof) {
            instance.shortChannelIds.push(shortChannelIdFromBuffer(reader2.readBytes(8)));
        }

        const tlvStreamReader = new TlvStreamReader();
        tlvStreamReader.register(QueryShortChannelIdsFlags);
        const tlvs = tlvStreamReader.read(reader);

        instance.flags = tlvs.find(p => p.type === QueryShortChannelIdsFlags.type);

        return instance;
    }

    /**
     * Type 261
     */
    public type: MessageType = MessageType.QueryShortChannelIds;

    /**
     * 32-byte chain hash
     */
    public chainHash: Buffer;

    /**
     * List of channels to query
     */
    public shortChannelIds: ShortChannelId[] = [];

    /**
     * Optional flags that can be set when gossip_queries_ex is enabled.
     */
    public flags: QueryShortChannelIdsFlags;

    public serialize(encoding: EncodingType = EncodingType.ZlibDeflate): Buffer {
        const rawIdsBuffer = Buffer.concat(this.shortChannelIds.map(p => p.toBuffer()));
        const esids = new Encoder().encode(encoding, rawIdsBuffer);
        const flags = this.flags ? this.flags.serialize(encoding) : Buffer.alloc(0);

        const len =
            2 + // type
            32 + // chain_hash
            2 + // encoded_short_ids len
            esids.length + // encoded_short_ids
            flags.length;

        const writer = new BufferWriter(Buffer.alloc(len));
        writer.writeUInt16BE(this.type);
        writer.writeBytes(this.chainHash);
        writer.writeUInt16BE(esids.length);
        writer.writeBytes(esids);

        if (flags.length) {
            writer.writeBytes(flags);
        }

        return writer.toBuffer();
    }
}