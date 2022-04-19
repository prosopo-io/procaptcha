import HttpClientBase from "./HttpClientBase";
import Storage from "../modules/storage";

class ProviderApi extends HttpClientBase {

  /**
   * 
   * @deprecated use ProsopoContract$getRandomProvider instead.
   */
  public getRandomProvider() {
    const userAccount = Storage.getAccount();
    return this.instance.get(`/random_provider/${userAccount}`);
  }

  public getContractAddress(): Promise<{contractAddress: string}> {
    return this.instance.get(`/contract_address`);
  }

  public getProviders(): Promise<{accounts: string[]}> {
    return this.instance.get(`/providers/`);
  }

  public getCaptchaChallenge(randomProvider: ProsopoRandomProviderResponse) : Promise<ProsopoCaptchaResponse> {
    let { provider, blockNumber } = randomProvider;
    blockNumber = blockNumber.replace(/,/g, ''); // TODO: middleware schema parser/validator.
    return this.instance.get(`/provider/captcha/${provider.captchaDatasetId}/${provider.serviceOrigin}/${blockNumber}`);
  }

  public submitCaptchaSolution(blockHash: string, captchas: number[], dappAccount: string, requestHash: string, txHash: string, userAccount: string) : Promise<any> {
    return this.instance.post(`/provider/captcha/solution`, {blockHash, captchas, dappAccount, requestHash, txHash, userAccount});
  }

}

export default ProviderApi;
