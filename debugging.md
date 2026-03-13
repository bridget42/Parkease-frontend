# day 4 Debugging Assignment

## What I Found Using DevTools

While debugging ParkEase with Chrome DevTools, I discovered two issues:

### 1. Plate Validation Regex Error
- The original regex `/[/s/g]/g` was invalid and would cause errors.
- It was also checking for the wrong format (`###-#####` instead of Ugandan plates like "UBA123X").

### 2. Fee Calculation vs Display
- For a vehicle with `vehicleType="Personal Car"`, `durationHrs=2`, `hour=21`, the calculated fee was 2,000 UGX.
- However, the page showed a static example with 12,000 UGX, which could confuse users.

### How DevTools Helped
- **Breakpoints**: Paused inside `calculateFee()` to inspect variables.
- **Scope Panel**: Saw `durationHrs=2`, `isShort=true`, `r.short=2000`.
- **Watch Expressions**: Monitored `vehicleType`, `hour`, `isDay`, `isShort`.
- **Console**: Tested `calculateFee()` with different inputs.

### The Fix
Corrected the plate validation regex:
```javascript
function validatePlate(plate) {
    const clean = plate.replace(/\s/g, '').toUpperCase();
    return /^U[A-Z0-9]{2,6}$/.test(clean);
}

## Bonus Challenge Steps

### Conditional Breakpoint for Zero Fee:

1. **Right-click** the line where fee is calculated
2. Choose **Add conditional breakpoint**
3. Enter: `fee === 0 || fee === undefined`
4. Now it will only pause if something's wrong with the fee!

### ReferenceError Practice:

1. In your code, change a variable name:
 
   // Change this:
   const fee = rate * hours;
   
   // To this (typo):
   const feee = rate * hours;
   return fee;  // ReferenceError!