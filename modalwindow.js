
function showModal() {
  modalOverlay.style.display = 'block';
  pawnTransform.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
}

function hideModal() {
  modalOverlay.style.display = 'none';
  pawnTransform.style.display = 'none';
  document.body.style.overflow = ''; // Восстанавливаем прокрутку
}

// Закрытие по кнопке
closeButton.addEventListener('click', hideModal);
