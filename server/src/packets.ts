import { BitStream } from "@damienvesper/bit-buffer";
export class IslandrBitStream extends BitStream {
    constructor(source: ArrayBuffer, byteOffset = 0, byteLength = 0) {
        super(source, byteOffset, byteLength);
    }
    static alloc(buffer_length: number) {
        return new IslandrBitStream(new ArrayBuffer(buffer_length))
    }
    writePacketType(type: number) {
        this.writeInt8(type)
    }
    writeNumber(size: number) {
        this.writeInt32(size)
    }
    writeUsername(data: string) {
        this.writeASCIIString(data)
    }
    writeId(id: string) {
        this.writeASCIIString(id)
    }
    writeSkinOrLoadout(skin: string) {
        this.writeASCIIString(skin, 10)
    }
    writeAccessToken(accessToken: string) {
        this.writeASCIIString(accessToken, 30)
    }
    writeMode(mode: string) {
        this.writeASCIIString(mode, 15)
    }
    writePlayerDirection(direction: number) {
        this.writeInt16(direction)
    }
    writeHealingItem(healItem: string) {
        this.writeASCIIString(healItem, 15)
    }
    readPlayerDirection() {
        return this.readInt8()
    }
    readMode() {
        return this.readASCIIString(15)
    }
    readAccessToken() {
        return this.readASCIIString()
    }
    readSkinOrLoadout() {
        return this.readASCIIString(10)
    }
    readId() {
        return this.readASCIIString()
    }
    readUsername() {
        return this.readASCIIString()
    }
    readPacketType() {
        return this.readInt8()
    }
    readNumber() {
        return this.readInt32()
    }
    readHealingItem() {
        return this.readASCIIString(15)
    }
}