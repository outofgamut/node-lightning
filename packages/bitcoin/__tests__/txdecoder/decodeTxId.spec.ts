import { expect } from "chai";

import { decodeTxId } from "../../lib/tx-decoder/decodeTxId";

describe("decodeTxId", () => {
    const fixtures = [
    {
      assertion: "legacy transaction",
      input: "0100000001055794064fa88dec7d18b40eef7344dc36b9f45130d51a299341ae571bca56e4010000006a47304402204ea3dd49155908c537fb25b8c4107bb7c358233e347f43aa0eeb6db3f23efcdc02207509e90de86097b39125529e7ea715c4caf7f642d9f3312e04a478867b14250a01210377ddc2de5af3f3f2b8f45cf89ee9e1089cecf01a1d492b3ef6107269c5537506ffffffff029d60dc01000000001976a91463979b23ad714e3bac76ea7f23481ea74f225ebf88ac80110a00000000001976a9146454923514a78f310f3cde44cdf025058c47f35088ac00000000",
      expected: {
        txId: "73c81fc5ad1c9991fbc804967a153e1f8f8e9380c206cdf35c0dc7e20393df22",
        hash: "73c81fc5ad1c9991fbc804967a153e1f8f8e9380c206cdf35c0dc7e20393df22"
      },
    },
    {
      assertion: "segwit transaction",
      input: "01000000000101a4ed39cb5739489cf4afedbfb1673b57738e058a4c4d408ee13e7872949636a40300000000ffffffff02401f7d000000000017a9141119f6b582351101527fe603126a997575ad6650870fe60c0500000000220020701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d0400483045022100995abff56d806f0a4fadd9977f3ea7c16e9695f2938a15dcaf1febfcfff0aba302201ef1010a259d263121d5283db45a12898f212aac96b5a0ecef81c876ea561a5d01483045022100894cd4860dffaf3f6b411157013bbf6b436d32dd63febe5146d47cb84f7f45d302201cf84f40634f898b21159bd0a71013280e21f41da65de036007f37dd6987a0f6016952210375e00eb72e29da82b89367947f29ef34afb75e8654f6ea368e0acdfd92976b7c2103a1b26313f430c4b15bb1fdce663207659d8cac749a0e53d70eff01874496feff2103c96d495bfdd5ba4145e3e046fee45e84a8a48ad05bd8dbb395c011a32cf9f88053ae00000000",
      expected: {
        txId: "839f9c829d4afa456ef98acdd1a4f46bb23298a488db3b261d8c94efa9525fd3",
        hash: "24fe13a9a8166c1c87416b366c6d1751c893059fc2f825fee5c7b1eca7120d49",
      }
    },
  ]; // prettier-ignore

    for (const fixture of fixtures) {
        it(fixture.assertion, () => {
            const actual = decodeTxId(Buffer.from(fixture.input, "hex"));
            expect(actual.txId.toString("hex")).to.equal(fixture.expected.txId);
            expect(actual.hash.toString("hex")).to.equal(fixture.expected.hash);
        });
    }
});
