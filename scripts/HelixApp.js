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

/* eslint-disable class-methods-use-this, import/prefer-default-export */

import {
  initHlx,
  waitForLCP,
  sampleRUM,
  buildBlock,
  decorateBlock,
  loadBlock,
  decorateBlocks,
  loadBlocks,
  makeLinksRelative,
  loadCSS,
  addFavIcon,
  decorateSections,
  decoratePictures,
  removeStylingFromImages,
  registerPerformanceLogger,
} from './core-scripts.js';

export const HelixApp = (superClass) => {
  class BaseApp extends superClass {
    static properties = {
      config: { type: Object },
      rumEnabled: { type: Boolean },
    };

    constructor() {
      super();
      this.rumEnabled = false;
      initHlx();
    }

    /**
     * Render template without shadow DOM.
     * @returns void
     */
    createRenderRoot() {
      return this;
    }

    connectedCallback() {
      super.connectedCallback();

      this.loadPage(document);

      if (this.rumEnabled) {
        sampleRUM('top');
        window.addEventListener('load', () => sampleRUM('load'));
        document.addEventListener('click', () => sampleRUM('click'));
      }

      if (window.name.includes('performance')) {
        registerPerformanceLogger();
      }
    }

    sampleRUM(event) {
      sampleRUM(event, this.config.rumGeneration);
    }

    async loadHeader(header) {
      const headerBlock = buildBlock('header', '');
      header.append(headerBlock);
      decorateBlock(headerBlock);
      await loadBlock(headerBlock);
      makeLinksRelative(headerBlock, this.config.productionDomains);
    }

    async loadFooter(footer) {
      const footerBlock = buildBlock('footer', '');
      footer.append(footerBlock);
      decorateBlock(footerBlock);
      await loadBlock(footerBlock);
      makeLinksRelative(footerBlock, this.config.productionDomains);
    }

    /**
     * Decorates the page.
     */
    async loadPage(doc) {
      await this.loadEager(doc);

      const main = doc.querySelector('main');
      if (main) {
        await waitForLCP(this.config.lcpBlocks);
        this.decorateMain(main);
      }

      await this.loadLazy(doc);
      this.loadDelayed(doc);
    }

    /**
     * Decorates the main element.
     * @param {Element} main The main element
     */
    decorateMain(main) {
      // forward compatible pictures redecoration
      this.decoratePictures(main);
      this.removeStylingFromImages(main);
      this.makeLinksRelative(main, this.config.productionDomains);
      this.decorateSections(main);
      this.decorateBlocks(main);
    }

    removeStylingFromImages(main) {
      removeStylingFromImages(main);
    }

    makeLinksRelative(main, productionDomains) {
      makeLinksRelative(main, productionDomains);
    }

    decorateSections(main) {
      decorateSections(main);
    }

    decorateBlocks(main) {
      decorateBlocks(main);
    }

    /**
     * loads everything that happens a lot later, without impacting
     * the user experience.
     */
    loadDelayed() { }

    /**
     * loads everything needed to get to LCP.
     */
    async loadEager(doc) {
      return Promise.resolve(doc);
    }

    /**
   * loads everything that doesn't need to be delayed.
   */
    async loadLazy(doc) {
      const main = doc.querySelector('main');
      await loadBlocks(main);

      this.loadHeader(doc.querySelector('header'));
      this.loadFooter(doc.querySelector('footer'));

      loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
      addFavIcon(`${window.hlx.codeBasePath}/icon.svg`);
    }

    decoratePictures(main) {
      decoratePictures(main);
    }
  }
  return BaseApp;
};
