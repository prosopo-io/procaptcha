import ProsopoContract from "../api/ProsopoContract";
import { WsProvider } from "@polkadot/rpc-provider";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { ProviderInterface } from "@polkadot/rpc-provider/types";

export async function getProsopoContract(address: string, account: InjectedAccountWithMeta, providerInterface?: ProviderInterface): Promise<ProsopoContract> {
    return await ProsopoContract.create(address, account, providerInterface ?? new WsProvider());
}
