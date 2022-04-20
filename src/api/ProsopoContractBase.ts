import { ApiPromise } from "@polkadot/api";
import { Abi, ContractPromise } from "@polkadot/api-contract";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

import abiJson from "../abi/prosopo.json";
import { AnyJson } from "@polkadot/types/types/codec";
import { ProviderInterface } from "@polkadot/rpc-provider/types";
import { unwrap, encodeStringArgs } from "../common/helpers";
import Extension, { NoExtensionCallback } from "./Extension";
import { Signer } from "@polkadot/api/types";
class ProsopoContractBase {

  protected api: ApiPromise;
  protected abi: Abi;
  protected contract: ContractPromise;
  protected account: InjectedAccountWithMeta;

  public address: string;

  constructor() {
    throw new Error("Use `create` factory method");
  }

  public static async create(...args: any[]) {
    return await Object.create(this.prototype).init(...args);
  }

  /**
   * @param provider
   * @param address
   */
  protected async init(address: string, account: InjectedAccountWithMeta, provider: ProviderInterface) {
    this.api = await ApiPromise.create({ provider });
    this.abi = new Abi(abiJson, this.api.registry.getChainProperties());
    this.contract = new ContractPromise(this.api, this.abi, address);
    this.account = account;
    this.address = address;
    return this;
  }

  public getAccount(): InjectedAccountWithMeta {
    return this.account;
  }

  public getContract(): ContractPromise {
    return this.contract;
  }

  public async query<T>(method: string, args: any[]): Promise<T | AnyJson | null> {
    try {
      const abiMessage = this.abi.findMessage(method);
      const response = await this.contract.query[method](
        this.account.address,
        {},
        ...encodeStringArgs(abiMessage, args)
      );
      if (response.result.isOk) {
        if (response.output) {
          return unwrap(response.output.toHuman());
        } else {
          return null;
        }
      } else {
        throw new Error(
          response.result.asErr.asModule.message.unwrap().toString()
        );
      }
    } catch (e) {
      console.error("ERROR", e);
      return null;
    }
  }

  public async transaction<T>(signer: Signer, method: string, args: any[]): Promise<T | AnyJson | null | any> {
    try {
      const abiMessage = this.abi.findMessage(method);
      const extrinsic = this.contract.tx[method](
        {},
        ...encodeStringArgs(abiMessage, args)
      );

      // await new Promise((resolve) => {
      //     extrinsic.signAndSend(accountId, { signer }, (result) => {
      //         // if (result.status.isRetracted) {
      //         //     throw (result.status.asRetracted)
      //         // }
      //         // if (result.status.isInvalid) {
      //         //     // TODO: not quite sure how these errors work so should be updated later
      //         //     // @ts-ignore
      //         //     throw (result.status.asInvalid)
      //         // }

      //         // console.log(result.toHuman())
      //         // if (result.isInBlock || result.isFinalized) {
      //         //     const eventName = getEventNameFromMethodName(method)
      //         //     // Most contract transactions should return an event
      //         //     if (result.events) {
      //         //         console.log(result.events)
      //         //         // @ts-ignore
      //         //         resolve(result.events.filter((x) => x.name === eventName))
      //         //     }
      //         // }
      //         resolve([])
      //     })
      // });

      return await extrinsic.signAndSend(this.account.address, {
        signer,
        // signer: this.extension.getInjected().signer
      });
    } catch (e) {
      console.log(["ERROR", e]);
      return null;
    }
  }
}

export default ProsopoContractBase;
