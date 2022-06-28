import ProsopoContractBase from "./ProsopoContractBase";
import { Signer } from '@polkadot/api/types';
import { TransactionResponse } from '../types';
import { ProsopoRandomProviderResponse } from "../types";
import { CaptchaSolutionCommitment } from "@prosopo/contract";
export declare class ProsopoContract extends ProsopoContractBase {
    getRandomProvider(): Promise<ProsopoRandomProviderResponse>;
    getCaptchaSolutionCommitment(commitmentId: string): Promise<CaptchaSolutionCommitment>;
    dappUserCommit(signer: Signer, captchaDatasetId: string, userMerkleTreeRoot: string, providerAddress: string): Promise<TransactionResponse>;
}
export default ProsopoContract;
//# sourceMappingURL=ProsopoContract.d.ts.map