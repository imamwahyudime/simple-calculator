        // JavaScript logic including Memory Functions
        const display = document.getElementById('display');
        let operatorPressed = false;
        let decimalPressedInCurrentNumber = false;
        const errorMsg = "Error";
        const infinityMsg = "Infinity";

        // --- Memory Variable ---
        let memoryValue = 0;

        function updateDisplay(value) {
            try {
                let displayValue = String(value);
                if (displayValue === "NaN") { display.value = errorMsg; return; }
                if (displayValue === infinityMsg || displayValue === "-Infinity") { display.value = infinityMsg; return; }
                display.value = displayValue;
                operatorPressed = ['+', '-', '*', '/'].includes(displayValue.slice(-1));
                decimalPressedInCurrentNumber = displayValue.includes('.') && displayValue.lastIndexOf('.') > Math.max(displayValue.lastIndexOf('+'), displayValue.lastIndexOf('-'), displayValue.lastIndexOf('*'), displayValue.lastIndexOf('/'));
            } catch (e) { display.value = errorMsg; }
        }

        function appendNumber(number) {
            if (display.value === errorMsg || display.value === infinityMsg) { clearDisplay(); }
            updateDisplay(display.value + number);
            operatorPressed = false;
        }

        function appendOperator(op) {
            const currentValue = display.value;
            if (currentValue === '' || currentValue === errorMsg || currentValue === infinityMsg) return;
            const lastChar = currentValue.slice(-1);
            if (operatorPressed && !(['*', '/'].includes(lastChar) && op === '-')) {
                if (['+', '-', '*', '/'].includes(lastChar)) {
                    updateDisplay(currentValue.slice(0, -1) + op);
                    operatorPressed = true;
                    decimalPressedInCurrentNumber = false;
                    return;
                }
            }
            updateDisplay(currentValue + op);
            operatorPressed = true;
            decimalPressedInCurrentNumber = false;
        }

        function appendDecimal() {
            const currentValue = display.value;
            if (currentValue === errorMsg || currentValue === infinityMsg) return;
            if (decimalPressedInCurrentNumber) return;
            if (currentValue === '' || operatorPressed) { updateDisplay(currentValue + '0.'); }
            else { updateDisplay(currentValue + '.'); }
            decimalPressedInCurrentNumber = true;
            operatorPressed = false;
        }

        function clearDisplay() {
            updateDisplay('');
            display.placeholder = '0';
            operatorPressed = false;
            decimalPressedInCurrentNumber = false;
        }

        function deleteLast() {
            const currentValue = display.value;
            if (currentValue === errorMsg || currentValue === infinityMsg) { clearDisplay(); return; }
            updateDisplay(currentValue.slice(0, -1));
        }

        function calculateSqrt() {
            try {
                const currentValue = parseFloat(display.value);
                if (isNaN(currentValue)) { updateDisplay(errorMsg); }
                else if (currentValue < 0) { updateDisplay("Neg √ Error"); }
                else { updateDisplay(parseFloat(Math.sqrt(currentValue).toPrecision(12))); }
            } catch (e) { updateDisplay(errorMsg); }
            operatorPressed = false;
            decimalPressedInCurrentNumber = display.value.includes('.');
        }

        function calculatePercent() {
            try {
                const currentValue = parseFloat(display.value);
                if (isNaN(currentValue)) { updateDisplay(errorMsg); }
                else { updateDisplay(parseFloat((currentValue / 100).toPrecision(12))); }
            } catch (e) { updateDisplay(errorMsg); }
            operatorPressed = false;
            decimalPressedInCurrentNumber = display.value.includes('.');
        }

        function calculateResult() {
            const expression = display.value;
            if (expression === '' || expression === errorMsg || expression === infinityMsg) return;
            try {
                const sanitizedExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
                if (['+', '-', '*', '/'].includes(sanitizedExpression.slice(-1))) { updateDisplay(errorMsg); return; }
                const calculate = new Function('return ' + sanitizedExpression);
                const result = calculate();
                if (isNaN(result)) { updateDisplay(errorMsg); }
                else if (!isFinite(result)) { updateDisplay(infinityMsg); }
                else { updateDisplay(parseFloat(result.toPrecision(12))); }
            } catch (error) { console.error("Calculation Error:", error); updateDisplay(errorMsg); }
            operatorPressed = false;
            decimalPressedInCurrentNumber = display.value.includes('.');
        }

        // --- Memory Functions ---

        /**
         * Clears the value stored in memory.
         */
        function memoryClear() {
            memoryValue = 0;
            // Optional: Add feedback to user e.g., console.log("Memory Cleared");
        }

        /**
         * Recalls the value from memory and displays it, replacing the current display content.
         */
        function memoryRecall() {
             // Convert memoryValue to string for display consistency, handle potential precision
             updateDisplay(parseFloat(memoryValue.toPrecision(12)));
             // When recalling, the display now holds a complete number, ready for next operation
             operatorPressed = false;
             // decimalPressedInCurrentNumber is updated by updateDisplay
        }

        /**
         * Adds the current display value to the value stored in memory.
         */
        function memoryAdd() {
            const currentValueStr = display.value;
            if (currentValueStr === errorMsg || currentValueStr === infinityMsg || currentValueStr === '') return;

            try {
                const currentValue = parseFloat(currentValueStr);
                if (!isNaN(currentValue)) {
                    memoryValue += currentValue;
                    // Optional: Add feedback e.g., console.log("Added to Memory. New Memory:", memoryValue);
                } else {
                    // Handle case where display has something non-numeric that isn't Error/Infinity
                     console.warn("M+ attempted on non-numeric display value:", currentValueStr);
                }
            } catch(e) {
                 console.error("Error during M+ operation:", e);
            }
             // Typically, M+ does not clear or change the display
        }

        /**
         * Subtracts the current display value from the value stored in memory.
         */
        function memorySubtract() {
             const currentValueStr = display.value;
            if (currentValueStr === errorMsg || currentValueStr === infinityMsg || currentValueStr === '') return;

             try {
                 const currentValue = parseFloat(currentValueStr);
                if (!isNaN(currentValue)) {
                    memoryValue -= currentValue;
                     // Optional: Add feedback e.g., console.log("Subtracted from Memory. New Memory:", memoryValue);
                } else {
                    console.warn("M- attempted on non-numeric display value:", currentValueStr);
                }
            } catch(e) {
                console.error("Error during M- operation:", e);
            }
             // Typically, M- does not clear or change the display
        }

         clearDisplay(); // Initialize
