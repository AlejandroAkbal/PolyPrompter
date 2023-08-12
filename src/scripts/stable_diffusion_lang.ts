const reAttention = new RegExp(
    [
        '\\\\\\(|',
        '\\\\\\)|',
        '\\\\\\[|',
        '\\\\\\]|',
        '\\\\\\\\|',
        '\\||',
        '\\(|',
        '\\[|',
        ':([+-]?[.\\d]+)\\)|',
        '\\)|',
        '\\]|',
        '[^\\\\()\\[\\]:]+|',
        ':'
    ].join(''),
    'g'
);

const reBreak = /\s*\bBREAK\b\s*/gm;

type Attention = Array<[string, number]>;

function parseSDWUIAttentionFromPrompt(text: string): Attention {
    let res: Attention = [];
    const roundBrackets: number[] = [];
    const squareBrackets: number[] = [];

    const roundBracketMultiplier = 1.1;
    const squareBracketMultiplier = 1 / 1.1;

    const multiplyRange = (startPosition: number, multiplier: number): void => {
        for (let p = startPosition; p < res.length; p++) res[p][1] *= multiplier;
    };

    const matchIterator = text.matchAll(reAttention);

    // Iterating over the matches received
    for (const m of matchIterator) {
        const text = m[0];
        const weight = m[1];

        if (text.startsWith('\\')) {
            res.push([text.slice(1), 1.0]);
        }

        else if (text == '(') {
            roundBrackets.push(res.length);
        }
        else if (text == '[') {
            squareBrackets.push(res.length);
        }
        else if (weight && roundBrackets.length > 0) {
            multiplyRange(roundBrackets.pop() as number, parseFloat(weight));
        }
        else if (text == ')' && roundBrackets.length > 0) {
            multiplyRange(roundBrackets.pop() as number, roundBracketMultiplier);
        }
        else if (text == ']' && squareBrackets.length > 0) {
            multiplyRange(squareBrackets.pop() as number, squareBracketMultiplier);
        }
        else {
            const parts = text.split(reBreak);

            for (let i = 0; i < parts.length; i++) {
                if (i > 0) res.push(['BREAK', -1]);

                res.push([parts[i], 1.0]);
            }
        }
    }

    roundBrackets.forEach((pos) => multiplyRange(pos, roundBracketMultiplier));

    squareBrackets.forEach((pos) => multiplyRange(pos, squareBracketMultiplier));

    if (res.length === 0) {
        res = [['', 1.0]]
    };

    // Merge runs of identical weights
    let i = 0;

    while (i + 1 < res.length) {
        if (res[i][1] === res[i + 1][1]) {
            res[i][0] += res[i + 1][0];
            res.splice(i + 1, 1);
        } else {
            i += 1;
        }
    }

    return res;
}

function AttentionToInvokePrompt(attention: Attention): string {
    const tokens: string[] = [];

    for (let [text, weight] of attention) {
        weight = parseFloat(weight.toFixed(2));

        if (weight === 1.0) {
            tokens.push(text);
        } else {
            const pad = weight < 1.0 ? '-' : '+';

            const sign = pad.repeat(Math.round(Math.abs(weight - 1.0) / 0.1));

            tokens.push(`(${text})${sign}`);
        }
    }

    return tokens.join('');
}

export function translateSDWUIToInvoke(text: string): string {
    const attention = parseSDWUIAttentionFromPrompt(text);
    return AttentionToInvokePrompt(attention);
}