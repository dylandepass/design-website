import { LitElement, createRef, html, map, ref } from '../../scripts/lit.min.js';
import { lookupPages, setBodyColor, colormap } from '../../scripts/scripts.js';
import { createOptimizedPicture, loadScript, optimizedImagePath } from '../../scripts/core-scripts.js';
import carouselStyle from './carousel.css.js';

/* eslint-disable class-methods-use-this */

export class Carousel extends LitElement {
  static styles = [carouselStyle];

  static properties = {
    stories: { type: Array },
    textColor: { state: true, type: String },
  };

  constructor() {
    super();
    this.initialized = false;
    this.slideDelay = 8.5;
    this.slideDuration = 1.0;
    this.proxy = document.createElement('div');
    this.prevButton = createRef();
    this.nextButton = createRef();
    this.carouselGroup = createRef();
    this.textColor = 'light-text';
  }

  async connectedCallback() {
    super.connectedCallback();

    const firstStory = this.stories[0];
    setBodyColor(firstStory.color);

    window.addEventListener('resize', this.checkScrollIndicator);
    window.addEventListener('scroll', this.hideScrollIndicator.bind(this));

    setTimeout(() => {
      this.loadCarousel(this);
      this.checkScrollIndicator();
    }, 4000);
  }

  init() {
    if (this.initialized) {
      return;
    }

    this.carouselGroup.value.classList.remove('hidden');

    this.progressWrap = this.gsap.utils.wrap(0, 1);
    this.numSlides = this.slides.length;

    this.gsap.set(this.slides, {
      xPercent: (i) => i * 100,
    });

    this.wrap = this.gsap.utils.wrap(-100, (this.numSlides - 1) * 100);
    this.timer = this.gsap.delayedCall(this.slideDelay, () => this.autoPlay());

    this.animation = this.gsap.timeline({
      paused: true,
      repeat: -1,
    });

    this.animation.to(this.slides, {
      duration: 1,
      xPercent: `+=${this.numSlides * 100}`,
      ease: 'none',
      modifiers: {
        xPercent: this.wrap,
      },
    });

    this.slideAnimation = this.gsap.to({}, {});
    this.colorAnimation = this.gsap.to({}, {});
    this.slideWidth = 0;
    this.wrapWidth = 0;
    this.initialized = true;

    this.resize();
  }

  async loadCarousel() {
    const GSAP_URL = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js';
    const GSAP_CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/CSSRulePlugin.min.js';

    loadScript(GSAP_URL, () => {
      loadScript(GSAP_CSS_URL, () => {
        this.gsap = window.gsap;
        this.slides = this.renderRoot.querySelectorAll('.carousel-slide');
        const interval = setInterval(() => {
          if (this.slides[0].offsetWidth > 0) {
            clearInterval(interval);
            this.init();
          }
        }, 10);
      });
    });
  }

  updateProgress() {
    const { gsap } = window;
    const time = this.progressWrap(gsap.getProperty(this.proxy, 'x') / this.wrapWidth);
    this.animation.progress(time);
  }

  animateSlides(direction) {
    const { gsap } = window;
    const x = this.snapX(gsap.getProperty(this.proxy, 'x') + direction * this.slideWidth);

    this.timer.restart(true);

    this.slideAnimation.kill();
    this.slideAnimation = gsap.to(this.proxy, {
      x,
      duration: this.slideDuration,
      ease: 'power2.out',
      onUpdate: () => this.updateProgress(),
    });

    this.colorAnimation.kill();
    this.colorAnimation = gsap.delayedCall(0, () => {
      const time = this.progressWrap(x / this.wrapWidth);
      const slideIndex = Math.round(time * this.slides.length);
      const slide = this.slides[slideIndex];
      if (slide) {
        const { color } = slide.dataset;
        setBodyColor(color);

        this.textColor = colormap[color] === 'black' ? 'dark-text' : 'light-text';
        document.documentElement.style.setProperty('--text-color', colormap[color] === 'black' ? 'var(--color-base-dark-slate)' : 'var(--color-base-white)');
        document.documentElement.style.setProperty('--header-color', color);
      }
    });
  }

  autoPlay() {
    this.animateSlides(-1);
  }

  resize() {
    const { gsap } = window;
    const norm = (gsap.getProperty(this.proxy, 'x') / this.wrapWidth) || 0;
    this.slideWidth = this.slides[0].offsetWidth;
    this.wrapWidth = this.slideWidth * this.numSlides;
    this.snapX = gsap.utils.snap(this.slideWidth);

    gsap.set(this.proxy, {
      x: norm * this.wrapWidth,
    });

    this.animateSlides(0);
    this.slideAnimation.progress(1);
  }

