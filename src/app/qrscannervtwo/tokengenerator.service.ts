import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenGeneratorService {
  private generatedTokens: Set<number> = new Set();

  generateUnique4DigitToken(): number | undefined {
    const min = 1000; // Minimum 4-digit number
    const max = 9999; // Maximum 4-digit number

    if (this.generatedTokens.size >= (max - min + 1)) {
      return undefined; // All possible 4-digit numbers have been generated
    }

    let randomToken: number;
    do {
      randomToken = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (this.generatedTokens.has(randomToken));

    this.generatedTokens.add(randomToken);
    return randomToken;
  }
}
