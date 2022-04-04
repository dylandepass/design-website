/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable class-methods-use-this */

import { LitElement } from './lit.min.js';
import { getMetadata } from './core-scripts.js';
import { HelixApp } from './HelixApp.js';

export default class App extends HelixApp(LitElement) {
  static properties = {
    config: { type: Object },
  };

  connectedCallback() {
    super.connectedCallback();
    if (window.location.pathname === '/') {
      setTimeout(() => {
        this.decorateHomeJobsStats();
      }, 4000);
    }

    this.addPathsAsClassNames();
  }

  addPathsAsClassNames() {
    if (window.location.pathname === '/') {
      document.body.classList.add('home');
    } else if (window.location.pathname === '/404.html') {
      document.body.classList.add('page-not-found', 'light-text');
    } else {
      const pathNames = window.location.pathname.toLowerCase().split('/').filter((item) => item !== '').slice(0, 2);
      if (getMetadata('theme') !== null && getMetadata('theme') === 'profile') pathNames.push('profile');
      document.body.classList.add(...pathNames);
    }
  }

  /**
   * loads everything that happens a lot later, without impacting
   * the user experience.
   */
  loadDelayed() {
    // load anything that can be postponed to the latest here
    // setTimeout(() => {
    //   loadScript('https://assets.adobedtm.com/a7d65461e54e/9ee19a80de10/launch-882c01867cbb.min.js');
    // }, 4000);
  }

  /**
   * loads everything needed to get to LCP.
   */
  async loadEager() {
    const redirect = getMetadata('redirect');
    const usp = new URLSearchParams(window.location.search);
    if (redirect) {
      if (!usp.get('redirect') && (window.location.hostname.endsWith('localhost') || window.location.hostname.endsWith('.page'))) {
        const redirectBanner = document.createElement('div');
        redirectBanner.innerHTML = `Redirect set to <a href="${redirect}">${redirect}</a>`;
        redirectBanner.setAttribute('style', `
      background-color: #ddd;
      color: #222;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px;
      position: fixed;
      z-index: 1;
      display: block;
      `);
        document.querySelector('main').prepend(redirectBanner);
      } else {
        window.location.href = redirect;
      }
    }
  }

  decorateHomeJobsStats() {
    const mainEl = document.querySelector('main');
    const itemsToWrap = document.querySelectorAll('.jobs-container, .stats-container');
    const jobsStatsContainer = document.createElement('div');
    const jobsStatsInner = document.createElement('div');
    jobsStatsContainer.classList.add('cmp-jobs-stats-container');
    jobsStatsInner.classList.add('cmp-jobs-stats-container__inner-wrap');
    jobsStatsContainer.append(jobsStatsInner);
    jobsStatsInner.append(...itemsToWrap);
    mainEl.append(jobsStatsContainer);

    const sectionHeadline = document.querySelector('.jobs-container > div > h2');
    jobsStatsInner.prepend(sectionHeadline);
  }
}

customElements.define('adobe-design', App);

const app = document.createElement('adobe-design');
app.setAttribute('rumEnabled', true);
app.setAttribute('config', JSON.stringify({
  rumGeneration: 'design-website-1',
  productionDomains: ['adobe.design'],
  lcpBlocks: ['hero', 'carousel'],
}));

const body = document.body.innerHTML;
document.body.innerHTML = '';
app.innerHTML = body;

document.body.appendChild(app);

export async function lookupPages(pathnames) {
  if (!window.pageIndex) {
    const resp = await fetch('/query-index.json');
    const json = await resp.json();
    const lookup = {};
    const sheets = Object.keys(json).filter((e) => !e.startsWith(':'));
    sheets.forEach((sh) => {
      json[sh].data.forEach((row) => {
        lookup[row.path] = row;
      });
    });
    window.pageIndex = { data: json, lookup };
  }
  const result = pathnames.map((path) => window.pageIndex.lookup[path]).filter((e) => e);
  return (result);
}
