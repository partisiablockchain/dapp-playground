/*
 * Copyright (C) 2022 - 2023 Partisia Blockchain Foundation
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

// Helper functions for building and sending get requests, and receiving json responses.

const getHeaders: HeadersInit = {
  Accept: "application/json, text/plain, */*",
};

const postHeaders: HeadersInit = {
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/json",
};

export type RequestType = "GET" | "PUT";

function buildOptions<T>(method: RequestType, headers: HeadersInit, entityBytes: T) {
  const result: RequestInit = { method, headers, body: null };

  if (entityBytes != null) {
    result.body = JSON.stringify(entityBytes);
  }
  return result;
}

export function getRequest<R>(url: string): Promise<R | undefined> {
  const options = buildOptions("GET", getHeaders, null);
  return handleFetch(fetch(url, options));
}

export function putRequest<R, T>(url: string, object: T): Promise<R | undefined> {
  const options = buildOptions("PUT", postHeaders, object);
  return handleFetch(fetch(url, options));
}

function handleFetch<T>(promise: Promise<Response>): Promise<T | undefined> {
  return promise
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return undefined;
      }
    })
    .catch(() => undefined);
}
