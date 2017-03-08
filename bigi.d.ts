// Type definitions for BigInteger 1.4
// Project: https://github.com/cryptocoinjs/BigInteger#readme
// Definitions by: Mohamed Hegazy <https://github.com/mhegazy>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "BigInteger" {
    export = BigInteger;
}

declare class BigInteger {
    constructor(str: string, b: number);
    abs(): BigInteger;
    add(a: BigInteger): BigInteger;
    and(a: BigInteger): BigInteger;
    bitCount(): number;
    clearBit(n: number): BigInteger;
    clone(): BigInteger;
    compareTo(a: BigInteger): number;
    divide(a: BigInteger): BigInteger;
    equals(a: BigInteger): boolean;
    flipBit(n: number): BigInteger;
    intValue(): number;
    modInverse(m: number): BigInteger;
    multiply(a: BigInteger): BigInteger;
    negate(): BigInteger;
    not(): BigInteger;
    or(a: BigInteger): BigInteger;
    pow(e: BigInteger): BigInteger;
    remainder(a: BigInteger): BigInteger;
    setBit(n: number): BigInteger;
    shiftLeft(n: number): BigInteger;
    shiftRight(n: number): BigInteger;
    shortValue(): BigInteger;
    signum(): number;
    square(): BigInteger;
    subtract(a: BigInteger): BigInteger;
    testBit(n: number): BigInteger;
    toString(base: number): string;
    toRadix(b: number): string;
    xor(a: BigInteger): BigInteger;
    static fromHex(hex: string): BigInteger;
}
declare namespace BigInteger {
    const ONE: BigInteger;
    const ZERO: BigInteger;
}