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
import ProsopoContract from "../api/ProsopoContract";
import { WsProvider, HttpProvider } from "@polkadot/rpc-provider";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { ProviderInterface } from "@polkadot/rpc-provider/types";

export function getWsProvider(url?: string): WsProvider {
    return new WsProvider(url);
}

export async function getProsopoContract(address: string, dappAddress: string, account: InjectedAccountWithMeta, providerInterface?: ProviderInterface): Promise<ProsopoContract> {
    return await ProsopoContract.create(address, dappAddress, account, providerInterface ?? getWsProvider());
}

// export async function getWsProvider(url?: string): Promise<WsProvider> {
//     const provider = new WsProvider(url, 0);
//     try {
//         await provider.connect();
//     } catch (err) {
//         throw new Error(`${err.message} ${url}`);
//     }
//     return provider;
// }

// export async function getProsopoContract(address: string, dappAddress: string, account: InjectedAccountWithMeta, url?: string): Promise<ProsopoContract> {
//     return await ProsopoContract.create(address, dappAddress, account, await getWsProvider(url));
// }
