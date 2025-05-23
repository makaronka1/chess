function Move (event) {
    const eventTarget = event.target;
    const eventTargetSquare = eventTarget.parentElement;
    const eventTargetRow = eventTargetSquare.parentElement;
    const squareIndex = Array.from(eventTargetRow.children).indexOf(eventTargetSquare);
  
    moveCheck('pawn', eventTarget, eventTargetRow.id, squareIndex);
    eatingCheck('pawn', eventTarget, eventTargetRow.id, squareIndex);
  }
  
  
  function moveCheck (figure, target, figureRowId, figureSquareIndex) {
    selectedFigure = target;
    removeHighlightedSquares();
    const clearFigureRowId = figureRowId.slice(1);
    /*----------------------------------------Пешка---------------------------------------*/
    if (figure == 'pawn') {
      if (target.classList.contains('white-pawn')) {
        if (clearFigureRowId == '7') {
          const stepsNumber = 2;
  
          for (let i = 1; i <= stepsNumber; i++) {
            try {
              const targetRow = document.querySelector(`#_${clearFigureRowId - i}`);
              const targetSquare = targetRow.children[figureSquareIndex];
  
              if (targetSquare.hasChildNodes()) {
                return;
              } else if (!targetSquare.hasChildNodes()) {
                targetSquare.classList.add('highlight-green');
                availableMoveSquares();
              }
            } catch {
              console.log('ход невозможен');
            }
            
          }
  
        } else {
          const stepsNumber = 1;
  
          try {
            const targetRow = document.querySelector(`#_${clearFigureRowId - stepsNumber}`);
            const targetSquare = targetRow.children[figureSquareIndex];
  
            if (targetSquare.hasChildNodes()) {
              return;
            } else if (!targetSquare.hasChildNodes()) {
              targetSquare.classList.add('highlight-green');
              availableMoveSquares();
            }
          } catch {
            console.log('ход невозможен');
          }
           
        }
      } else if (target.classList.contains('black-pawn')) {
        if (clearFigureRowId == '2') {
          const stepsNumber = 2;

          try {
            for (let i = 1; i <= stepsNumber; i++) {
              const targetRow = document.querySelector(`#_${parseInt(clearFigureRowId) + parseInt(i)}`);
              const targetSquare = targetRow.children[figureSquareIndex];
    
              if (targetSquare.hasChildNodes()) {
                return;
              } else if (!targetSquare.hasChildNodes()) {
                targetSquare.classList.add('highlight-green');
                availableMoveSquares();
              }
            }  
          } catch {
            console.log('ход невозможен');
          }
          
        } else {
          const stepsNumber = 1;
  
          try {
            const targetRow = document.querySelector(`#_${clearFigureRowId + stepsNumber}`);
            const targetSquare = targetRow.children[figureSquareIndex];
    
            if (targetSquare.hasChildNodes()) {
              return;
            } else if (!targetSquare.hasChildNodes()) {
              targetSquare.classList.add('highlight-green');
            }
          } catch {
            console.log('ход невозможен');
          }
  
        }
      }
    }
    /*--------------------------------------------------------------------------------------*/
  }
  
  // function eatingCheck (figure, target, figureRowId, figureSquareIndex) {
  //   const clearFigureRowId = figureRowId.slice(1);
  
  //   if (figure == 'pawn') {
  //     if (target.classList.contains('white-pawn')) {
  //       const targetRow = document.querySelector(`#_${clearFigureRowId - 1}`);
  
  //       try {
  //         let targetLeftSquare = targetRow.children[figureSquareIndex - 1];
  
  //         if (targetLeftSquare.hasChildNodes()) {
  //           targetLeftSquare.classList.add('highlight-red');
  //           availableEatSquares();
  //         }
  //       } catch {
  //         console.log("Невозможно съесть слева")
  //       }
  
  //       try {
  //         let targetRightSquare = targetRow.children[parseInt(figureSquareIndex) + parseInt(1)];
  
  //         if (targetRightSquare.hasChildNodes()) {
  //           targetRightSquare.classList.add('highlight-red');
  //           availableEatSquares();
  //         }
  //       } catch {
  //         console.log("Невозможно съесть справа")
  //       }
   
  //     }
  
  //   }
  // }
  
  function availableEatSquares () {
    let availableSquares = document.querySelectorAll('.highlight-red');
    console.log(availableSquares)
    availableSquares.forEach(square => {
      square.addEventListener('click', function(e) {
        figureEat(e);
        e.stopImmediatePropagation(); // Блокирует другие обработчики
      }, true); // Используем фазу capturing
    });
  }
  
  function availableMoveSquares () {
    let availableSquares = document.querySelectorAll('.highlight-green');
    for (let square of availableSquares) {
      square.addEventListener('click', figureMove);
    }
  }
  
  // function figureMove (event) {
  //   const target = event.target;
  //   console.log(target);
  //   target.appendChild(selectedFigure);
  //   selectedFigure = null;
  //   removeHighlightedSquares();
  // }
  
  // function figureEat(event) {
  //   const target = event.target;
  //   const parentTarget = target.parentElement; // Получаем клетку (.square)
    
  //   // 1. Удаляем съеденную фигуру
  //   parentTarget.removeChild(target);
    
  //   // 2. Перемещаем нашу фигуру
  //   parentTarget.appendChild(selectedFigure);
    
  //   // 3. Обновляем глобальную ссылку на фигуру
  //   selectedFigure = parentTarget.firstChild;
    
  //   // 4. Очищаем выделения
  //   removeHighlightedSquares();
  // }
