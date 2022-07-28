// Copyright 2021-2022 Prosopo (UK) Ltd.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// import {Hash} from '@polkadot/types/interfaces';
import ProsopoContractBase from "./ProsopoContractBase";
import { Signer } from '@polkadot/api/types';
import {ProsopoDappOperatorIsHumanUserResponse, TransactionResponse} from '../types';
import { ProsopoRandomProviderResponse } from "../types";
import { CaptchaSolutionCommitment } from "@prosopo/contract";

// TODO: import return types from provider: separate types/common package.
export class ProsopoContract extends ProsopoContractBase {

    public async getRandomProvider(): Promise<ProsopoRandomProviderResponse> {
        return await this.query('getRandomActiveProvider', [this.account.address, this.dappAddress]) as ProsopoRandomProviderResponse;
    }

    public async getCaptchaSolutionCommitment(commitmentId: string) {
        return await this.query('getCaptchaSolutionCommitment', [commitmentId]) as CaptchaSolutionCommitment;
    }

    public async dappUserCommit(signer: Signer, captchaDatasetId: string, userMerkleTreeRoot: string, providerAddress: string): Promise<TransactionResponse> {
        return await this.transaction(signer, 'dappUserCommit', [this.dappAddress, captchaDatasetId, userMerkleTreeRoot, providerAddress]);
    }

    public async dappOperatorIsHumanUser(threshold: number): Promise<ProsopoDappOperatorIsHumanUserResponse> {
        // TODO get threshold from dapp contract using getStorage or allow override in UI and fallback on contract protection layer?
        return await this.query('dappOperatorIsHumanUser', [this.account.address, threshold]) as ProsopoDappOperatorIsHumanUserResponse;
    }



}

export default ProsopoContract;