  changeSlide(direction) {
    this.animateSlides(direction);
    this.timer.kill();
  }

  checkScrollIndicator() {
    if (this.didScroll) {
      return;
    }

    const contianer = document.querySelector('.stories-container');
    const rect = contianer.getBoundingClientRect();
    const indicator = document.querySelector('.carousel-indicator-scroll');

    if (indicator) {
      if (rect.top < window.innerHeight) {
        indicator.classList.remove('show');
      } else {
        indicator.classList.add('show');
      }
    }
  }

  hideScrollIndicator() {
    if (!this.didScroll) {
      const indicator = this.renderRoot.querySelector('.carousel-indicator-scroll');
      indicator.classList.remove('show');
    }

    this.didScroll = true;
  }

  renderSlide(story, i) {
    return html`
      <li data-color=${story.color !== '' ? story.color : '#fff'} class="carousel-slide">
        <div class="carousel-slide-container">
          <div class="carousel-slide-content">
            <div class="carousel-slide-copy">
              <span class="cmp-stories-card__tag">${story.tag}</span>
              <h2 class="carousel-stories-card__title"><a
                  href="/stories/leading-design/what-drives-adobe-design">${story.title}</a></h2>
              <div class="cmp-stories-card__intro">${story.description}</div>
              <div class="cmp-stories-card__author">by ${story.author}</div>
            </div>
            <div class="carousel-picture-holder">
              <a href=${story.path}>${createOptimizedPicture(story.image, story.title, !i)}</a>
            </div>
          </div>
        </div>
      </li>
    `;
  }

  render() {
    console.log('rending caro');
    return html`
        <div class="carousel-group hidden" ${ref(this.carouselGroup)}>
          <ul class="carousel-slides ${this.textColor}" style="width: 300%;">
            ${map(this.stories, (slide, index) => this.renderSlide(slide, index))}
          </ul>
          <div class="carousel-ui">
            <div class="carousel-ui-inner">
              <div class="carousel-indicator-scroll">
                <svg xmlns="http://www.w3.org/2000/svg" width="20.702" height="12.413" viewBox="0 0 20.702 12.413">
                  <g id="Chevron" transform="translate(-154.009 -37.009)">
                    <rect id="Frame" width="20" height="12" transform="translate(154.219 37.331)" fill="currentColor"
                      opacity="0"></rect>
                    <path id="Shape"
                      d="M20.708,2.087A2.074,2.074,0,0,0,17.168.615L10.361,7.429,3.553.615A2.078,2.078,0,1,0,.615,3.553l8.28,8.259a2.074,2.074,0,0,0,2.932,0l8.28-8.259A2.074,2.074,0,0,0,20.708,2.087Z"
                      transform="translate(154.003 37.003)" fill="currentColor"></path>
                  </g>
                </svg>
              </div>
              <div class="carousel-btn carousel-btn-prev" @click=${() => this.changeSlide(1)}></div>
              <div class="carousel-btn carousel-btn-next" @click=${() => this.changeSlide(-1)}></div>
            </div>
          </div>
        </div>
        <div class="carousel-gradient">
          <svg class="carousel-gradient-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
            preserveAspectRatio="none">
            <defs>
              <linearGradient id="Gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="white"></stop>
                <stop offset="100%" stop-color="black"></stop>
              </linearGradient>
              <mask id="mask">
                <rect x="0" y="0" width="100" height="100" fill="url(#Gradient)"></rect>
              </mask>
            </defs>
            <rect class="svg-bg" x="0" y="0" width="100" height="100" fill="red" mask="url(#mask)"></rect>
          </svg>
        </div>
    `;
  }
}

customElements.define('carousel-element', Carousel);

export default async function decorate($block) {
  const pathNames = [...$block.querySelectorAll('a')].map((a) => new URL(a.href).pathname);
  const stories = await lookupPages(pathNames);

  const lcpImage = optimizedImagePath(stories[0].image);
  const res = document.createElement('link');
  res.rel = 'preload';
  res.as = 'image';
  res.href = lcpImage;
  document.head.appendChild(res);

  document.documentElement.style.setProperty('--header-color', '#12358F');
  const carouselElement = document.createElement('carousel-element');
  carouselElement.setAttribute('stories', JSON.stringify(stories));
  $block.innerHTML = '';
  $block.appendChild(carouselElement);
}
