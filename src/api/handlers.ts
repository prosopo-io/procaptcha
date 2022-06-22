// Copyright (C) 2021-2022 Prosopo (UK) Ltd.
// This file is part of procaptcha <https://github.com/prosopo-io/procaptcha>.
//
// procaptcha is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// procaptcha is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with procaptcha.  If not, see <http://www.gnu.org/licenses/>.
import {AxiosResponse} from "axios";

export class ProsopoApiError extends Error {
  constructor(error: AxiosResponse, context?: string, ...params: any[]) {

    super(`${error.data.message ? error.data.message : error.statusText}`)

    this.name = context && `${ProsopoApiError.name}@${context}` || ProsopoApiError.name;

    // TODO: if env.debug
    console.error('\n********************* ERROR *********************\n');
    console.error(this.cause, this.stack, ...params);
  }
}