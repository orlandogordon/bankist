('use strict');

// import { accounts } from './app.js';

// Todo - Tie in the actual baking app. find a way to transfer the data between scrits. potentially refractor into more js files. Add hints/visual pop ups to improve ux. Push to git.

const modal = document.querySelector('.modal');
const modal2 = document.querySelector('.modal2');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const form = document.querySelector('.modal__form');
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const pin = document.querySelector('#pin');

export let accounts = [];

////////////////////////////////////////

const account1 = {
  owner: 'Xavier Xander',
  movements: [200, 650, -101.5, 35000, -1120.18, -119.12, 179.34, 800],
  interestRate: 1.9, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-03-14T17:01:17.194Z',
    '2022-03-18T23:36:17.929Z',
    '2022-03-19T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Orlando Gordon',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1111,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2022-03-14T18:49:59.371Z',
    '2022-03-18T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const defaultAccounts = [account1, account2];
const init = function () {
  const storage = localStorage.getItem('accounts');
  if (storage) {
    accounts = JSON.parse(storage);
  } else {
    localStorage.setItem('accounts', JSON.stringify(defaultAccounts));
    console.log('setting up the accounts in storage');
    init();
  }
};
init();
///////////////////////////////////////

///////////////////////////////////////
// Modal window
if (modal) {
  const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    modal2.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  btnScrollTo.addEventListener('click', function (e) {
    section1.scrollIntoView({ behavior: 'smooth' });
  });
  ////////////////////////////////////////////////////////
  // Page Navigation

  // document.querySelectorAll('.nav__link').forEach(function (el) {
  //   el.addEventListener('click', function (e) {
  //     e.preventDefault();
  //     const id = this.getAttribute('href');
  //     console.log(id);
  //     document.querySelector(id).scrollIntoView({
  //       behavior: 'smooth',
  //     });
  //   });
  // });

  // Event Delegation
  // 1. Add Event listener to common parent element
  // 2. Determin what element originated the event

  document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();

    // Matching strategy
    if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      // console.log(id);
      document.querySelector(id).scrollIntoView({
        behavior: 'smooth',
      });
    }
  });
  ////////////////////////////////////////////////////////

  // Tabbed Component
  // tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')));

  tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');

    if (!clicked) return; // Guard clause

    // Remove active classes
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));

    // Activate tab
    clicked.classList.add('operations__tab--active');

    // Active Content Area
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });

  // Menu Fade Animation
  const handleHover = function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');

      siblings.forEach(el => {
        if (el !== link) el.style.opacity = this;
      });
      logo.style.opacity = this;
    }
  };

  // Passing "argument" into handler using the bind method
  nav.addEventListener('mouseover', handleHover.bind(0.5));

  nav.addEventListener('mouseout', handleHover.bind(1));

  // Sticky Navigation
  const header = document.querySelector('.header');
  const navHeight = nav.getBoundingClientRect().height;

  const stickyNav = function (entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  };

  const headObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });

  headObserver.observe(header);

  // Revealing sections(elements) as we scroll
  const allSections = document.querySelectorAll('.section');

  const revealSection = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });

  allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
  });

  // Lazy loading images
  const imgTargets = document.querySelectorAll('img[data-src]');

  const loadImg = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  };

  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  });

  imgTargets.forEach(img => imgObserver.observe(img));

  // Slider
  const slider = function () {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');

    let curSlide = 0;
    const maxSlide = slides.length;

    //Functions
    const createDots = function () {
      slides.forEach(function (_, i) {
        dotContainer.insertAdjacentHTML(
          'beforeend',
          `<button class="dots__dot" data-slide="${i}"></button>`
        );
      });
    };

    const activateDot = function (slide) {
      document
        .querySelectorAll('.dots__dot')
        .forEach(dot => dot.classList.remove('dots__dot--active'));

      document
        .querySelector(`.dots__dot[data-slide="${slide}"]`)
        .classList.add('dots__dot--active');
    };

    const goToSlide = function (slide) {
      slides.forEach(
        (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
      );
    };

    // Next Slide
    const nextSlide = function () {
      if (curSlide === maxSlide - 1) {
        curSlide = 0;
      } else {
        curSlide++;
      }

      goToSlide(curSlide);
      activateDot(curSlide);
    };

    const prevSlide = function () {
      if (curSlide === 0) {
        curSlide = maxSlide - 1;
      } else {
        curSlide--;
      }
      goToSlide(curSlide);
      activateDot(curSlide);
    };

    const init = function () {
      createDots();
      goToSlide(0);
      activateDot(0);
    };
    init();

    // Event Handlers
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') prevSlide();
      e.key === 'ArrowRight' && nextSlide();
    });

    dotContainer.addEventListener('click', function (e) {
      if (e.target.classList.contains('dots__dot')) {
        const { slide } = e.target.dataset;
        goToSlide(slide);
        activateDot(slide);
      }
    });
  };
  slider();

  // window.addEventListener('beforeunload', function (e) {
  //   e.preventDefault();
  //   console.log(e);
  //   e.returnValue = '';
  // });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let usernames = [];
    let username =
      firstName.value[0].toLowerCase() + lastName.value[0].toLowerCase();
    accounts.forEach(el => usernames.push(el.username));

    while (usernames.some(el => el == username)) {
      let i = 2;
      username = `${username}${i}`;
      alert(`Your username was taken so it will be: ${username}`);
      i++;
    }

    const newAccount = {
      owner: `${firstName.value} ${lastName.value}`,
      movements: [10000],
      interestRate: 1.5,
      pin: +pin.value,
      username: username,

      movementsDates: [new Date().toISOString()],
      currency: 'USD',
      locale: 'en-US',
    };

    modal2.innerHTML = ` <button class="btn--close-modal2">&times;</button>
    <h2 class="modal__header">
      Congratulations, ${newAccount.owner}! Your account at
      <span class="highlight">Bankist</span> has been approved.
    </h2>
    <p>Your login credentials are as follows:</p>
    <p class="tab">- Username: ${newAccount.username}</p>
    <p class="tab">- Pin: ${newAccount.pin}</p>
    <p class="center">Does everything appear correct?</p>
    <span class="button--container">
      <button class="modal2__btn-cancel">No. I'd like to make edits</button>
      <button class="modal2__btn-confirm">Yes. Take me to sign in!</button>
    </span>`;
    const btnConfirmEntry = document.querySelector('.modal2__btn-confirm');
    const btnCancelEntry = document.querySelector('.modal2__btn-cancel');
    const btnCloseModal2 = document.querySelector('.btn--close-modal2');

    btnCloseModal2.addEventListener('click', closeModal);

    modal2.classList.remove('hidden');
    modal.classList.add('hidden');

    btnConfirmEntry.addEventListener('click', function (e) {
      e.preventDefault();
      accounts.push(newAccount);
      localStorage.setItem('accounts', JSON.stringify(accounts));
      window.location.href = 'app.html';
    });

    btnCancelEntry.addEventListener('click', function (e) {
      e.preventDefault();
      modal.classList.remove('hidden');
      modal2.classList.add('hidden');
    });
  });
}
