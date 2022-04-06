import { css } from '../../scripts/lit.min.js';

export default css`
* {
    margin: 0;
}
*, *::before, *::after {
    box-sizing: border-box;
}
a {
  text-decoration: none;
}
a:hover,
a:focus {
  text-decoration: underline;
}
img, svg, picture {
  display: block;
  max-width: 100%;
}
.hidden {
  visibility: hidden;
}
.dark-text .carousel-slide-content,
.dark-text .carousel-slide-content a,
.light-text .carousel-ui {
  --text-color: var(--color-base-dark-slate);
  color: var(--color-base-dark-slate);
}

.light-text .carousel-slide-content,
.light-text .carousel-slide-content a,
.light-text .carousel-ui {
  --text-color: var(--color-base-white);
  color: var(--color-base-white);
}

.cmp-stories-card__intro {
  --home-card-intro-font-size: var(--font-size-650);

  font-family: var(--font-stack-serif);
  font-size: var(--home-card-intro-font-size);
  line-height: 1.3;
  margin-bottom: 1.5rem;
}

.carousel-group {
  --padding-top: 100px;
  width: 100%;
  padding-top: var(--padding-top);
  height: 100vh;
  max-height: 1040px;
  min-height: 50vw;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  display: flex;
  flex: 1;
  background-color: var(--header-color);
  transition: background-color var(--carousel-transition-time)
    var(--carousel-transition-ease);
}

.carousel-group.hidden .carousel-slide {
  visibility: hidden;
}

.carousel-group.hidden .carousel-slide:first-child {
  visibility: visible;
}

.carousel-group.hidden .carousel-btn {
  opacity: 0;
}

.carousel-gradient {
  height: 600px;
}

.carousel-gradient-svg {
  width: 100%;
  height: 100%;
}

.carousel-gradient-svg .svg-bg {
  fill: var(--header-color);
  transition: fill var(--carousel-transition-time)
    var(--carousel-transition-ease);
}

.carousel-indicator-scroll {
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 20px;
}

.carousel-indicator-scroll svg {
  display: inline;
  margin-left: 25px;
}

.carousel-slides {
  position: relative;
  height: 100%;
  width: 100%;
}

.carousel-slide {
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 0;

  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.carousel-slide-container {
  margin: 0 auto;
  width: var(--carousel-width);
  max-width: var(--layout-max-width-desktop);
}

.carousel-slide-content {
  display: grid;
  grid-template-columns: repeat(12, [col-start] 1fr);
  column-gap: 12px;
  row-gap: 12px;
}

.cmp-stories-card__tag.carousel-stories-card__tag {
  margin-top: 0;
}

.cmp-stories-card__tag {
  display: inline-block;
  font-size: var(--font-size-100);
  padding-bottom: 5px;
  position: relative;
  text-transform: uppercase;
  width: auto;
}

.carousel-group .cmp-stories-card__tag::after {
  background-color: var(--text-color);
  border-radius: 10px;
  bottom: 0;
  content: "";
  left: 0;
  height: 4px;
  position: absolute;
  width: 100%;
}

.cmp-stories-card__author {
  font-size: var(--font-size-200);
  font-weight: var(--font-weight-bold);
  line-height: 1.3;
  margin-bottom: 0;
}

.carousel-slide-copy {
  grid-column-start: 7;
  grid-column-end: 13;
  grid-row-start: 1;
  grid-row-end: 1;
  padding: 2.25rem 2.5rem;
  box-sizing: border-box;
}

.carousel-stories-card__title a,
.carousel-stories-card__title a:hover,
.carousel-stories-card__title a:focus {
  color: var(--text-color);
  text-decoration-thickness: 0.05em;
}

.carousel-stories-card__title {
  font-size: min(max(var(--font-size-800), 4vw), var(--font-size-2000));
  font-weight: var(--font-weight-black);
  margin: 3rem 0 1.5rem;
  line-height: 1;
}

.carousel .cmp-stories-card__tag::after {
  background-color: currentColor;
  border-radius: 10px;
  bottom: 0;
  content: "";
  left: 0;
  height: 4px;
  position: absolute;
  width: 100%;
}

.carousel-picture-holder {
  grid-column-start: 1;
  grid-column-end: 7;
  grid-row-start: 1;
  grid-row-end: 1;
}

.carousel-picture-holder a {
  overflow: hidden;
}

.carousel-picture-holder a picture {
  aspect-ratio: 1 / 1;
}

.carousel-slide img {
  display: block;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.carousel-btn {
  opacity: 1;
  width: 46px;
  height: 46px;
  background: white;
  border-radius: 75%;
  cursor: pointer;
  transform: translate(-75%, calc(var(--padding-top) / 2)) rotate(180deg);
  background-image: url("../../assets/arrow.svg");
  background-repeat: no-repeat;
  background-position: center;
  transform-origin: center;
  pointer-events: visible;
  transition: opacity 0.5s;
}

.carousel-btn-next {
  transform: translate(75%, calc(var(--padding-top) / 2)) rotate(0deg);
}

.carousel-ui {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
}

.carousel-ui-inner {
  position: relative;
  height: 100%;
  margin: 0 auto;
  width: var(--carousel-width);
  max-width: var(--layout-max-width-desktop);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.carousel-indicator-scroll {
  display: none;
}

.carousel-indicator-scroll.show {
  display: block;
}

/* adjust margin*/
.stories-container {
  margin-top: -550px;
}

.cmp-stories-card__tag {
  margin-top: 15%;
}

@media (max-width: 1300px) {
  .carousel-group {
    height: 80vh;
    overflow-y: hidden;
    min-height: 700px;
  }

  .carousel-slide-copy {
    grid-column-end: 13;
  }

  .cmp-stories-card__tag {
    margin-top: 15%;
  }

  .cmp-stories__inner-wrap h1 {
    --stories-page-title-font-size: var(--font-size-4000);
  }

  .cmp-stories-card__intro {
    --home-card-intro-font-size: var(--font-size-650);
  }
}

@media (max-width: 900px) {
  .carousel-stories-card__title {
    margin: 1rem 0 1.5rem;
  }
  .cmp-stories-card__intro {
    --home-card-intro-font-size: var(--font-size-650);
  }
  .carousel-group {
    max-height: 2000px;
    height: calc(100vw + 200px);
    box-sizing: content-box;
  }

  .carousel-slide-container {
    box-sizing: border-box;
    height: 100%;
  }

  .carousel-slide-content {
    height: 100%;
    grid-template-columns: repeat(6, [col-start] 1fr);
    grid-template-rows: min-content;
    row-gap: 0;
  }

  .carousel-slide-copy {
    grid-column-start: 1;
    grid-column-end: 7;
    grid-row-start: 2;
    grid-row-end: 2;
    justify-content: flex-start;
    padding: 2.25rem 2.5rem;
    padding-bottom: 12px;
  }

  .carousel-picture-holder {
    grid-column-start: 1;
    grid-column-end: 7;
    grid-row-start: 1;
    grid-row-end: 1;
  }

  .carousel-ui {
    grid-template-columns: repeat(6, [col-start] 1fr);
  }

  .carousel-ui-inner {
    height: 100vw;
    padding-top: 100px;
  }

  .carousel-gradient {
    height: 300px;
  }

  .stories-container {
    margin-top: -300px;
  }

  .carousel-btn {
    transform: translate(-50%, calc(var(--padding-top) / 2)) rotate(180deg);
  }

  .carousel-btn-next {
    transform: translate(50%, calc(var(--padding-top) / 2)) rotate(0deg);
  }

  .carousel-indicator-scroll {
    display: none !important;
  }
}

@media (max-width: 700px) {
  .carousel-group {
    height: calc(100vw + 350px);
  }

  .carousel-ui-inner {
    height: 90vw;
  }
}
`;
