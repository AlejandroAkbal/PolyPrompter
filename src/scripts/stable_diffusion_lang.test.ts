import { describe, it, expect } from 'vitest';
import { translateSDWUIToInvoke } from './stable_diffusion_lang';

/**
 * Weights:
 * + is equivalent to 1.1
 * ++ is pow(1.1,2)
 * +++ is pow(1.1,3), etc
 * - means 0.9, -- means pow(0.9,2), etc
 * 
 */
describe('Stable Diffusion Language', () => {

	describe('Attention to Invoke', () => {

		it('Handles empty string', () => {
			const attentionText = "";
			const invokeText = "";

			const transformedText = translateSDWUIToInvoke(attentionText);

			expect(transformedText).toBe(invokeText);
		});

		it('Handles single word', () => {
			const attentionText = "masterpiece";
			const invokeText = "masterpiece";

			const transformedText = translateSDWUIToInvoke(attentionText);

			expect(transformedText).toBe(invokeText);
		});


		describe('Weight', () => {

			it('Does not handle weight without curly brackets', () => {
				const attentionText = "masterpiece:1.2";
				const invokeText = "masterpiece:1.2";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

			it('Handles word with 1 bracket', () => {
				const attentionText = "(masterpiece)";
				const invokeText = "(masterpiece)+";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

			it('Handles word with 2 curly brackets', () => {
				const attentionText = "((masterpiece))";
				const invokeText = "(masterpiece)++";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

			it('Handles word with 3 curly brackets', () => {
				const attentionText = "(((masterpiece)))";
				const invokeText = "(masterpiece)+++";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

			it('Handles word with square brackets', () => {
				const attentionText = "[masterpiece]";
				const invokeText = "(masterpiece)-";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

			it('Handles word with 2 square brackets', () => {
				const attentionText = "[[masterpiece]]";
				const invokeText = "(masterpiece)--";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

			it('Handles word with 3 square brackets', () => {
				const attentionText = "[[[masterpiece]]]";
				const invokeText = "(masterpiece)---";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

			it('Handles word with curly brackets and weight', () => {
				const attentionText = "(masterpiece:1.2)";
				const invokeText = "(masterpiece)++";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

			it('Handles word with 1.1 weight', () => {
				const attentionText = "(masterpiece:1.1)";
				const invokeText = "(masterpiece)+";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

			it('Handles word with 1.3 weight', () => {
				const attentionText = "(masterpiece:1.3)";
				const invokeText = "(masterpiece)+++";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

			it('Handles word with 1.4+ weight', () => {
				const attentionText = "(masterpiece:1.4)";
				const invokeText = "(masterpiece)++++";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

			it('Handles word with 0.9 weight', () => {
				const attentionText = "(masterpiece:0.9)";
				const invokeText = "(masterpiece)-";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

			it('Handles word with 0.8 weight', () => {
				const attentionText = "(masterpiece:0.8)";
				const invokeText = "(masterpiece)--";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

			it('Handles word with 0.7 weight', () => {
				const attentionText = "(masterpiece:0.7)";
				const invokeText = "(masterpiece)---";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

			it('Handles word with 0.6+ weight', () => {
				const attentionText = "(masterpiece:0.6)";
				const invokeText = "(masterpiece)----";

				const transformedText = translateSDWUIToInvoke(attentionText);

				expect(transformedText).toBe(invokeText);
			});

		});

		it('Handles LoRA', () => {
			const attentionText = "<lora:slingshot_v1.5:1>";
			const invokeText = "withLora(slingshot_v1.5,1)";

			const transformedText = translateSDWUIToInvoke(attentionText);

			expect(transformedText).toBe(invokeText);
		});

		// TODO: Embeddings?

		// TODO: Recursion: double combine everything does not break things

		it('Combines everything', () => {
			const attentionText = "(masterpiece:1.2), (best quality:1.2), (extremely detailed:1.2), (photorealistic:1.1), (extremely detailed face), (ultra detailed), (1girl:1.1), (from bellow, from behind:1.2), (on all fours:1.2), spread legs, (pussy close up:1.2), ((delicate eyes and face)), (slingshot swimsuit:1.26), (pubic hair:1.0), shiny skin, (((petite body))), {high ponytail|short|red} hair, (scared:1.4), (blush:1.2), (open mouth:1.0), (blonde:0.7), (onsen), <lora:slingshot_v1.5:1>"

			const invokeText = "(masterpiece)++, (best quality)++, (extremely detailed)++, (photorealistic)+, (extremely detailed face)+, (ultra detailed)+, (1girl)+, (from bellow, from behind)++, (on all fours)++, spread legs, (pussy close up)++, (delicate eyes and face)++, (slingshot swimsuit)+++, pubic hair, shiny skin, (petite body)+++, {high ponytail|short|red} hair, (scared)++++, (blush)++, open mouth, (blonde)---, (onsen)+, withLora(slingshot_v1.5,1)"

			const transformedText = translateSDWUIToInvoke(attentionText);

			expect(transformedText).toBe(invokeText);
		});
	});


});
