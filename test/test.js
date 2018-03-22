'use strict';


  describe("Тестирование функции clearParameters(paramsObject)", function() {
      
      const testParameters = {};
      
      function makeValues(testParametersObject) {
            testParametersObject.cardAmount = 9;
            testParametersObject.countClosedPairs = 4;
            testParametersObject.sumPoints = -66;
            testParametersObject.gameCardArr = [13, 'рыба-карась', true];
            testParametersObject.guesCard = 123;
            testParametersObject.noticeCountDownTimer = 0;
            testParametersObject.cardCloseTimer = 0;
        
        };
      
      it("проверка очищения массива карт, parameters.gameCardArr.length = 0", function() {
          
        makeValues(testParameters);    
        clearParameters(testParameters);
        assert.equal(testParameters.gameCardArr.length, 0);
      });
      
      it("проверка восстановления кол-ва нераскрытых пар карт (стандартное значение 9), parameters.countClosedPairs = parameters.cardAmount = 9", function() {
          
        makeValues(testParameters);    
        clearParameters(testParameters);
        assert.equal(testParameters.countClosedPairs, testParameters.cardAmount);
      });
      
    it("проверка восстановления кол-ва нераскрытых пар карт при изменении parameters.cardAmount = 10, parameters.countClosedPairs = 10", function() {
          
        makeValues(testParameters);
        testParameters.cardAmount = 10;
        clearParameters(testParameters);
        assert.equal(testParameters.countClosedPairs, 10);
      });
      
    it("проверка обнуления кол-ва очков, parameters.sumPoints = 0", function() {
          
        makeValues(testParameters);  
        clearParameters(testParameters);
        assert.equal(testParameters.sumPoints, 0);
      });
      
    it("проверка обнуления таймера noticeCountDownTimer, таймер не сработал после отключения", function() {
          
        makeValues(testParameters);
        
        let value1 = 1;
        let value2 = 1;
        
        testParameters.noticeCountDownTimer = setInterval(function(){
            
           value1 ++;
            
        }, 100);
                
        clearParameters(testParameters);
            
        const myTimer = setInterval(function(){
            if (value1 == value2) {
                assert.equal(value1, value2);
            } else {
                value2++;
            }
        }, 200);
                    
      });
      
    it("проверка обнуления таймера cardCloseTimer, таймер не сработал после отключения", function() {

        makeValues(testParameters);

        let value1 = 1;
        let value2 = 1;

        testParameters.cardCloseTimer = setTimeout(function(){

           value1 ++;

        }, 100);

        clearParameters(testParameters);

        const myTimer = setTimeout(function(){
            if (value1 == value2) {
                assert.equal(value1, value2);
            }
        }, 200);

      });
      
    it("проверка обнуления guesCard, guesCard = null", function() {

        makeValues(testParameters);

        clearParameters(testParameters);
        
        assert.isNull(testParameters.guesCard);

      });


  });





 describe("Тестирование функции getRandomValue(minValue, maxValue)", function() {
     
     describe('проверка выдачи целого значения', function() {
        
        const testWholeNumber = function(min, max) {
            let testResult = getRandomValue(min, max);
            it('при min = ' + min + ' и max = ' + max + ', результат функции ' + testResult + ' - целое число', function() {
                assert.equal( testResult % 1, 0);
            });
        }

        testWholeNumber(-10, 10);
        testWholeNumber(-100, 100);
        testWholeNumber(-1000, 1000);
     });
     
     
     
     describe('проверка выдачи значения в пределах заданного min - max', function() {
        
        const testInInterval = function(min, max) {
            let testResult = getRandomValue(min, max);
            it('при min = ' + min + ' и max = ' + max + ', результат: ' + min + ' <= ' + testResult + ' <= ' + max, function() {
                assert.equal( ((testResult >= min)&&(testResult <= max)), true);
            });
        }
        
        for (let i = 0; i < 10; i++) {
            testInInterval(0, 10);
        }

     });
     
         
 });





 describe("Тестирование функции getRandomArr(arr, minValue, maxValue, amountValues)", function() {
     
     describe("проверка уникальности значений в массиве", function() {
        const testUniqueValues = function(minValue, maxValue, amountValues) {
             let testArr = [];
             let repeatingValueIndex = null;

             testArr = getRandomArr(testArr, minValue, maxValue, amountValues);

             for (let i = 0; i < testArr.length; i++) {

                 let position = testArr.indexOf(testArr[i]);

                 if (~testArr.indexOf(testArr[i], position + 1)) {
                        repeatingValueIndex = testArr.indexOf(testArr[i], position + 1);
                     }
             }

             it('при min = ' + minValue + ', max = ' + maxValue + ', amountValues = ' + amountValues + ', в массиве нет повторяющихся значений', function() {
                assert.isNull(repeatingValueIndex);             
             });
         }

         testUniqueValues(-10, 10, 5);

         testUniqueValues(0, 52, 9);

         testUniqueValues(0, 17, 18);  
    });
     
     describe("длина массива должна быть равна amountValues", function() {
         
        const testArrLength = function(minValue, maxValue, amountValues) {
             let testArr = [];

             testArr = getRandomArr(testArr, minValue, maxValue, amountValues);

             it('при min = ' + minValue + ', max = ' + maxValue + ', amountValues = ' + amountValues + ', длина массива равна ' + testArr.length, function() {
                assert.equal(testArr.length, amountValues);             
             });
         }

         testArrLength(-10, 10, 5);

         testArrLength(0, 52, 9);

         testArrLength(0, 17, 18);  
    });
   
 });





