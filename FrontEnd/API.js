/** @import {LoginNegativeRes, LoginRes} from "./types.js" */

import { isLoginRes, isNegativeLoginRes } from "./typeGuards.js";

export class API {

  static SessionToken = '';

  static Domain = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
  /**
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<[true, LoginRes] | [false, LoginNegativeRes]>} if the login is successful
   */
  static async Login(username, password) {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "UserName": username,
      "Password": password
    });

    const res = await fetch(`${API.Domain}/login`, {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    });

    const resJson = await res.json();

    console.log(resJson)

    if (!isLoginRes(resJson)){

      if (isNegativeLoginRes(resJson)){

        return [false, resJson]
      }
      
      return [
        false, {
        message: 'Unknown response from login endpoint'
        }
      ];
    }

    API.SessionToken = resJson.token;

    return [
      true,
      resJson
    ];
  }
}