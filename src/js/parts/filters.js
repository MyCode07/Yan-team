const filterSortBtn = document.querySelector('.filter-sort__btn');
const filterSortSpan = document.querySelector('.filter-sort__btn span');
const filterSortSelect = document.querySelector('.filter-sort .select');
const filterSortSelectElements = document.querySelectorAll('.filter-sort .select label');

if (filterSortBtn) {


    filterSortBtn.addEventListener('click', () => {
        filterSortBtn.classList.toggle('_active');
        filterSortSelect.classList.toggle('_active');
    });

    filterSortSelectElements.forEach(element => {
        element.addEventListener('click', (e) => {
            const elementText = e.target.textContent;
            filterSortSpan.textContent = elementText;
        });
    });

    document.addEventListener('click', function (e) {
        let targetEl = e.target;
        if (!targetEl.classList.contains('filter-sort__btn')) {
            filterSortBtn.classList.remove('_active');
            filterSortSelect.classList.remove('_active');
        }
    })

    const filterSortCurrency = document.querySelectorAll('.filter-currency a');

    filterSortCurrency.forEach(element => {
        element.addEventListener('click', (e) => {
            element.classList.toggle('_active');
        });
    });

}


const showTextBtn = document.querySelector('._show-text');
const textBody = document.querySelector('._text-description__body');

if (showTextBtn) {
    showTextBtn.addEventListener('click', () => {
        showTextBtn.classList.toggle('_active');
        textBody.classList.toggle('_active');
    });
}
