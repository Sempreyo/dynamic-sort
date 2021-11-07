//= ./../../node_modules/swiper/swiper-bundle.min.js

class Sort {
   constructor(parent) {
      this.elemsWrapper = parent.querySelector('.sort-block');
      this.sourceListElems = parent.querySelector('.js-source-list');
      this.createBtn = parent.querySelector('.step__create-btn');
      this.sortBtn = parent.querySelector('.step__sort-btn');
      this.startBtn = parent.querySelector('.step__start');
      this.inputNumItems = parent.querySelector('.js-length');
      this.checkOrder = parent.querySelector('.js-order');
      this.slider = parent.querySelector('.js-step-slider');
      this.stepSlider = null;

      /* Инициализация слайдера */
      if (this.slider) {
         const initStepSlider = () => {
            this.stepSlider = new Swiper('.js-step-slider', {
               slidesPerView: 1,
               speed: 300,
               spaceBetween: 13,
               allowTouchMove: false
            });
         }

         initStepSlider();
         window.addEventListener('resize', () => {
            initStepSlider();
         });
      }

      /* Валидатор числового поля */
      this.inputNumItems.addEventListener('keyup', function () {
         const regexp = RegExp('^([1-9]|10)$');
         let value = this.value;

         if (value === '') {
            return false;
         } else if (!regexp.test(value)) {
            let output = value.match(RegExp('^([1-9]|10)$', 'g'));

            if (typeof (output) !== 'undefined' && output && typeof (output[0]) !== 'undefined') {
               this.value = output[0];
            } else {
               this.value = '';
            }
         }
      });

      this.createBtn.addEventListener('click', (e) => {
         e.preventDefault();
         this.checkOrder.parentNode.classList.remove('hide-down');
         this.sortBtn.classList.remove('hide-down');
         this.startBtn.classList.add('hide-down');
         this.createElems();
      });

      /* Сортировка элементов */
      this.sortBtn.addEventListener('click', (e) => {
         e.preventDefault();
         this.checkOrder.parentNode.classList.add('hide-down');
         this.sortBtn.classList.add('hide-down');
         this.checkOrder.checked ?
            this.bubbleSort(parent, -1) :
            this.bubbleSort(parent, 1);
      });

      this.startBtn.addEventListener('click', (e) => {
         e.preventDefault();
         this.stepSlider.slidePrev();
      });
   }


   /* Создание элементов сортировки */
   createElems() {
      if (this.inputNumItems.value !== '') {
         this.elemsWrapper.innerHTML = '';
         const lengthVal = this.inputNumItems.value;
         const arr = this.createFillArray(lengthVal);

         /* Укажем исходный массив элементов */
         this.sourceListElems.textContent = arr.toString();

         arr.forEach((item, index) => {
            this.elemsWrapper.insertAdjacentHTML('beforeend', `<div class="sort-block__item" style="transform: translateX(${index * 50}px)"><span>${item}</span></div>`);
         });

         this.inputNumItems.value = '';
         this.stepSlider.slideNext();
      }
   }

   /* Создание массива элементов в диапазоне от 1 до 99 */
   createFillArray(length) {
      let arr = [];

      for (let i = 0; i < length; i++) {
         arr.push(Math.round(Math.random() * 99));
      }

      return arr;
   }

   async bubbleSort(parent, order) { // order (-1 или 1) - по убыванию и возрастанию соответственно (1 - по умолчанию)
      let arr = parent.querySelectorAll('.sort-block__item');

      for (let i = 0; i < arr.length; i++) { // Кол-во прохождений по ряду элементов
         for (let j = 0; j < arr.length - i - 1; j++) { // Кол-во перестановок в каждом прохождении

            /* Окрашиваем сравниваемые значения */
            arr[j].classList.add('color-current');
            arr[j + 1].classList.add('color-current');

            /* Пауза после каждого сравнения */
            await new Promise((resolve) => {
               setTimeout(() => {
                  resolve();
               }, 400);
            });

            let currentVal = Number(arr[j].childNodes[0].innerHTML);
            let nextVal = Number(arr[j + 1].childNodes[0].innerHTML);

            switch (order) {
               case -1:
                  if (currentVal < nextVal) {
                     await this.swap(arr[j], arr[j + 1]);
                     arr = parent.querySelectorAll('.sort-block__item');
                  }
                  break;
               case 1:
               default:
                  if (currentVal > nextVal) {
                     await this.swap(arr[j], arr[j + 1]);
                     arr = parent.querySelectorAll('.sort-block__item');
                  }
                  break;
            }

            arr[j].classList.remove('color-current');
            arr[j + 1].classList.remove('color-current');
         }

         /* Обозначаем "всплывший" элемент */
         arr[arr.length - i - 1].classList.add('color-ready');
      }

      /* После сортировки покажем кнопку "To Start!" */
      this.startBtn.classList.remove('hide-down');
   }

   /* Перестановка двух элементов между собой */
   swap(cur, next) {
      return new Promise((resolve) => {
         let temp = cur.style.transform;

         cur.style.transform = next.style.transform;
         next.style.transform = temp;

         setTimeout(() => {
            this.elemsWrapper.insertBefore(next, cur);
            resolve();
         }, 400);
      });
   }
}

/* Инициализируем экземпляр класса для всех одноименных родительских блоков */
[].slice.call(document.querySelectorAll('.sort-page')).forEach(item => {
   if (item) {
      new Sort(item);
   }
});
