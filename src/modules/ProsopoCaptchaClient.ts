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
import { ICaptchaContextReducer, CaptchaEventCallbacks, TExtensionAccount, ICaptchaStatusReducer, IExtensionInterface } from "../types/client";
import { ProsopoRandomProviderResponse } from "../types/api";

import { ProsopoContract } from "../api/ProsopoContract";
import { getProsopoContract, getWsProvider } from "./contract";
import { getExtension } from "./extension";
import { ProviderApi } from "../api/ProviderApi";
import { ProsopoCaptchaApi } from "./ProsopoCaptchaApi";
// import { Extension } from "../api";


export class ProsopoCaptchaClient {

    public manager: ICaptchaContextReducer;
    public status: ICaptchaStatusReducer;
    public callbacks: CaptchaEventCallbacks | undefined;
    public providerApi: ProviderApi;
    public solutionThreshold: number

    private static extension: IExtensionInterface;
    private static contract: ProsopoContract | undefined;
    private static provider: ProsopoRandomProviderResponse | undefined;
    private static captchaApi: ProsopoCaptchaApi | undefined;

    constructor(manager: ICaptchaContextReducer, status: ICaptchaStatusReducer, callbacks?: CaptchaEventCallbacks) {
        this.manager = manager;
        this.status = status;
        this.callbacks = callbacks;
        this.providerApi = new ProviderApi(manager.state.config);
        this.solutionThreshold = manager.state.config.solutionThreshold
    }

    public getExtension() {
        return ProsopoCaptchaClient.extension;
    }

    public setExtension(extension: IExtensionInterface) {
        return ProsopoCaptchaClient.extension = extension;
    }

    public getContract() {
        return ProsopoCaptchaClient.contract;
    }

    public getProvider() {
        return ProsopoCaptchaClient.provider;
    }

    public getCaptchaApi() {
        return ProsopoCaptchaClient.captchaApi;
    }

    public async onLoad() {
        let contractAddress = ProsopoCaptchaClient.contract?.address;

        if (!ProsopoCaptchaClient.extension || !contractAddress) {
            try {
                [ProsopoCaptchaClient.extension, { contractAddress }] = await Promise.all([getExtension(), this.providerApi.getContractAddress()]);
            } catch (err) {
                throw new Error(err);
            }
        }

        if (this.callbacks?.onLoad) {
            this.callbacks.onLoad(ProsopoCaptchaClient.extension, contractAddress);
        }

        this.manager.update({ contractAddress });
    }

    public async onAccountChange(account?: TExtensionAccount) {
        if (!account) {
            this.onAccountUnset();
            return;
        }

        try {
            ProsopoCaptchaClient.extension.setAccount(account.address);
        } catch (err) {
            throw new Error(err);
        }

        try {
            ProsopoCaptchaClient.contract = await getProsopoContract(this.manager.state.contractAddress!, this.manager.state.config['dappAccount'], account,
                await getWsProvider(this.manager.state.config['dappUrl']));
        } catch (err) {
            throw new Error(err);
        }

        try {
            ProsopoCaptchaClient.provider = await ProsopoCaptchaClient.contract.getRandomProvider(); // TODO how often should provider change?
        } catch (err) {
            throw new Error(err);
        }

        ProsopoCaptchaClient.captchaApi = new ProsopoCaptchaApi(ProsopoCaptchaClient.contract, ProsopoCaptchaClient.provider, this.providerApi);

        if (this.callbacks?.onAccountChange) {
            this.callbacks.onAccountChange(account);
        }

        this.manager.update({ account });
    }

    public onAccountUnset() {
        ProsopoCaptchaClient.contract = undefined;
        ProsopoCaptchaClient.provider = undefined;
        ProsopoCaptchaClient.captchaApi = undefined;

        if (this.callbacks?.onAccountChange) {
            this.callbacks.onAccountChange(undefined);
        }

        this.manager.update({ account: undefined });
    }

}

export default ProsopoCaptchaClient;
