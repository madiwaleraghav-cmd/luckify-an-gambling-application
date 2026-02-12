import { Bet, BetType, RED_NUMBERS, BLACK_NUMBERS } from "./types";

export function calculateWinnings(winningNumber: number, bets: Bet[]): number {
    let totalWinnings = 0;

    bets.forEach((bet) => {
        let won = false;
        let multiplier = 0;

        switch (bet.type) {
            case 'number':
                // Straight Up: 35 to 1
                if (Number(bet.value) === winningNumber) {
                    won = true;
                    multiplier = 35;
                }
                break;

            case 'color':
                // Red/Black: 1 to 1
                if (bet.value === 'red' && RED_NUMBERS.includes(winningNumber)) won = true;
                if (bet.value === 'black' && BLACK_NUMBERS.includes(winningNumber)) won = true;
                multiplier = 1;
                break;

            case 'parity':
                // Even/Odd: 1 to 1
                if (winningNumber !== 0) {
                    if (bet.value === 'even' && winningNumber % 2 === 0) won = true;
                    if (bet.value === 'odd' && winningNumber % 2 !== 0) won = true;
                }
                multiplier = 1;
                break;

            case 'range':
                // Low/High: 1 to 1
                if (winningNumber !== 0) {
                    if (bet.value === 'low' && winningNumber >= 1 && winningNumber <= 18) won = true;
                    if (bet.value === 'high' && winningNumber >= 19 && winningNumber <= 36) won = true;
                }
                multiplier = 1;
                break;

            case 'dozen':
                // Dozens: 2 to 1
                if (winningNumber !== 0) {
                    if (bet.value === '1st 12' && winningNumber >= 1 && winningNumber <= 12) won = true;
                    if (bet.value === '2nd 12' && winningNumber >= 13 && winningNumber <= 24) won = true;
                    if (bet.value === '3rd 12' && winningNumber >= 25 && winningNumber <= 36) won = true;
                }
                multiplier = 2;
                break;

            case 'column':
                // Columns: 2 to 1
                // Col 1: 1, 4, 7... (n % 3 === 1)
                // Col 2: 2, 5, 8... (n % 3 === 2)
                // Col 3: 3, 6, 9... (n % 3 === 0)
                if (winningNumber !== 0) {
                    if (bet.value === '1' && winningNumber % 3 === 1) won = true;
                    if (bet.value === '2' && winningNumber % 3 === 2) won = true;
                    if (bet.value === '3' && winningNumber % 3 === 0) won = true;
                }
                multiplier = 2;
                break;
        }

        if (won) {
            // Payout includes the original bet returned + winnings
            // Standard payout usually quoted as "35 to 1" means you get 35 profit + 1 original back = 36 total.
            // So if I bet 10, I get 360 back. 350 profit.
            // My logic here updates BALANCE. 
            // If the user's money was already deducted, we return (bet * multiplier) + bet.
            // E.g. 35 to 1 -> 35 * 10 + 10 = 360.
            totalWinnings += bet.amount * (multiplier + 1);
        }
    });

    return totalWinnings;
}
