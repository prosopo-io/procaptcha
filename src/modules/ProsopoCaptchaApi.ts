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
import { randomAsHex, blake2AsHex } from '@polkadot/util-crypto';
// import {computeCaptchaSolutionHash} from '@prosopo/provider'; // TODO
import { CaptchaSolution, CaptchaMerkleTree, CaptchaSolutionCommitment } from '@prosopo/contract';
import { Signer } from "@polkadot/api/types";

import { ProsopoRandomProviderResponse, GetCaptchaResponse, CaptchaSolutionResponse } from "../types/api";
import { TransactionResponse } from "../types/contract";

import ProviderApi from "../api/ProviderApi";
import ProsopoContract from "../api/ProsopoContract";
import { TCaptchaSubmitResult } from '../types/client';
import {ProsopoApiError} from "../api/handlers";


function hexHash(data: string | Uint8Array): string {
    return blake2AsHex(data);
}

function computeCaptchaSolutionHash(captcha: CaptchaSolution) {
    return hexHash([captcha.captchaId, captcha.solution, captcha.salt].join());
}

export class ProsopoCaptchaApi {

    protected contract: ProsopoContract;
    protected provider: ProsopoRandomProviderResponse;
    protected providerApi: ProviderApi;

    constructor(contract: ProsopoContract, provider: ProsopoRandomProviderResponse, providerApi: ProviderApi) {
        this.contract = contract;
        this.provider = provider;
        this.providerApi = providerApi;
    }

    public async getCaptchaChallenge(): Promise<GetCaptchaResponse> {
        let captchaChallenge: GetCaptchaResponse;
        try {
            captchaChallenge = await this.providerApi.getCaptchaChallenge(this.provider);
        } catch (err) {
            throw new ProsopoApiError(err)
        }
        return captchaChallenge;
    }

    public async submitCaptchaSolution(signer: Signer, requestHash: string, datasetId: string, solutions: CaptchaSolution[]) : Promise<TCaptchaSubmitResult> {
        const salt = randomAsHex();
        const tree = new CaptchaMerkleTree();
        const captchaSolutionsSalted: CaptchaSolution[] = solutions.map(solution => ({...solution, salt: salt}));
        const captchasHashed = captchaSolutionsSalted.map((captcha) => computeCaptchaSolutionHash(captcha));

        tree.build(captchasHashed);
        const commitmentId = tree.root!.hash;

        console.log("solveCaptchaChallenge commitmentId", commitmentId);
        // console.log("solveCaptchaChallenge USER ACCOUNT", this.contract.getAccount().address);
        // console.log("solveCaptchaChallenge DAPP ACCOUNT", this.contract.getDappAddress());
        // console.log("solveCaptchaChallenge CONTRACT ADDRESS", this.contract.getContract().address.toString());

        let tx: TransactionResponse;

        try {
            tx = await this.contract.dappUserCommit(signer, datasetId as string, commitmentId, this.provider.providerId);
        } catch (err) {
            throw new ProsopoApiError(err)
        }

        let result: CaptchaSolutionResponse;

        try {
            result = await this.providerApi.submitCaptchaSolution(tx.blockHash!, captchaSolutionsSalted, requestHash, tx.txHash.toString(), this.contract.getAccount().address);
        } catch (err) {
            throw new ProsopoApiError(err)
        }

        let commitment: CaptchaSolutionCommitment;

        // TODO concurrency?
        try {
            commitment = await this.contract.getCaptchaSolutionCommitment(commitmentId);
        } catch (err) {
            throw new ProsopoApiError(err)
        }

        return [result, tx, commitment];
    }

}

export default ProsopoCaptchaApi;

