const tr = document.querySelectorAll('tr');

tr.forEach(item => {

    return
    
    let name = item.querySelector('.filename')
    name.querySelector('span').remove()
    name = name.textContent.trim()

    let src = item.querySelector('img').src.replace('-150x150', '')

    let tr = document.createElement('tr')

    let td1 = document.createElement('td')
    td1.textContent = name

    let td2 = document.createElement('td')
    td2.textContent = src

    tr.append(td1, td2)

    // document.querySelector('.new').append(tr);

})