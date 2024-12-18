import fetch from "node-fetch";
import { countrycode } from "./filters.js";
import crypto from "node:crypto";
import config from "./config.js";
import { getWebId, generateParams } from "tiktok-user-sign";

class TiktokDiscovery {
  /**
   *
   * @param {string} userAgent
   */
  constructor(
    userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
  ) {
    this.userAgent = userAgent;
    this.uuid = crypto.randomUUID();
    this.webid = null;
  }

  static async #getSign() {
    if (!this.webid) {
      this.webid = await getWebId(this.userAgent);
    }

    return generateParams(this.uuid, this.webid);
  }

  /**
   *
   * @param {string} country_code // country code exp: TR, US, GB
   */
  static async checkCountry(country_code = "TR") {
    if (!countrycode.find((x) => x.id === country_code)) {
      throw new Error("Invalid country code.");
    }
  }

  /**
   *
   * @param {number} period // data period for trending songs,hastag 7, 30, 120(days)
   */
  static async checkPeriod(period = 7) {
    if (![7, 30, 120].includes(period)) {
      throw new Error("Invalid period.");
    }
  }

  /**
   *
   * @param {number} limit // trend type limit value
   * @param {string} limitType // trend type hashtag,song
   */
  static async checkLimit(limit = 3, limitType = "hashtag") {
    let validLimits = {
      hashtag: { min: 1, max: 60 },
      song: { min: 1, max: 20 },
      creators: { min: 1, max: 50 },
      videos: { min: 1, max: 20 },
      ads: { min: 1, max: 20 },
    };

    if (!validLimits.hasOwnProperty(limitType)) {
      throw new Error("Invalid limit type.");
    }

    let { min, max } = validLimits[limitType];

    if (limit < min || limit > max) {
      throw new Error("Invalid limit.");
    }
  }

  /**
   *
   * @param {string} country_code
   * @param {number} page
   * @param {number} limit
   * @param {number} period
   * @returns
   */
  static async getTrendingHastag(
    country_code = "TR",
    page = 1,
    limit = 3,
    period = 7
  ) {
    await TiktokDiscovery.checkCountry(country_code);
    let signature = await TiktokDiscovery.#getSign();
    await TiktokDiscovery.checkPeriod(period);
    await TiktokDiscovery.checkLimit(limit, "hashtag");

    const resp = await fetch(
      `${config.endpoint}popular_trend/hashtag/list?page=${page}&limit=${limit}&period=${period}&country_code=${country_code}&sort_by=popular`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "tr-TR,tr;q=0.9",
          ...signature,
        },
        body: null,
        method: "GET",
      }
    );

    if (resp.ok) {
      const json = await resp.json();
      return json.data;
    } else {
      throw new Error("Something went wrong.");
    }
  }

  /**
   *
   * @param {string} country_code country code exp: TR, US, GB
   * @param {number} page page number
   * @param {number} limit song limit 1-20 maxiumum limit 20
   * @param {number} period data period for trending songs 7, 30, 120
   * @returns
   */

  static async getTrendingSongs(
    country_code = "TR",
    page = 1,
    limit = 3,
    period = 7
  ) {
    await TiktokDiscovery.checkCountry(country_code);
    let signature = await TiktokDiscovery.#getSign();
    await TiktokDiscovery.checkPeriod(period);
    await TiktokDiscovery.checkLimit(limit, "song");

    const resp = await fetch(
      `${config.endpoint}popular_trend/sound/rank_list?period=${period}&page=${page}&limit=${limit}&rank_type=popular&new_on_board=false&commercial_music=false&country_code=${country_code}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "tr-TR,tr;q=0.9",
          ...signature,
        },
        body: null,
        method: "GET",
      }
    );

    if (resp.ok) {
      const json = await resp.json();
      return json.data;
    } else {
      throw new Error("Something went wrong.");
    }
  }

  /**
   *
   * @param {string} country_code country code exp: TR, US, GB
   * @param {number} page page number
   * @param {number} limit song limit 1-20 maxiumum limit 20
   * @param {number} period data period for trending songs 7, 30, 120
   * @returns
   */
  static async getTrendingCreators(
    country_code = "TR",
    page = 1,
    limit = 3,
    period = 7
  ) {
    await TiktokDiscovery.checkCountry(country_code);
    let signature = await TiktokDiscovery.#getSign();
    await TiktokDiscovery.checkPeriod(period);
    await TiktokDiscovery.checkLimit(limit, "creators");

    const resp = await fetch(
      `${config.endpoint}popular_trend/creator/list?page=${page}&limit=${limit}&sort_by=follower&creator_country=${country_code}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "tr-TR,tr;q=0.9",
          ...signature,
        },
        body: null,
        method: "GET",
      }
    );

    if (resp.ok) {
      const json = await resp.json();
      return json.data;
    } else {
      throw new Error("Something went wrong.");
    }
  }

  /**
   *
   * @param {string} country_code country code exp: TR, US, GB
   * @param {number} page page number
   * @param {number} limit song limit 1-20 maxiumum limit 20
   * @param {number} period data period for trending songs 7, 30, 120
   * @returns
   */
  static async getTrendingVideos(
    country_code = "TR",
    page = 1,
    limit = 3,
    period = 7
  ) {
    await TiktokDiscovery.checkCountry(country_code);
    let signature = await TiktokDiscovery.#getSign();
    await TiktokDiscovery.checkPeriod(period);
    await TiktokDiscovery.checkLimit(limit, "videos");

    const resp = await fetch(
      `${config.endpoint}popular_trend/list?period=${period}&page=${page}&limit=${limit}&order_by=vv&country_code=${country_code}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "tr-TR,tr;q=0.9",
          ...signature,
        },
        body: null,
        method: "GET",
      }
    );

    if (resp.ok) {
      const json = await resp.json();
      return json.data;
    } else {
      throw new Error("Something went wrong.");
    }
  }

  /**
   * @typedef {'for_you' | 'popular' | 'impression' | 'ctr' | 'play_2s_rate' | 'play_6s_rate' | 'cvr' | 'like'} OrderBy
   */

  /**
   *
   * @param {string} country_code country code exp: TR, US, GB
   * @param {number} page page number
   * @param {number} limit song limit 1-20 maxiumum limit 20
   * @param {number} period data period for trending songs 7, 30, 120
   * @param {OrderBy} order_by for_you impression ctr play_2s_rate play_6s_rate cvr like
   * @returns {Promise<any>} - Returns the response of the trending songs.
   */
  static async getTopAds(
    country_code = "TR",
    page = 1,
    limit = 3,
    period = 30,
    order_by = "for_you"
  ) {
    await TiktokDiscovery.checkCountry(country_code);
    let signature = await TiktokDiscovery.#getSign();
    await TiktokDiscovery.checkPeriod(period);
    await TiktokDiscovery.checkLimit(limit, "ads");

    const resp = await fetch(
      `${config.endpoint}top_ads/v2/list?period=${period}&page=${page}&limit=${limit}&country_code=${country_code}&order_by=${order_by}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "tr-TR,tr;q=0.9",
          ...signature,
        },
        body: null,
        method: "GET",
      }
    );

    if (resp.ok) {
      const json = await resp.json();
      return json.data;
    } else {
      throw new Error("Something went wrong.");
    }
  }

  /**
   *
   * @param {string} country_code country code exp: TR, US, GB
   * @param {number} page page number
   * @param {string} keyword search keyword example: gym+training
   * @param {number} limit song limit 1-20 maxiumum limit 20
   * @param {number} period data period for trending songs 7, 30, 120
   * @param {OrderBy} order_by for_you impression ctr play_2s_rate play_6s_rate cvr like
   * @returns {Promise<any>} - Returns the response of the trending songs.
   */
  static async getTopAdsByKeyword(
    country_code = "TR",
    page = 1,
    keyword = "gym+training",
    limit = 3,
    period = 30,
    order_by = "for_you"
  ) {
    await TiktokDiscovery.checkCountry(country_code);
    let signature = await TiktokDiscovery.#getSign();
    await TiktokDiscovery.checkPeriod(period);
    await TiktokDiscovery.checkLimit(limit, "ads");

    const resp = await fetch(
      `${config.endpoint}top_ads/v2/list?period=${period}&page=${page}&limit=${limit}&country_code=${country_code}&order_by=${order_by}&keyword=${keyword}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "tr-TR,tr;q=0.9",
          ...signature,
        },
        body: null,
        method: "GET",
      }
    );

    if (resp.ok) {
      const json = await resp.json();
      return json.data;
    } else {
      throw new Error("Something went wrong.");
    }
  }
}

export default TiktokDiscovery;
