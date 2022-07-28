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
import HttpClientBase from "./HttpClientBase";
import Storage from "../modules/storage";
import { ProsopoCaptchaConfig, ProsopoRandomProviderResponse, GetCaptchaResponse, CaptchaSolution, CaptchaSolutionResponse } from '../types';

export class ProviderApi extends HttpClientBase {

  protected config: ProsopoCaptchaConfig;

  constructor(config: ProsopoCaptchaConfig) {
    super(config['providerApi.baseURL'], config['providerApi.prefix']);
    this.config = config;
  }

  /**
   *
   * @deprecated use ProsopoContract$getRandomProvider instead.
   */
  public getRandomProvider() {
    const userAccount = Storage.getAccount();
    return this.axios.get(`/random_provider/${userAccount}/${this.config['dappAccount']}`);
  }

  public getProviders(): Promise<{accounts: string[]}> {
    return this.axios.get(`/providers`);
  }

  public getContractAddress(): Promise<{contractAddress: string}> {
    return this.axios.get(`/contract_address`);
  }

  public getCaptchaChallenge(randomProvider: ProsopoRandomProviderResponse) : Promise<GetCaptchaResponse> {
    let { provider, blockNumber } = randomProvider;
    blockNumber = blockNumber.replace(/,/g, ''); // TODO: middleware schema parser/validator.
    const userAccount = Storage.getAccount();
    return this.axios.get(`/provider/captcha/${provider.captchaDatasetId}/${userAccount}/${this.config['dappAccount']}/${blockNumber}`);
  }

  public submitCaptchaSolution(blockHash: string, captchas: CaptchaSolution[], requestHash: string, txHash: string, userAccount: string) : Promise<CaptchaSolutionResponse> {
    return this.axios.post(`/provider/solution`, {blockHash, captchas, requestHash, txHash, userAccount, dappAccount: this.config['dappAccount']});
  }

}

export default ProviderApi;