describe("Тестирование функции countPoints(isHit, paramsObject)", function() {
     
    const testParamsObj = {
        toDefaultValue: function() {
            this.sumPoints = 0;
            this.countClosedPairs = 5;
            this.multiplier = 42;
        } 
    };
    
    
    it('при непопадании не уменьшается значение countClosedPairs', function(){
        
        testParamsObj.toDefaultValue();
        countPoints(false, testParamsObj);
        assert.equal(testParamsObj.countClosedPairs, 5);
    });
    

    
    it('при непопадании очки sumPoints уменьшаются на (countClosedPairs * multiplier)', function(){
        
        testParamsObj.toDefaultValue();
        countPoints(false, testParamsObj);
        assert.equal(testParamsObj.sumPoints, -210);
    });
    
    it('при попадании значение countClosedPairs уменьшается на 1', function(){
            
        testParamsObj.toDefaultValue();
        countPoints(true, testParamsObj);
        assert.equal(testParamsObj.countClosedPairs, 4);
    });
  
    it('при попадании очки sumPoints увеличиваются на (countClosedPairs * multiplier)', function(){
        
        testParamsObj.toDefaultValue();
        countPoints(true, testParamsObj);
        assert.equal(testParamsObj.sumPoints, 210);
    });
    
 });





describe("Тестирование функции addTwinCard(cardArr)", function() {
    
    function makeTestArr() {
        let arr = [];
        
        for (let i = 0; i < 5; i++) {
            let arrValue = {};
            arrValue.name = 'Карта' + i;
            arrValue.number = i +' буби';
            arr[i] = arrValue;
        }
        
        return arr;
    }
    
    let testArr = makeTestArr();
    
    it('длина массивы увеличивается в 2 раза', function(){
        
        testArr = addTwinCard(testArr);
        assert.equal(testArr.length, 10);
    });
    
    testArr = makeTestArr();
    
    it('новые элементы - дубликаты изначальных', function(){
        
        const originTestArrLength = testArr.length;
        testArr = addTwinCard(testArr);
        const halfArr = testArr.splice(originTestArrLength, originTestArrLength)
        
        assert.sameDeepMembers(testArr, halfArr);
    });
    
    
});