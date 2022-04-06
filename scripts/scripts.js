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

/* eslint-disable class-methods-use-this, no-new */

import { getMetadata } from './core-scripts.js';
import { HelixApp } from './HelixApp.js';

export const colormap = {
  '#fff': 'black',
  '#ffffff': 'black',
  '#FFFFFF': 'black',
  '#12358F': 'white',
  '#FFE255': 'black',
  '#E91D25': 'white',
  '#FCBB7B': 'black',
  '#FAE7E3': 'black',
  '#171717': 'white',
  '#F3AA4D': 'black',
  '#D96242': 'white',
  '#B2DDC5': 'black',
  '#3021A0': 'white',
  '#D24D56': 'white',
  '#3F1069': 'white',
  '#D2FA48': 'black',
  '#F0E8DD': 'black',
  '#C9E3F6': 'black',
  '#ffe055': 'black',
  '#171f44': 'white',
  '#e7af94': 'black',
  '#2b2b2b': 'white',
};

export async function lookupPages(pathnames) {
  if (!window.pageIndex) {
    if (!window.queryIndexJson) {
      const resp = await fetch('/query-index.json');
      window.queryIndexJson = await resp.json();
    }
    const lookup = {};
    const sheets = Object.keys(window.queryIndexJson).filter((e) => !e.startsWith(':'));
    sheets.forEach((sh) => {
      window.queryIndexJson[sh].data.forEach((row) => {
        lookup[row.path] = row;
      });
    });
    window.pageIndex = { data: window.queryIndexJson, lookup };
  }
  const result = pathnames.map((path) => window.pageIndex.lookup[path]).filter((e) => e);
  return (result);
}

export class App extends HelixApp {
  constructor(config) {
    super(config);

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
    super.loadDelayed();
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

/**
 * Decorate Page
 */
new App({
  rumGeneration: 'design-website-1',
  productionDomains: ['adobe.design'],
  lcpBlocks: ['hero', 'carousel'],
});

export function setBodyColor(color) {
  if (colormap[color] === 'black') {
    document.body.classList.remove('light-text');
    document.body.classList.add('dark-text');
  } else {
    document.body.classList.remove('dark-text');
    document.body.classList.add('light-text');
  }
}

function setPageBackgroundColor() {
  const pageBgColor = (getMetadata('color') !== null && getMetadata('color') !== '') ? getMetadata('color') : '#fff';
  setBodyColor(pageBgColor);

  const blendedBackground = document.createElement('div');
  blendedBackground.classList.add('blended-background');
  blendedBackground.style.setProperty('--blended-background-color', pageBgColor);

  document.body.append(blendedBackground);
  document.documentElement.style.setProperty('--header-color', pageBgColor);
}

if (window.location.pathname !== '/') {
  setPageBackgroundColor();
}
