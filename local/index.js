// Получаем DOM элементы
const fetchButton = document.getElementById('fetchButton');
const responseForm = document.getElementById('responseForm');
const responseColor = document.getElementById('responseColor');
const randomData = document.getElementById('randomData');
const serverUrlInput = document.getElementById('serverUrlInput');
const saveUrlButton = document.querySelector('.modal-button');
const modal = document.querySelector('.modal');

// Задаем изначальный случайный стиль кнопке
const styleClasses = {
    form: ['triangle', 'circle', 'square', 'square', 'rectangle'],
    color: ['red', 'orange', 'yellow', 'green', 'cian', 'blue', 'violet']
};

const randomIndex = (param) => Math.floor(Math.random() * param);
const randomForm = styleClasses.form[randomIndex(styleClasses.form.length)];
const randomColor = styleClasses.color[randomIndex(styleClasses.color.length)];

fetchButton.className = `button ${randomForm}`;
fetchButton.style.backgroundColor = randomColor;

let serverUrl = null;

// функция отправки запроса на сервер при нажатии кнопки
const sendRequest = (url) => {
    // Блокируем кнопку и меняем её цвет на серый
    fetchButton.disabled = true;
    fetchButton.style.backgroundColor = 'grey';

    // Отправка запроса на сервер
    fetch(`${url}/api/button`, {signal: AbortSignal.timeout(5000)})
        .then(response => response.json())
        .then(data => {

            // Обработка полученного ответа
            responseForm.textContent = data.form;
            responseColor.textContent = data.color;
            fetchButton.style.backgroundColor = data.color;
            fetchButton.className = `button ${data.form}`;

        })
        .catch(error => {
            // Вывод ошибки, если запрос не удался
            if (error.name === 'TimeoutError') {
                console.log('Превышен интервал ожидания ответа', error);
                responseForm.textContent = 'Timeout error';
                responseColor.textContent = 'Timeout error';
            } else {
                console.error('Проблема с операцией получения:', error);
                responseForm.textContent = 'Fetch error';
                responseColor.textContent = 'Fetch error';
            }
        })
        .finally(() => {
            // Восстанавливаем кнопку после завершения запроса
            fetchButton.disabled = false;
        });
}

// функция обновления третьего поля каждую секунду
const sendRandomRequest = (url) => {
    setInterval(() => {
        fetch(`${url}/api/random`, {signal: AbortSignal.timeout(3000)})
            .then(response => response.json())
            .then(data => {
                // Обработка полученного ответа
                randomData.textContent = data.answer;
            })
            .catch(error => {
                if (error.name === 'TimeoutError') {
                    console.log('Превышен интервал ожидания ответа', error);
                    randomData.textContent = 'Timeout error';
                } else {
                    console.error('Проблема с операцией получения:', error);
                    randomData.textContent = 'Fetch error';
                }
            });
    }, 1000);
}

saveUrlButton.addEventListener('click', () => {
    serverUrl = serverUrlInput.value.trim();
    if (!serverUrl) {
        alert('Please enter a server URL.');
        return;
    }
    sendRandomRequest(serverUrl);
    modal.style.display = 'none';
});

fetchButton.addEventListener('click', () => {
    sendRequest(serverUrl);
});